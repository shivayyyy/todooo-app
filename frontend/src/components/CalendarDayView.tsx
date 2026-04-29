/* ─── CalendarDayView.tsx ──────────────────────────────────────────────────── */
import { useRef, useState, useCallback, useEffect } from 'react';
import { useCalendarStore } from '../stores/useCalendarStore';
import { EventPopover } from './EventPopover';
import { fmtDate, isToday, fmt12, timeToMins, minsToTime } from '../lib/calendarUtils';
import { CalendarEvent } from '../types/calendar';

const HOUR_START = 7;
const HOUR_END   = 22;
const SLOT_H     = 56;
const TOTAL_SLOTS = (HOUR_END - HOUR_START) * 2;
const TIME_LABELS = Array.from({ length: HOUR_END - HOUR_START + 1 }, (_, i) => {
  const h = HOUR_START + i;
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:00 ${ampm}`;
});
const timeToRow = (t: string) => Math.round((timeToMins(t) - HOUR_START * 60) / 30) + 1;

export function CalendarDayView() {
  const { events, currentDate, selectedEventId, selectEvent, openCreateModal } =
    useCalendarStore();
  const anchor = new Date(currentDate + 'T00:00:00');
  const dayStr = fmtDate(anchor);
  const dayEvs = events.filter((e) => e.startDate === dayStr);
  const [popoverState, setPopoverState] = useState<{ event: CalendarEvent; x: number; y: number } | null>(null);
  const [nowMins, setNowMins] = useState(() => { const n = new Date(); return n.getHours() * 60 + n.getMinutes(); });
  const nowTop = ((nowMins - HOUR_START * 60) / 30) * SLOT_H;
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => { const n = new Date(); setNowMins(n.getHours() * 60 + n.getMinutes()); }, 60_000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    const h = () => { selectEvent(null); setPopoverState(null); };
    document.addEventListener('click', h);
    return () => document.removeEventListener('click', h);
  }, [selectEvent]);

  const handleSlotClick = useCallback((e: React.MouseEvent) => {
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const relY = e.clientY - rect.top;
    const slot = Math.floor(relY / SLOT_H);
    const startMins = HOUR_START * 60 + slot * 30;
    openCreateModal({ startDate: dayStr, startTime: minsToTime(startMins), endTime: minsToTime(startMins + 60) });
  }, [dayStr, openCreateModal]);

  const handleEventClick = useCallback((e: React.MouseEvent, ev: CalendarEvent) => {
    e.stopPropagation();
    if (selectedEventId === ev.id) { selectEvent(null); setPopoverState(null); return; }
    selectEvent(ev.id);
    setPopoverState({ event: ev, x: e.clientX, y: e.clientY });
  }, [selectedEventId, selectEvent]);

  const today = isToday(anchor);
  const heading = anchor.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col h-full" style={{ background: 'rgba(17,24,39,0.4)' }}>
      <div className="px-8 py-4 border-b flex items-center gap-3 shrink-0" style={{ borderColor: 'rgba(42,52,71,0.5)' }}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${today ? 'text-base' : 'text-text-hi bg-elevated'}`}
          style={today ? { background: 'linear-gradient(135deg,#C9A84C,#e8c870)', boxShadow: '0 4px 16px rgba(201,168,76,0.4)', color: '#0A0F1E' } : {}}>
          {anchor.getDate()}
        </div>
        <div>
          <p className="text-text-hi font-semibold">{heading}</p>
          <p className="text-xs text-text-low">{dayEvs.length} event{dayEvs.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex" style={{ minHeight: `${TOTAL_SLOTS * SLOT_H}px` }}>
          <div className="w-20 shrink-0 border-r sticky left-0" style={{ borderColor: 'rgba(42,52,71,0.35)', background: 'rgba(10,15,30,0.7)', backdropFilter: 'blur(16px)', zIndex: 10 }}>
            {TIME_LABELS.map((lbl, i) => (
              <div key={i} className="flex items-start justify-end pr-3" style={{ height: `${SLOT_H * 2}px`, paddingTop: '6px' }}>
                <span className="text-[10px] font-mono text-text-low">{lbl}</span>
              </div>
            ))}
          </div>

          <div ref={gridRef} className="flex-1 relative cursor-pointer" onClick={handleSlotClick} style={{ zIndex: 2 }}>
            {/* Hour lines */}
            {TIME_LABELS.map((_, i) => (
              <div key={i} className="absolute left-0 right-0 border-t" style={{ top: `${i * SLOT_H * 2}px`, borderColor: 'rgba(42,52,71,0.35)' }} />
            ))}
            {Array.from({ length: TOTAL_SLOTS }).map((_, i) => i % 2 === 1 ? (
              <div key={`h${i}`} className="absolute left-0 right-0 border-t border-dashed" style={{ top: `${i * SLOT_H}px`, borderColor: 'rgba(42,52,71,0.18)' }} />
            ) : null)}

            {/* Now line */}
            {nowMins >= HOUR_START * 60 && nowMins <= HOUR_END * 60 && isToday(anchor) && (
              <div className="absolute left-0 right-0 flex items-center pointer-events-none" style={{ top: `${nowTop}px`, zIndex: 30 }}>
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: '#C9A84C', boxShadow: '0 0 8px rgba(201,168,76,0.8)' }} />
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg,#C9A84C,#C9A84C40)' }} />
              </div>
            )}

            {/* Event blocks */}
            {dayEvs.map((ev) => {
              const rowStart = timeToRow(ev.startTime);
              const rowEnd   = timeToRow(ev.endTime);
              const top      = (rowStart - 1) * SLOT_H;
              const height   = Math.max((rowEnd - rowStart) * SLOT_H - 4, 24);
              const isSelected = selectedEventId === ev.id;
              return (
                <div key={ev.id} onClick={(e) => handleEventClick(e, ev)}
                  className="absolute rounded-xl border cursor-pointer overflow-hidden transition-all duration-200"
                  style={{
                    left: '8px', right: '8px',
                    top: `${top + 2}px`, height: `${height}px`,
                    zIndex: isSelected ? 25 : 15,
                    background: `linear-gradient(160deg,${ev.color}55,${ev.color}30)`,
                    backdropFilter: 'blur(8px)',
                    borderColor: `${ev.color}60`,
                    boxShadow: isSelected ? `0 0 0 2px ${ev.color}, 0 8px 30px ${ev.color}40` : `0 2px 8px rgba(0,0,0,0.3)`,
                  }}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" style={{ background: ev.color }} />
                  <div className="pl-4 pr-3 py-2 flex flex-col gap-0.5">
                    <span className="text-[10px] font-mono opacity-70" style={{ color: ev.color }}>{fmt12(ev.startTime)} → {fmt12(ev.endTime)}</span>
                    <span className="text-sm font-semibold text-text-hi">{ev.title}</span>
                    {ev.subject && <span className="text-xs text-text-mid">{ev.subject}</span>}
                    {ev.notes && height > 80 && <span className="text-xs text-text-low mt-1 line-clamp-2">{ev.notes}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {popoverState && (
        window.innerWidth < 640 ? (
          <div className="fixed inset-x-0 bottom-0 z-50" style={{ zIndex: 60 }} onClick={(e) => e.stopPropagation()}>
            <EventPopover event={popoverState.event} onClose={() => { selectEvent(null); setPopoverState(null); }} />
          </div>
        ) : (
          <div className="fixed z-50" style={{ top: Math.min(popoverState.y, window.innerHeight - 500), left: Math.min(popoverState.x + 12, window.innerWidth - 340) }} onClick={(e) => e.stopPropagation()}>
            <EventPopover event={popoverState.event} onClose={() => { selectEvent(null); setPopoverState(null); }} />
          </div>
        )
      )}
    </div>
  );
}
