/* DashboardPage.tsx — At-a-glance daily command center */
import { Link } from 'react-router-dom';
import { CalendarDays, CheckSquare, PenLine, Flame, TrendingUp, AlertTriangle, Target, LogOut } from 'lucide-react';
import { useCalendarStore } from '../stores/useCalendarStore';
import { usePlannerStore } from '../stores/usePlannerStore';
import { useAnswerStore } from '../stores/useAnswerStore';
import { useAuthStore } from '../stores/useAuthStore';
import { SUBJECT_COLOR } from '../types/planner';

const today = () => new Date().toISOString().split('T')[0];
const todayLabel = () => new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

function StatCard({ icon: Icon, label, value, sub, color, to }: { icon: any; label: string; value: string | number; sub?: string; color: string; to: string }) {
  return (
    <Link to={to} className="flex flex-col gap-3 p-5 rounded-2xl border transition-all hover:scale-[1.02] cursor-pointer"
      style={{ background: 'rgba(17,24,39,0.7)', borderColor: 'rgba(42,52,71,0.5)', boxShadow: `0 4px 24px ${color}10` }}>
      <div className="flex items-center justify-between">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon size={18} style={{ color }} />
        </div>
        <span className="text-2xl font-bold" style={{ color }}>{value}</span>
      </div>
      <div>
        <p className="text-sm font-semibold text-text-hi">{label}</p>
        {sub && <p className="text-xs text-text-low mt-0.5">{sub}</p>}
      </div>
    </Link>
  );
}

