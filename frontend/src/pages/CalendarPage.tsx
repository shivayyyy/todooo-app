/* ─── CalendarPage.tsx — Mobile-first responsive ─────────────────────────── */
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Target, MoreHorizontal } from 'lucide-react';
import { useCalendarStore } from '../stores/useCalendarStore';
import { CalendarWeekView } from '../components/CalendarWeekView';
import { CalendarMonthView } from '../components/CalendarMonthView';
import { CalendarDayView } from '../components/CalendarDayView';
import { CalendarAgendaView } from '../components/CalendarAgendaView';
import { EventModal } from '../components/EventModal';
import { MONTH_NAMES } from '../lib/calendarUtils';
import { CalendarView } from '../types/calendar';

const VIEW_OPTIONS: { key: CalendarView; label: string; short: string }[] = [
  { key: 'month',  label: 'Month',  short: 'Mo' },
  { key: 'week',   label: 'Week',   short: 'Wk' },
  { key: 'day',    label: 'Day',    short: 'D'  },
  { key: 'agenda', label: 'Agenda', short: 'Ag' },
];

export function CalendarPage() {
  const { view, setView, navigate, currentDate, events, openCreateModal } = useCalendarStore();

  const anchor = new Date(currentDate + 'T00:00:00');
  const monthLabel = `${MONTH_NAMES[anchor.getMonth()]} ${anchor.getFullYear()}`;

  // Analytics values
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const weekEvents = events.filter((e) => {
    const d = new Date(e.startDate + 'T00:00:00');
    return d >= weekStart && d <= now;
  });
  const studyHrs = weekEvents
    .filter((e) => e.type === 'study' || e.type === 'answer_writing' || e.type === 'revision')
    .reduce((acc, e) => {
      const [sh, sm] = e.startTime.split(':').map(Number);
      const [eh, em] = e.endTime.split(':').map(Number);
      return acc + ((eh * 60 + em) - (sh * 60 + sm)) / 60;
    }, 0);

  const nextExam = events
    .filter((e) => e.type === 'exam' && new Date(e.startDate + 'T00:00:00') >= now)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))[0];
  const daysToExam = nextExam
    ? Math.ceil((new Date(nextExam.startDate + 'T00:00:00').getTime() - now.getTime()) / 86_400_000)
    : null;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <EventModal />

      {/* ── Top Bar ── */}
      <div
        className="flex items-center gap-2 px-3 md:px-6 py-3 border-b shrink-0 flex-wrap"
        style={{ borderColor: 'rgba(42,52,71,0.5)', background: 'rgba(17,24,39,0.6)', backdropFilter: 'blur(16px)' }}
      >
        {/* Month + nav — shrinks gracefully */}
        <div className="flex items-center gap-1 min-w-0 flex-1">
          <button onClick={() => navigate('prev')} className="p-1.5 rounded-lg text-text-mid hover:bg-elevated hover:text-text-hi transition-all shrink-0">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => navigate('today')} className="px-2 py-1 rounded-lg text-[11px] font-semibold border transition-all shrink-0" style={{ borderColor: 'rgba(42,52,71,0.6)', color: '#A0AEC0' }}>
            Today
          </button>
          <button onClick={() => navigate('next')} className="p-1.5 rounded-lg text-text-mid hover:bg-elevated hover:text-text-hi transition-all shrink-0">
            <ChevronRight size={16} />
          </button>
          <h1 className="text-sm md:text-lg font-bold text-text-hi truncate ml-1">{monthLabel}</h1>
        </div>

        {/* View switcher — compact on mobile */}
        <div className="flex items-center gap-0.5 p-0.5 rounded-xl border shrink-0"
          style={{ background: 'rgba(10,15,30,0.6)', borderColor: 'rgba(42,52,71,0.5)' }}>
          {VIEW_OPTIONS.map(({ key, label, short }) => (
            <button key={key} onClick={() => setView(key)}
              className="px-2 md:px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={view === key
                ? { background: 'rgba(108,99,255,0.25)', color: '#6C63FF', border: '1px solid rgba(108,99,255,0.4)' }
                : { color: '#A0AEC0' }}>
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{short}</span>
            </button>
          ))}
        </div>

        {/* Add button */}
        <button onClick={() => openCreateModal()}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all hover:brightness-110 shrink-0"
          style={{ background: 'linear-gradient(135deg,#C9A84C,#e8c870)', color: '#0A0F1E', boxShadow: '0 4px 16px rgba(201,168,76,0.35)' }}>
          <Plus size={14} strokeWidth={2.5} />
          <span className="hidden sm:inline">Add Event</span>
        </button>
      </div>

      {/* ── Analytics Strip — hidden on tiny screens ── */}
      <div className="hidden sm:flex items-center gap-4 md:gap-6 px-4 md:px-6 py-2 border-b shrink-0 overflow-x-auto"
        style={{ borderColor: 'rgba(42,52,71,0.35)', background: 'rgba(17,24,39,0.4)' }}>
        <Pill label="Study" value={`${studyHrs.toFixed(1)}h`} accent="#6C63FF" />
        <Pill label="Events" value={`${weekEvents.length}`} accent="#10B981" />
        <Pill label="Total" value={`${events.length}`} accent="#C9A84C" />
        {daysToExam !== null && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-semibold ml-auto shrink-0"
            style={{ borderColor: 'rgba(201,168,76,0.4)', background: 'rgba(201,168,76,0.08)', color: '#C9A84C' }}>
            <Target size={11} />
            {nextExam!.title} · {daysToExam}d
          </div>
        )}
      </div>

      {/* ── View Content ── */}
      <div className="flex-1 overflow-hidden min-h-0">
        {view === 'week'   && <CalendarWeekView />}
        {view === 'month'  && <CalendarMonthView />}
        {view === 'day'    && <CalendarDayView />}
        {view === 'agenda' && <CalendarAgendaView />}
      </div>
    </div>
  );
}

function Pill({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
      <span className="text-[11px] text-text-low">{label}</span>
      <span className="text-xs font-bold font-mono" style={{ color: accent }}>{value}</span>
    </div>
  );
}
