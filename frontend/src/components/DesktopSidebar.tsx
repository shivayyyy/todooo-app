/* DesktopSidebar.tsx — Premium 240px sidebar for desktop navigation */
import { NavLink, useLocation } from 'react-router-dom';
import { CalendarDays, CheckSquare, PenLine, LayoutDashboard, Settings, Flame, LogOut } from 'lucide-react';
import { useAnswerStore } from '../stores/useAnswerStore';
import { useAuthStore } from '../stores/useAuthStore';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/calendar',  icon: CalendarDays,   label: 'Calendar'  },
  { to: '/planner',   icon: CheckSquare,    label: 'Planner'   },
  { to: '/answers',   icon: PenLine,        label: 'Answers'   },
];

export function DesktopSidebar() {
  const { entries } = useAnswerStore();

  // Calculate writing streak
  const today = new Date().toISOString().split('T')[0];
  let streak = 0;
  const check = new Date();
  while (true) {
    const d = check.toISOString().split('T')[0];
    if (entries.some((e) => e.dateAttempted === d)) { streak++; check.setDate(check.getDate() - 1); }
    else break;
  }

  return (
    <aside
      className="hidden md:flex w-60 h-screen flex-col shrink-0"
      style={{
        background: 'rgba(10,15,30,0.92)',
        backdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(42,52,71,0.4)',
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-6 border-b" style={{ borderColor: 'rgba(42,52,71,0.4)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
          style={{ background: 'linear-gradient(135deg,#C9A84C,#e8c870)', boxShadow: '0 4px 16px rgba(201,168,76,0.3)' }}>
          ✍️
        </div>
        <div>
          <h1 className="font-bold text-sm tracking-wider uppercase leading-tight"
            style={{ background: 'linear-gradient(90deg,#C9A84C,#e8c870)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            CivicTask Pro
          </h1>
          <p className="text-[10px] text-text-low">UPSC Command Center</p>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className="group relative">
            {({ isActive }) => (
              <div
                className="flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer"
                style={{
                  background: isActive ? 'rgba(201,168,76,0.1)' : 'transparent',
                  borderLeft: isActive ? '3px solid #C9A84C' : '3px solid transparent',
                }}
              >
                <Icon
                  size={18}
                  style={{ color: isActive ? '#C9A84C' : '#4A5568' }}
                  className="transition-colors group-hover:text-text-mid shrink-0"
                />
                <span
                  className="text-sm font-medium transition-colors"
                  style={{ color: isActive ? '#C9A84C' : '#A0AEC0' }}
                >
                  {label}
                </span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#C9A84C', boxShadow: '0 0 6px rgba(201,168,76,0.8)' }} />
                )}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t flex flex-col gap-2" style={{ borderColor: 'rgba(42,52,71,0.4)' }}>
        {/* Streak badge */}
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl border"
          style={{ background: streak > 0 ? 'rgba(201,168,76,0.08)' : 'rgba(28,35,51,0.5)', borderColor: streak > 0 ? 'rgba(201,168,76,0.25)' : 'rgba(42,52,71,0.4)' }}
        >
          <Flame size={17} style={{ color: streak > 0 ? '#D97706' : '#4A5568' }} />
          <div>
            <p className="text-xs font-semibold" style={{ color: streak > 0 ? '#C9A84C' : '#4A5568' }}>
              {streak > 0 ? `${streak}-day streak 🔥` : 'No streak yet'}
            </p>
            <p className="text-[10px] text-text-low">Writing practice</p>
          </div>
        </div>

        {/* Settings */}
        <div className="flex items-center gap-3.5 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-elevated transition-all text-[#4A5568] hover:text-[#C9A84C]">
          <Settings size={17} />
          <span className="text-sm font-medium">Settings</span>
        </div>

        {/* Logout */}
        <button 
          onClick={() => useAuthStore.getState().logout()}
          className="flex items-center gap-3.5 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-red-500/10 transition-all text-[#4A5568] hover:text-red-400 text-left"
        >
          <LogOut size={17} />
          <span className="text-sm font-medium">Log out</span>
        </button>
      </div>
    </aside>
  );
}
