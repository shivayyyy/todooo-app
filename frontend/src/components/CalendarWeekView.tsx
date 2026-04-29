/* ─── CalendarWeekView.tsx — Mobile-responsive (3-day on mobile, 7 on desktop) */
import { useRef, useEffect, useState, useCallback } from 'react';
import { useCalendarStore } from '../stores/useCalendarStore';
import { EventPopover } from './EventPopover';
import {
  weekDays, fmtDate, isSameDay, isToday,
  timeToMins, minsToTime, fmt12, DAY_NAMES,
} from '../lib/calendarUtils';
import { CalendarEvent } from '../types/calendar';

const HOUR_START    = 7;
const HOUR_END      = 22;
const SLOT_H        = 48;
const SLOTS_PER_HOUR = 2;
const TOTAL_SLOTS   = (HOUR_END - HOUR_START) * SLOTS_PER_HOUR;

const timeToRow = (t: string) => Math.round((timeToMins(t) - HOUR_START * 60) / 30) + 1;
const TIME_LABELS = Array.from({ length: HOUR_END - HOUR_START + 1 }, (_, i) => {
  const h = HOUR_START + i;
  return `${h % 12 || 12}${h >= 12 ? 'p' : 'a'}`;
});

// Detect mobile (≤640px) using a simple hook
function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 640);
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 640);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return mobile;
}

interface DragState {
  eventId: string;
  durationSlots: number;
  cursorOffsetSlots: number;
}

