/* App.tsx — Router + AppShell wiring all 3 sections + Auth */
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DesktopSidebar } from './components/DesktopSidebar';
import { MobileNav } from './components/MobileNav';
import { CalendarPage } from './pages/CalendarPage';
import { PlannerPage } from './pages/PlannerPage';
import { AnswersPage } from './pages/AnswersPage';
import { DashboardPage } from './pages/DashboardPage';
import { AuthPage } from './pages/AuthPage';
import { useAuthStore } from './stores/useAuthStore';
import { useCalendarStore } from './stores/useCalendarStore';
import { usePlannerStore } from './stores/usePlannerStore';
import { useAnswerStore } from './stores/useAnswerStore';

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex h-screen w-full overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 20% 10%, rgba(108,99,255,0.07) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(201,168,76,0.05) 0%, transparent 55%), #0A0F1E',
      }}
    >
      <DesktopSidebar />

      <main
        className="flex-1 flex flex-col h-full overflow-hidden md:m-3 md:rounded-2xl"
        style={{
          background: 'rgba(17,24,39,0.55)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(42,52,71,0.45)',
          boxShadow: '0 8px 48px rgba(0,0,0,0.5)',
        }}
      >
        <div className="flex-1 overflow-hidden pb-[calc(env(safe-area-inset-bottom)+88px)] md:pb-0">
          {children}
        </div>
      </main>

      <MobileNav />
    </div>
  );
}

export default function App() {
  const { initAuth, isAuthenticated, isLoading } = useAuthStore();
  
  // Try to access fetch methods if they exist (we'll implement them next)
  const fetchEvents = (useCalendarStore.getState() as any).fetchEvents;
  const fetchTasks = (usePlannerStore.getState() as any).fetchTasks;
  const fetchAnswers = (useAnswerStore.getState() as any).fetchAnswers;

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      if (typeof fetchEvents === 'function') fetchEvents();
      if (typeof fetchTasks === 'function') fetchTasks();
      if (typeof fetchAnswers === 'function') fetchAnswers();
    }
  }, [isAuthenticated, fetchEvents, fetchTasks, fetchAnswers]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-[#C9A84C] border-t-transparent animate-spin" />
        <p className="text-[#C9A84C] font-mono text-sm tracking-widest uppercase animate-pulse">Loading Command Center</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <AuthPage /> : <Navigate to="/dashboard" />} />
        
        {isAuthenticated ? (
          <>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<AppShell><DashboardPage /></AppShell>} />
            <Route path="/calendar"  element={<AppShell><CalendarPage /></AppShell>} />
            <Route path="/planner"   element={<AppShell><PlannerPage /></AppShell>} />
            <Route path="/answers"   element={<AppShell><AnswersPage /></AppShell>} />
            <Route path="*"          element={<Navigate to="/dashboard" replace />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}
