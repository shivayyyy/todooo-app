/* ─── EventPopover.tsx — Mobile-safe (full-width bottom sheet on mobile) ─── */
import { Calendar, Edit2, Trash2, X, Clock, BookOpen } from 'lucide-react';
import { CalendarEvent, EVENT_TYPE_META } from '../types/calendar';
import { fmt12 } from '../lib/calendarUtils';
import { useCalendarStore } from '../stores/useCalendarStore';

interface Props {
  event: CalendarEvent;
  onClose: () => void;
}

export function EventPopover({ event, onClose }: Props) {
  const { deleteEvent, openEditModal } = useCalendarStore();
  const meta = EVENT_TYPE_META[event.type];

  return (
    /* On mobile: full-width, rounded top corners only.
       On desktop: fixed w-80, all corners rounded. */
    <div
      className="w-full sm:w-80 rounded-t-2xl sm:rounded-2xl border shadow-2xl overflow-hidden"
      style={{
        background: 'rgba(17,24,39,0.97)',
        backdropFilter: 'blur(28px)',
        borderColor: 'rgba(42,52,71,0.7)',
        boxShadow: `0 0 0 1px rgba(42,52,71,0.4), 0 -8px 48px rgba(0,0,0,0.6), 0 0 40px ${event.color}20`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Pull bar (mobile) */}
      <div className="flex justify-center pt-2 sm:hidden">
        <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(74,85,104,0.5)' }} />
      </div>

      {/* Colour strip */}
      <div className="h-1 w-full mt-1" style={{ background: `linear-gradient(90deg,${event.color},${event.color}60)` }} />

      <div className="p-4 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-text-hi text-sm leading-snug flex-1 pr-2">{event.title}</h3>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => { openEditModal(event.id); onClose(); }}
              className="p-1.5 rounded-lg text-text-mid hover:text-text-hi hover:bg-elevated transition-all">
              <Edit2 size={13} />
            </button>
            <button onClick={onClose}
              className="p-1.5 rounded-lg text-text-mid hover:text-text-hi hover:bg-elevated transition-all">
              <X size={13} />
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium border"
            style={{ background: meta.bg, color: meta.color, borderColor: `${meta.color}40` }}>
            {meta.label}
          </span>
          {event.subject && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium border"
              style={{ borderColor: 'rgba(42,52,71,0.5)', color: '#A0AEC0', background: 'rgba(28,35,51,0.6)' }}>
              {event.subject}
            </span>
          )}
        </div>

        {/* Date */}
        <div className="flex items-center gap-2.5 text-xs text-text-mid">
          <Calendar size={13} style={{ color: event.color }} />
          <span>{new Date(event.startDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
        </div>

        {/* Time */}
        <div className="flex items-center gap-2.5 text-xs text-text-mid">
          <Clock size={13} style={{ color: event.color }} />
          <span className="font-mono">{fmt12(event.startTime)} → {fmt12(event.endTime)}</span>
        </div>

        {/* Subject */}
        {event.subject && (
          <div className="flex items-center gap-2.5 text-xs text-text-mid">
            <BookOpen size={13} style={{ color: event.color }} />
            <span>{event.subject}</span>
          </div>
        )}

        {/* Notes */}
        {event.notes && (
          <p className="text-xs text-text-mid leading-relaxed border-t pt-3" style={{ borderColor: 'rgba(42,52,71,0.4)' }}>
            {event.notes}
          </p>
        )}

        {/* Delete */}
        <button onClick={() => { deleteEvent(event.id); onClose(); }}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border transition-all text-xs font-medium"
          style={{ borderColor: 'rgba(239,68,68,0.2)', color: 'rgba(239,68,68,0.8)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
          <Trash2 size={12} /> Delete Event
        </button>
      </div>
    </div>
  );
}
