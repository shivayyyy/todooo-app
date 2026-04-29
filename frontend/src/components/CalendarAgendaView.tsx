/* ─── CalendarAgendaView.tsx ─────────────────────────────────────────────────── */
import { useState } from 'react';
import { useCalendarStore } from '../stores/useCalendarStore';
import { EventPopover } from './EventPopover';
import { parseDate, fmt12, MONTH_NAMES } from '../lib/calendarUtils';
import { CalendarEvent } from '../types/calendar';
import { Calendar as CalIcon } from 'lucide-react';

export function CalendarAgendaView() {
  const { events, selectEvent, selectedEventId } = useCalendarStore();
  const [popoverState, setPopoverState] = useState<{ event: CalendarEvent; x: number; y: number } | null>(null);

  // Group events by date, sorted
  const grouped = events
    .slice()
    .sort((a, b) => (a.startDate + a.startTime).localeCompare(b.startDate + b.startTime))
    .reduce<Record<string, CalendarEvent[]>>((acc, ev) => {
      acc[ev.startDate] = acc[ev.startDate] ?? [];
      acc[ev.startDate].push(ev);
      return acc;
    }, {});

  const dateKeys = Object.keys(grouped).sort();

  const handleClick = (e: React.MouseEvent, ev: CalendarEvent) => {
    e.stopPropagation();
    if (selectedEventId === ev.id) { selectEvent(null); setPopoverState(null); return; }
    selectEvent(ev.id);
    setPopoverState({ event: ev, x: e.clientX, y: e.clientY });
  };

  if (dateKeys.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-text-low">
        <CalIcon size={48} className="opacity-20" />
        <p className="text-sm">No upcoming events</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6" style={{ background: 'rgba(17,24,39,0.4)' }} onClick={() => { selectEvent(null); setPopoverState(null); }}>
      {dateKeys.map((dateStr) => {
        const d = parseDate(dateStr);
        const dayNum = d.getDate();
        const month = MONTH_NAMES[d.getMonth()];
        const weekday = d.toLocaleDateString('en-IN', { weekday: 'short' });
        const isT = dateStr === new Date().toISOString().split('T')[0];

        return (
          <div key={dateStr} className="flex gap-6">
            {/* Date badge */}
            <div className="flex flex-col items-center gap-0.5 w-14 shrink-0">
              <span className="text-xs font-semibold text-text-low uppercase">{weekday}</span>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                style={isT ? { background: 'linear-gradient(135deg,#C9A84C,#e8c870)', color: '#0A0F1E', boxShadow: '0 4px 16px rgba(201,168,76,0.4)' } : { color: '#A0AEC0' }}
              >
                {dayNum}
              </div>
              <span className="text-[10px] text-text-low">{month}</span>
            </div>

            {/* Event list */}
            <div className="flex-1 flex flex-col gap-2">
              {grouped[dateStr].map((ev) => {
                const isSelected = selectedEventId === ev.id;
                return (
                  <div
                    key={ev.id}
                    onClick={(e) => handleClick(e, ev)}
                    className="flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all hover:brightness-105"
                    style={{
                      background: isSelected ? `${ev.color}20` : 'rgba(17,24,39,0.7)',
                      backdropFilter: 'blur(12px)',
                      borderColor: isSelected ? `${ev.color}60` : 'rgba(42,52,71,0.5)',
                      boxShadow: isSelected ? `0 0 0 1px ${ev.color}40, 0 4px 16px ${ev.color}20` : '0 2px 8px rgba(0,0,0,0.2)',
                    }}
                  >
                    <div className="w-1 self-stretch rounded-full shrink-0" style={{ background: ev.color }} />
                    <div className="flex-1 flex flex-col gap-0.5">
                      <span className="text-sm font-semibold text-text-hi">{ev.title}</span>
                      <span className="text-xs font-mono text-text-mid">{fmt12(ev.startTime)} → {fmt12(ev.endTime)}</span>
                      {ev.subject && <span className="text-xs text-text-low">{ev.subject}</span>}
                    </div>
                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: ev.color }} />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

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
