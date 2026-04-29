/* ─── CalendarMonthView.tsx ─────────────────────────────────────────────────── */
/* Premium glassmorphism month grid, chip overflow, click-to-create             */

import { useCalendarStore } from '../stores/useCalendarStore';
import { EventPopover } from './EventPopover';
import { monthGridDays, fmtDate, isToday, DAY_NAMES } from '../lib/calendarUtils';
import { CalendarEvent } from '../types/calendar';
import { useState, useCallback, useEffect } from 'react';

export function CalendarMonthView() {
  const { events, currentDate, selectEvent, selectedEventId, openCreateModal } =
    useCalendarStore();

  const anchor = new Date(currentDate + 'T00:00:00');
  const cells  = monthGridDays(anchor);
  const thisMonth = anchor.getMonth();

  const [popoverState, setPopoverState] = useState<{ event: CalendarEvent; x: number; y: number } | null>(null);

  useEffect(() => {
    const h = () => { selectEvent(null); setPopoverState(null); };
    document.addEventListener('click', h);
    return () => document.removeEventListener('click', h);
  }, [selectEvent]);

  const handleEventClick = useCallback((e: React.MouseEvent, ev: CalendarEvent) => {
    e.stopPropagation();
    if (selectedEventId === ev.id) { selectEvent(null); setPopoverState(null); return; }
    selectEvent(ev.id);
    setPopoverState({ event: ev, x: e.clientX, y: e.clientY });
  }, [selectedEventId, selectEvent]);

  return (
    <div className="flex flex-col h-full" style={{ background: 'rgba(17,24,39,0.4)' }}>
      {/* Day-name row */}
      <div
        className="grid grid-cols-7 border-b shrink-0"
        style={{ borderColor: 'rgba(42,52,71,0.5)' }}
      >
        {DAY_NAMES.map((d) => (
          <div key={d} className="py-3 text-center text-xs font-semibold uppercase tracking-widest text-text-low">
            {d}
          </div>
        ))}
      </div>

      {/* 6-week grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-6" style={{ gap: '1px', background: 'rgba(42,52,71,0.25)' }}>
        {cells.map((day, idx) => {
          const dayStr = fmtDate(day);
          const dayEvs = events.filter((e) => e.startDate === dayStr);
          const isCurrentMonth = day.getMonth() === thisMonth;
          const todayCell = isToday(day);
          const visible = dayEvs.slice(0, 3);
          const overflow = dayEvs.length - 3;

          return (
            <div
              key={idx}
              onClick={() => openCreateModal({ startDate: dayStr })}
              className="flex flex-col gap-1 p-1.5 cursor-pointer group transition-colors relative overflow-hidden"
              style={{
                background: todayCell
                  ? 'rgba(201,168,76,0.05)'
                  : isCurrentMonth
                    ? 'rgba(17,24,39,0.6)'
                    : 'rgba(10,15,30,0.3)',
              }}
            >
              {/* Date number */}
              <div className="flex justify-end">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all
                    ${todayCell ? 'text-base font-bold' : isCurrentMonth ? 'text-text-mid group-hover:text-text-hi' : 'text-text-low/40'}`}
                  style={todayCell ? {
                    background: 'linear-gradient(135deg, #C9A84C, #e8c870)',
                    boxShadow: '0 2px 12px rgba(201,168,76,0.5)',
                    color: '#0A0F1E',
                  } : {}}
                >
                  {day.getDate()}
                </span>
              </div>

              {/* Event chips */}
              <div className="flex flex-col gap-0.5">
                {visible.map((ev) => (
                  <div
                    key={ev.id}
                    onClick={(e) => handleEventClick(e, ev)}
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium truncate cursor-pointer hover:brightness-110 transition-all border"
                    style={{
                      background: `${ev.color}25`,
                      borderColor: `${ev.color}40`,
                      color: ev.color,
                    }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ev.color }} />
                    <span className="truncate">{ev.title}</span>
                  </div>
                ))}
                {overflow > 0 && (
                  <div className="text-[10px] text-text-low px-1">+{overflow} more</div>
                )}
              </div>

              {/* Hover new+ indicator */}
              <div className="absolute top-1 left-2 opacity-0 group-hover:opacity-100 transition-opacity text-text-low text-xs">+</div>
            </div>
          );
        })}
      </div>

      {/* Popover */}
      {popoverState && (
        window.innerWidth < 640 ? (
          <div className="fixed inset-x-0 bottom-0 z-50" style={{ zIndex: 60 }} onClick={(e) => e.stopPropagation()}>
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
