/* MobileNav.tsx — Premium frosted-glass bottom nav for mobile */
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { CalendarDays, CheckSquare, PenLine, LayoutDashboard, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCalendarStore } from '../stores/useCalendarStore';
import { usePlannerStore } from '../stores/usePlannerStore';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home'    },
  { to: '/calendar',  icon: CalendarDays,   label: 'Calendar' },
  { to: '/planner',   icon: CheckSquare,    label: 'Planner'  },
  { to: '/answers',   icon: PenLine,        label: 'Answers'  },
];

const QUOTES = [
  'Every answer written is a step closer. 🔥',
  'The syllabus is vast. Your focus is vaster.',
  "Today's revision is tomorrow's recall.",
  'IAS is not luck. It is discipline compound-interest.',
  'Write one answer. Every. Single. Day.',
  'The rank you want needs the work you avoid.',
];

export function MobileNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { openCreateModal } = useCalendarStore();
  const { addTask } = usePlannerStore();
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const [fabPulse, setFabPulse] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setFabPulse(false), 3000);
    return () => clearTimeout(t);
  }, []);

  const handleFab = () => {
    const path = location.pathname;
    if (path.includes('calendar')) openCreateModal();
    else if (path.includes('planner')) {
      addTask({ title: 'New Task', priority: 'medium', status: 'todo', subtasks: [], dueDate: new Date().toISOString().split('T')[0] });
    } else if (path.includes('answers')) {
      navigate('/answers?add=1');
    } else {
      openCreateModal();
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 flex flex-col" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {/* Inspirational quote strip */}
      <div
        className="px-4 py-1.5 text-center truncate"
        style={{
          background: 'linear-gradient(90deg,rgba(108,99,255,0.15),rgba(201,168,76,0.15))',
          borderTop: '1px solid rgba(108,99,255,0.2)',
        }}
      >
        <p className="text-[10px] font-medium italic" style={{ color: 'rgba(201,168,76,0.8)' }}>{quote}</p>
      </div>

      {/* Nav bar */}
      <div
        style={{
          background: 'rgba(10,15,30,0.92)',
          backdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(42,52,71,0.5)',
        }}
      >
        <div className="flex items-center justify-around h-16 px-2 relative">

          {/* Left two items */}
          {NAV_ITEMS.slice(0, 2).map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className="flex-1 flex flex-col items-center gap-0.5 py-2 group">
              {({ isActive }) => (
                <>
                  <div
                    className="p-1.5 rounded-xl transition-all duration-200"
                    style={{ background: isActive ? 'rgba(201,168,76,0.12)' : 'transparent' }}
                  >
                    <Icon
                      size={20}
                      style={{ color: isActive ? '#C9A84C' : '#4A5568' }}
                      className="transition-colors"
                    />
                  </div>
                  <span
                    className="text-[9px] font-medium transition-colors"
                    style={{ color: isActive ? '#C9A84C' : '#4A5568' }}
                  >
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}

          {/* Center FAB */}
          <div className="flex-1 flex justify-center items-center -mt-6 relative">
            <button
              onClick={handleFab}
              className="relative w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-90"
              style={{
                background: 'linear-gradient(135deg, #C9A84C, #e8c870)',
                boxShadow: '0 4px 24px rgba(201,168,76,0.5), 0 0 0 4px rgba(10,15,30,0.9)',
              }}
            >
              <Plus size={26} color="#0A0F1E" strokeWidth={2.5} />
              {/* Pulse ring on first load */}
              {fabPulse && (
                <div
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{ background: 'rgba(201,168,76,0.3)' }}
                />
              )}
            </button>
          </div>

          {/* Right two items */}
          {NAV_ITEMS.slice(2, 4).map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className="flex-1 flex flex-col items-center gap-0.5 py-2 group">
              {({ isActive }) => (
                <>
                  <div
                    className="p-1.5 rounded-xl transition-all duration-200"
                    style={{ background: isActive ? 'rgba(201,168,76,0.12)' : 'transparent' }}
                  >
                    <Icon
                      size={20}
                      style={{ color: isActive ? '#C9A84C' : '#4A5568' }}
                      className="transition-colors"
                    />
                  </div>
                  <span
                    className="text-[9px] font-medium transition-colors"
                    style={{ color: isActive ? '#C9A84C' : '#4A5568' }}
                  >
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