export function DashboardPage() {
  const { events } = useCalendarStore();
  const { tasks } = usePlannerStore();
  const { entries, weeklyTarget } = useAnswerStore();
  const { user, logout } = useAuthStore();

  const todayStr = today();

  // Stats
  const todayEvents = events.filter(e => e.startDate === todayStr);
  const activeTasks = tasks.filter(t => t.status !== 'done');
  const overdueTasks = tasks.filter(t => t.status !== 'done' && t.dueDate && t.dueDate < todayStr);
  const todayAnswers = entries.filter(e => e.dateAttempted === todayStr);

  // Writing streak
  let streak = 0;
  const d = new Date();
  while (entries.some(e => e.dateAttempted === d.toISOString().split('T')[0])) {
    streak++; d.setDate(d.getDate() - 1);
  }

  // Next exam
  const now = new Date();
  const nextExam = events.filter(e => e.type === 'exam' && new Date(e.startDate + 'T00:00:00') >= now).sort((a, b) => a.startDate.localeCompare(b.startDate))[0];
  const daysToExam = nextExam ? Math.ceil((new Date(nextExam.startDate + 'T00:00:00').getTime() - now.getTime()) / 86_400_000) : null;

  // Weekly answer target
  const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
  const weekAnswers = entries.filter(e => new Date(e.dateAttempted + 'T00:00:00') >= weekStart).length;

  // Today priority tasks
  const priorityTasks = tasks.filter(t => t.dueDate === todayStr && t.status !== 'done').slice(0, 5);

  // Last 7 streak days
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(); day.setDate(day.getDate() - (6 - i));
    const ds = day.toISOString().split('T')[0];
    return { ds, wrote: entries.some(e => e.dateAttempted === ds), label: ['M', 'T', 'W', 'T', 'F', 'S', 'S'][(day.getDay() + 6) % 7] };
  });

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 md:p-6 gap-6 pb-24 md:pb-6" style={{ background: 'rgba(17,24,39,0.4)' }}>
      {/* Header */}
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-text-low uppercase tracking-widest">{todayLabel()}</p>
          <h1 className="text-2xl font-bold text-text-hi mt-1 truncate max-w-[200px] md:max-w-md">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'} 👋 <span className="text-[#C9A84C]">{user?.username}</span></h1>
          {daysToExam !== null && (
            <div className="flex items-center gap-2 mt-2">
              <Target size={14} style={{ color: '#C9A84C' }} />
              <span className="text-sm font-semibold" style={{ color: '#C9A84C' }}>{nextExam!.title} in {daysToExam} day{daysToExam !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
        
        {/* Mobile logout button (hidden on desktop) */}
        <button 
          onClick={() => logout()}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={16} />
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={CalendarDays} label="Today's Events" value={todayEvents.length} sub="on calendar" color="#6C63FF" to="/calendar" />
        <StatCard icon={CheckSquare} label="Active Tasks" value={activeTasks.length} sub={overdueTasks.length > 0 ? `${overdueTasks.length} overdue ⚠️` : 'on track'} color="#C9A84C" to="/planner" />
        <StatCard icon={PenLine} label="Answers Today" value={todayAnswers.length} sub={`${weekAnswers}/${weeklyTarget} this week`} color="#DB2777" to="/answers" />
        <StatCard icon={Flame} label="Writing Streak" value={`${streak}d`} sub={streak > 0 ? 'Keep it up! 🔥' : 'Start today'} color={streak > 0 ? '#D97706' : '#4A5568'} to="/answers" />
      </div>

      {/* Overdue alert */}
      {overdueTasks.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border" style={{ background: 'rgba(239,68,68,0.07)', borderColor: 'rgba(239,68,68,0.25)' }}>
          <AlertTriangle size={16} style={{ color: '#EF4444' }} />
          <span className="text-sm text-red font-medium">{overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''} need attention</span>
          <Link to="/planner" className="ml-auto text-xs text-red/70 hover:text-red underline">View →</Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Today's tasks */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl border" style={{ background: 'rgba(17,24,39,0.6)', borderColor: 'rgba(42,52,71,0.5)' }}>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-text-hi text-sm">Today's Priority Tasks</h2>
            <Link to="/planner" className="text-xs text-text-low hover:text-gold transition-colors">See all →</Link>
          </div>
          {priorityTasks.length === 0 ? (
            <p className="text-xs text-text-low py-4 text-center">All clear for today! 🎉</p>
          ) : (
            priorityTasks.map(t => (
              <div key={t.id} className="flex items-center gap-3 py-2 border-b last:border-0" style={{ borderColor: 'rgba(42,52,71,0.3)' }}>
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: t.subject ? SUBJECT_COLOR[t.subject] : '#4A5568' }} />
                <p className="text-sm text-text-mid flex-1 truncate">{t.title}</p>
                {t.subject && <span className="text-[10px] text-text-low shrink-0">{t.subject}</span>}
              </div>
            ))
          )}
        </div>

        {/* Writing streak grid + today's events */}
        <div className="flex flex-col gap-3">
          {/* 7-day streak */}
          <div className="flex flex-col gap-3 p-4 rounded-2xl border" style={{ background: 'rgba(17,24,39,0.6)', borderColor: 'rgba(42,52,71,0.5)' }}>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-text-hi text-sm flex items-center gap-2">
                <Flame size={14} style={{ color: '#D97706' }} /> Writing Streak
              </h2>
              <span className="text-xs font-bold" style={{ color: '#C9A84C' }}>{streak} days</span>
            </div>
            <div className="flex gap-2">
              {last7.map(({ ds, wrote, label }) => (
                <div key={ds} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] text-text-low">{label}</span>
                  <div className="w-full aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold"
                    style={wrote ? { background: 'linear-gradient(135deg,#C9A84C,#e8c870)', color: '#0A0F1E' } : { background: 'rgba(42,52,71,0.4)', color: '#4A5568' }}>
                    {wrote ? '✓' : '·'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's events */}
          <div className="flex flex-col gap-2 p-4 rounded-2xl border flex-1" style={{ background: 'rgba(17,24,39,0.6)', borderColor: 'rgba(42,52,71,0.5)' }}>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-text-hi text-sm">Today on Calendar</h2>
              <Link to="/calendar" className="text-xs text-text-low hover:text-gold transition-colors">Open →</Link>
            </div>
            {todayEvents.length === 0 ? (
              <p className="text-xs text-text-low py-2 text-center">No events today</p>
            ) : (
              todayEvents.slice(0, 4).map(e => (
                <div key={e.id} className="flex items-center gap-2.5 py-1.5 border-b last:border-0" style={{ borderColor: 'rgba(42,52,71,0.3)' }}>
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: e.color }} />
                  <span className="text-xs text-text-mid flex-1 truncate">{e.title}</span>
                  <span className="text-[10px] font-mono text-text-low shrink-0">{e.startTime}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* No answer nudge */}
      {todayAnswers.length === 0 && new Date().getHours() >= 18 && (
        <div className="flex items-center gap-4 p-4 rounded-2xl border" style={{ background: 'rgba(217,119,6,0.07)', borderColor: 'rgba(217,119,6,0.25)' }}>
          <span className="text-2xl">✍️</span>
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: '#D97706' }}>No answer written today</p>
            <p className="text-xs text-text-low">Keep the streak alive — write at least one answer.</p>
          </div>
          <Link to="/answers" className="px-4 py-2 rounded-xl text-xs font-semibold" style={{ background: 'rgba(217,119,6,0.2)', color: '#D97706' }}>Log Now</Link>
        </div>
      )}
    </div>
  );
}