export function CalendarWeekView() {
  const { events, currentDate, selectedEventId, selectEvent, openCreateModal, moveEvent } =
    useCalendarStore();

  const isMobile = useIsMobile();
  const anchor    = new Date(currentDate + 'T00:00:00');
  const allDays   = weekDays(anchor);

  // On mobile show 3 days centred on today (or anchor)
  const days = isMobile
    ? (() => {
        const todayIdx = allDays.findIndex((d) => isToday(d));
        const centre = todayIdx >= 0 ? todayIdx : allDays.findIndex((d) => isSameDay(d, anchor));
        const start = Math.max(0, Math.min(centre - 1, allDays.length - 3));
        return allDays.slice(start, start + 3);
      })()
    : allDays;

  const colCount = days.length; // 3 on mobile, 7 on desktop

  const [popoverState, setPopoverState] = useState<{ event: CalendarEvent; x: number; y: number } | null>(null);
  const [nowMins, setNowMins] = useState(() => { const n = new Date(); return n.getHours() * 60 + n.getMinutes(); });
  useEffect(() => {
    const id = setInterval(() => { const n = new Date(); setNowMins(n.getHours() * 60 + n.getMinutes()); }, 60_000);
    return () => clearInterval(id);
  }, []);
  const nowTop = ((nowMins - HOUR_START * 60) / 30) * SLOT_H;

  const dragRef = useRef<DragState | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleDragStart = useCallback((e: React.DragEvent, event: CalendarEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const dur = (timeToMins(event.endTime) - timeToMins(event.startTime)) / 30;
    dragRef.current = { eventId: event.id, durationSlots: dur, cursorOffsetSlots: Math.floor((e.clientY - rect.top) / SLOT_H) };
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, dayDate: Date) => {
    e.preventDefault();
    const ds = dragRef.current;
    if (!ds || !gridRef.current) return;
    const relY = e.clientY - gridRef.current.getBoundingClientRect().top;
    const slot = Math.max(0, Math.floor(relY / SLOT_H) - ds.cursorOffsetSlots);
    const startMins = HOUR_START * 60 + slot * 30;
    moveEvent(ds.eventId, fmtDate(dayDate), minsToTime(startMins), minsToTime(startMins + ds.durationSlots * 30));
    dragRef.current = null;
  }, [moveEvent]);

  const handleSlotClick = useCallback((e: React.MouseEvent, dayDate: Date) => {
    if (dragRef.current) return;
    const relY = e.clientY - (e.currentTarget as HTMLElement).getBoundingClientRect().top;
    const slot = Math.floor(relY / SLOT_H);
    const startMins = HOUR_START * 60 + slot * 30;
    openCreateModal({ startDate: fmtDate(dayDate), startTime: minsToTime(startMins), endTime: minsToTime(startMins + 60) });
  }, [openCreateModal]);

  const handleEventClick = useCallback((e: React.MouseEvent, event: CalendarEvent) => {
    e.stopPropagation();
    if (selectedEventId === event.id) { selectEvent(null); setPopoverState(null); return; }
    selectEvent(event.id);
    // On mobile, centre the popover
    setPopoverState({ event, x: e.clientX, y: e.clientY });
  }, [selectedEventId, selectEvent]);

  useEffect(() => {
    const h = () => { selectEvent(null); setPopoverState(null); };
    document.addEventListener('click', h);
    return () => document.removeEventListener('click', h);
  }, [selectEvent]);

  const weekDateStrs = days.map(fmtDate);
  const weekEvents = events.filter((e) => weekDateStrs.includes(e.startDate));

  // Time gutter width: shorter on mobile
  const gutterW = isMobile ? 36 : 56;

  return (
    <div className="flex flex-col h-full min-w-0 select-none overflow-hidden" style={{ background: 'rgba(17,24,39,0.6)' }}>

      {/* ── Day headers ─────────────────────────────────────────────────────── */}
      <div className="flex shrink-0 border-b" style={{ borderColor: 'rgba(42,52,71,0.5)' }}>
        <div style={{ width: `${gutterW}px`, minWidth: `${gutterW}px` }} />
        {days.map((day, i) => {
          const tod = isToday(day);
          const dayName = DAY_NAMES[allDays.indexOf(day)];
          return (
            <div key={i} className="flex-1 flex flex-col items-center py-2 gap-0.5 border-r last:border-r-0 min-w-0"
              style={{ borderColor: 'rgba(42,52,71,0.35)' }}>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-text-low">{isMobile ? dayName.slice(0, 1) : dayName}</span>
              <div className="w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center text-xs md:text-sm font-bold transition-all"
                style={tod ? { background: 'linear-gradient(135deg,#C9A84C,#e8c870)', boxShadow: '0 4px 12px rgba(201,168,76,0.4)', color: '#0A0F1E' } : { color: '#A0AEC0' }}>
                {day.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Grid body ───────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
        <div className="flex" style={{ minHeight: `${TOTAL_SLOTS * SLOT_H}px` }}>

          {/* Time gutter */}
          <div className="shrink-0 border-r sticky left-0 z-10"
            style={{ width: `${gutterW}px`, borderColor: 'rgba(42,52,71,0.35)', background: 'rgba(10,15,30,0.85)', backdropFilter: 'blur(16px)' }}>
            {TIME_LABELS.map((label, i) => (
              <div key={i} className="flex items-start justify-end pr-1.5"
                style={{ height: `${SLOT_H * SLOTS_PER_HOUR}px`, paddingTop: '5px' }}>
                <span className="text-[9px] font-mono text-text-low leading-none">{label}</span>
              </div>
            ))}
          </div>

          {/* Columns */}
          <div
            ref={gridRef}
            className="relative"
            style={{ flex: 1, display: 'grid', gridTemplateColumns: `repeat(${colCount}, 1fr)`, minWidth: 0 }}
          >
            {/* Hour lines */}
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
              {TIME_LABELS.map((_, i) => (
                <div key={i} className="absolute left-0 right-0 border-t"
                  style={{ top: `${i * SLOT_H * SLOTS_PER_HOUR}px`, borderColor: 'rgba(42,52,71,0.35)' }} />
              ))}
              {Array.from({ length: TOTAL_SLOTS }).map((_, i) =>
                i % 2 === 1 ? (
                  <div key={`h${i}`} className="absolute left-0 right-0 border-t border-dashed"
                    style={{ top: `${i * SLOT_H}px`, borderColor: 'rgba(42,52,71,0.15)' }} />
                ) : null
              )}
            </div>

            {/* Drop zones */}
            {days.map((day, colIdx) => (
              <div key={colIdx} className="relative border-r last:border-r-0"
                style={{ borderColor: 'rgba(42,52,71,0.35)', gridColumn: colIdx + 1, gridRow: 1, height: `${TOTAL_SLOTS * SLOT_H}px`, background: isToday(day) ? 'rgba(201,168,76,0.02)' : 'transparent', zIndex: 2, cursor: 'pointer' }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, day)}
                onClick={(e) => handleSlotClick(e, day)}
              />
            ))}

            {/* Now line */}
            {nowMins >= HOUR_START * 60 && nowMins <= HOUR_END * 60 && (
              <div className="absolute left-0 right-0 flex items-center pointer-events-none" style={{ top: `${nowTop}px`, zIndex: 30 }}>
                <div className="w-2.5 h-2.5 rounded-full shrink-0 -ml-1" style={{ background: '#C9A84C', boxShadow: '0 0 8px rgba(201,168,76,0.8)' }} />
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg,#C9A84C,#C9A84C30)' }} />
              </div>
            )}

            {/* Event blocks */}
            {days.map((day, colIdx) => {
              const dayStr = fmtDate(day);
              const dayEvs = weekEvents.filter((e) => e.startDate === dayStr);
              return dayEvs.map((ev) => {
                const rowStart = timeToRow(ev.startTime);
                const rowEnd   = timeToRow(ev.endTime);
                const top      = (rowStart - 1) * SLOT_H;
                const height   = Math.max((rowEnd - rowStart) * SLOT_H - 3, 18);
                const isSelected = selectedEventId === ev.id;
                const colW = 100 / colCount;

                return (
                  <div key={ev.id} draggable
                    onDragStart={(e) => handleDragStart(e, ev)}
                    onClick={(e) => handleEventClick(e, ev)}
                    className="absolute rounded-lg border cursor-grab active:cursor-grabbing overflow-hidden transition-all duration-150"
                    style={{
                      left: `calc(${colIdx * colW}% + 2px)`,
                      width: `calc(${colW}% - 4px)`,
                      top: `${top + 1}px`,
                      height: `${height}px`,
                      zIndex: isSelected ? 25 : 15,
                      background: `linear-gradient(160deg,${ev.color}55,${ev.color}28)`,
                      backdropFilter: 'blur(6px)',
                      borderColor: `${ev.color}55`,
                      boxShadow: isSelected ? `0 0 0 2px ${ev.color}, 0 6px 24px ${ev.color}40` : '0 1px 4px rgba(0,0,0,0.3)',
                    }}
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 md:w-1 rounded-l-lg" style={{ background: ev.color }} />
                    <div className="pl-1.5 md:pl-2 pr-1 py-0.5 h-full flex flex-col overflow-hidden gap-0">
                      <span className="text-[9px] md:text-[10px] font-mono opacity-70 leading-tight" style={{ color: ev.color }}>{fmt12(ev.startTime)}</span>
                      <span className="text-[10px] md:text-xs font-semibold text-text-hi leading-tight line-clamp-2">{ev.title}</span>
                      {height > 55 && ev.subject && !isMobile && (
                        <span className="text-[9px] text-text-mid mt-auto">{ev.subject}</span>
                      )}
                    </div>
                  </div>
                );
              });
            })}
          </div>
        </div>
      </div>

      {/* Popover — full-width bottom sheet on mobile, floating on desktop */}
      {popoverState && (
        isMobile ? (
          <div className="fixed inset-x-0 bottom-0 z-50 pb-safe" style={{ zIndex: 60 }} onClick={(e) => e.stopPropagation()}>
            <EventPopover event={popoverState.event} onClose={() => { selectEvent(null); setPopoverState(null); }} />
          </div>
        ) : (
          <div className="fixed z-50"
            style={{ top: Math.min(popoverState.y, window.innerHeight - 500), left: Math.min(popoverState.x + 12, window.innerWidth - 340) }}
            onClick={(e) => e.stopPropagation()}>
            <EventPopover event={popoverState.event} onClose={() => { selectEvent(null); setPopoverState(null); }} />
          </div>
        )
      )}
    </div>
  );
}
