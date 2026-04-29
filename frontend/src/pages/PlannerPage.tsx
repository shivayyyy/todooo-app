/* PlannerPage.tsx — Full Todo Planner with Today/Week/All/Subject views */
import { useState, useRef } from 'react';
import { Plus, CheckCircle2, Circle, Trash2, ChevronRight, Calendar, AlertTriangle, Tag, BookOpen, X, ChevronDown } from 'lucide-react';
import { usePlannerStore } from '../stores/usePlannerStore';
import { useCalendarStore } from '../stores/useCalendarStore';
import { Task, Priority, TaskStatus, GSubject, PRIORITY_META, STATUS_META, SUBJECT_COLOR, SUBJECTS } from '../types/planner';

type PlannerView = 'today' | 'week' | 'all' | 'subject';

const today = () => new Date().toISOString().split('T')[0];
const inCurrentWeek = (dateStr?: string) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  const mon = new Date(now); mon.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
  return d >= mon && d <= sun;
};
const isOverdue = (t: Task) => t.status !== 'done' && t.dueDate && t.dueDate < today();

// ── Quick-Add Bar ──────────────────────────────────────────────────────────────
function QuickAdd({ onAdd }: { onAdd: (title: string) => void }) {
  const [val, setVal] = useState('');
  return (
    <div className="flex items-center gap-2 p-3 rounded-xl border" style={{ background: 'rgba(28,35,51,0.6)', borderColor: 'rgba(42,52,71,0.6)' }}>
      <Plus size={16} style={{ color: '#C9A84C' }} />
      <input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && val.trim()) { onAdd(val.trim()); setVal(''); } }}
        placeholder="Quick add task… press Enter"
        className="flex-1 bg-transparent text-sm text-text-hi placeholder-text-low outline-none"
      />
    </div>
  );
}

// ── Task Card ──────────────────────────────────────────────────────────────────
function TaskCard({ task, onSelect, selected }: { task: Task; onSelect: (t: Task) => void; selected: boolean }) {
  const { toggleDone, deleteTask } = usePlannerStore();
  const pm = PRIORITY_META[task.priority];
  const overdue = isOverdue(task);

  return (
    <div
      onClick={() => onSelect(task)}
      className="flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-200 group relative"
      style={{
        background: selected ? 'rgba(201,168,76,0.06)' : 'rgba(17,24,39,0.7)',
        borderColor: selected ? 'rgba(201,168,76,0.3)' : overdue ? 'rgba(239,68,68,0.3)' : 'rgba(42,52,71,0.5)',
        borderLeft: `3px solid ${pm.color}`,
      }}
    >
      {/* Checkbox */}
      <button
        onClick={(e) => { e.stopPropagation(); toggleDone(task.id); }}
        className="mt-0.5 shrink-0 transition-colors"
        style={{ color: task.status === 'done' ? '#10B981' : '#4A5568' }}
      >
        {task.status === 'done' ? <CheckCircle2 size={18} /> : <Circle size={18} />}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium leading-snug ${task.status === 'done' ? 'line-through text-text-low' : 'text-text-hi'}`}>
          {task.title}
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-1.5">
          {/* Priority badge */}
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold border"
            style={{ background: pm.bg, color: pm.color, borderColor: `${pm.color}40` }}>
            {pm.label}
          </span>
          {/* Subject tag */}
          {task.subject && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium border"
              style={{ color: SUBJECT_COLOR[task.subject], borderColor: `${SUBJECT_COLOR[task.subject]}40`, background: `${SUBJECT_COLOR[task.subject]}15` }}>
              {task.subject}
            </span>
          )}
          {/* Due date */}
          {task.dueDate && (
            <span className="flex items-center gap-1 text-[10px]"
              style={{ color: overdue ? '#EF4444' : '#4A5568' }}>
              {overdue && <AlertTriangle size={9} />}
              {overdue ? 'Overdue' : task.dueDate === today() ? 'Today' : task.dueDate}
            </span>
          )}
          {/* Subtask count */}
          {task.subtasks.length > 0 && (
            <span className="text-[10px] text-text-low">
              {task.subtasks.filter(s => s.done).length}/{task.subtasks.length} subtasks
            </span>
          )}
        </div>
      </div>

      {/* Delete btn (hover) */}
      <button
        onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg transition-all text-text-low hover:text-red hover:bg-red/10 shrink-0"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}

// ── Task Detail Panel ──────────────────────────────────────────────────────────
function TaskDetail({ task, onClose }: { task: Task; onClose: () => void }) {
  const { updateTask, toggleSubtask, deleteTask } = usePlannerStore();
  const [title, setTitle] = useState(task.title);
  const [notes, setNotes] = useState(task.notes ?? '');
  const pm = PRIORITY_META[task.priority];

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{ background: 'rgba(17,24,39,0.95)', borderLeft: '1px solid rgba(42,52,71,0.5)' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 p-5 border-b" style={{ borderColor: 'rgba(42,52,71,0.4)' }}>
        <div className="flex-1">
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => updateTask(task.id, { title })}
            className="w-full bg-transparent text-base font-semibold text-text-hi resize-none outline-none leading-snug"
            rows={2}
          />
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg text-text-low hover:text-text-hi hover:bg-elevated transition-all shrink-0">
          <X size={15} />
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-5 p-5">
        {/* Priority & Status selects */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-text-low uppercase tracking-widest">Priority</label>
            <select
              value={task.priority}
              onChange={(e) => updateTask(task.id, { priority: e.target.value as Priority })}
              className="input-field text-xs"
            >
              {Object.entries(PRIORITY_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-text-low uppercase tracking-widest">Status</label>
            <select
              value={task.status}
              onChange={(e) => updateTask(task.id, { status: e.target.value as TaskStatus })}
              className="input-field text-xs"
            >
              {Object.entries(STATUS_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
        </div>

        {/* Subject & Due date */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-text-low uppercase tracking-widest">Subject</label>
            <select
              value={task.subject ?? ''}
              onChange={(e) => updateTask(task.id, { subject: e.target.value as GSubject || undefined })}
              className="input-field text-xs"
            >
              <option value="">— None —</option>
              {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-text-low uppercase tracking-widest">Due Date</label>
            <input type="date" value={task.dueDate ?? ''} onChange={(e) => updateTask(task.id, { dueDate: e.target.value })} className="input-field text-xs" />
          </div>
        </div>

        {/* Subtasks */}
        {task.subtasks.length > 0 && (
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-text-low uppercase tracking-widest">Sub-tasks</label>
            {task.subtasks.map((st) => (
              <label key={st.id} className="flex items-center gap-2.5 cursor-pointer group">
                <button onClick={() => toggleSubtask(task.id, st.id)} style={{ color: st.done ? '#10B981' : '#4A5568' }}>
                  {st.done ? <CheckCircle2 size={15} /> : <Circle size={15} />}
                </button>
                <span className={`text-sm ${st.done ? 'line-through text-text-low' : 'text-text-mid'}`}>{st.text}</span>
              </label>
            ))}
          </div>
        )}

        {/* Notes */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-text-low uppercase tracking-widest">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={() => updateTask(task.id, { notes })}
            rows={4}
            placeholder="Add notes..."
            className="input-field resize-none text-sm"
          />
        </div>

        {/* Delete */}
        <button
          onClick={() => { deleteTask(task.id); onClose(); }}
          className="mt-auto flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red/20 text-red/80 hover:bg-red/10 hover:text-red transition-all text-sm font-medium"
        >
          <Trash2 size={14} /> Delete Task
        </button>
      </div>
    </div>
  );
}

// ── Add Task Modal ──────────────────────────────────────────────────────────────
function AddTaskModal({ onClose }: { onClose: () => void }) {
  const { addTask } = usePlannerStore();
  const [form, setForm] = useState({ title: '', subject: '' as GSubject | '', priority: 'medium' as Priority, dueDate: today(), notes: '' });
  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.title.trim()) return;
    addTask({ title: form.title, subject: form.subject as GSubject || undefined, priority: form.priority, dueDate: form.dueDate, notes: form.notes, status: 'todo', subtasks: [] });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: 'rgba(10,15,30,0.8)', backdropFilter: 'blur(12px)' }} onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl border p-6 flex flex-col gap-4" style={{ background: 'rgba(17,24,39,0.95)', borderColor: 'rgba(42,52,71,0.7)', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-text-hi">New Task</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-text-low hover:text-text-hi hover:bg-elevated"><X size={16} /></button>
        </div>
        <input value={form.title} onChange={(e) => set('title', e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSave()} placeholder="Task title…" className="input-field text-base font-medium" autoFocus />
        <div className="grid grid-cols-2 gap-3">
          <select value={form.priority} onChange={(e) => set('priority', e.target.value as Priority)} className="input-field text-sm">
            {Object.entries(PRIORITY_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <input type="date" value={form.dueDate} onChange={(e) => set('dueDate', e.target.value)} className="input-field text-sm" />
        </div>
        <select value={form.subject} onChange={(e) => set('subject', e.target.value as GSubject)} className="input-field text-sm">
          <option value="">— No subject —</option>
          {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={2} placeholder="Notes (optional)…" className="input-field text-sm resize-none" />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-text-mid hover:bg-elevated text-sm font-medium transition-all">Cancel</button>
          <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all" style={{ background: 'linear-gradient(135deg,#C9A84C,#e8c870)', color: '#0A0F1E', boxShadow: '0 4px 16px rgba(201,168,76,0.35)' }}>Create Task</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export function PlannerPage() {
  const { tasks, addTask } = usePlannerStore();
  const [view, setView] = useState<PlannerView>('today');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [collapsedSubjects, setCollapsedSubjects] = useState<Set<string>>(new Set());

  const todayStr = today();
  const overdueTasks = tasks.filter(isOverdue);
  const todayTasks = tasks.filter((t) => t.dueDate === todayStr && t.status !== 'done');
  const doneTodayTasks = tasks.filter((t) => t.dueDate === todayStr && t.status === 'done');
  const weekTasks = tasks.filter((t) => inCurrentWeek(t.dueDate));

  const sortByPriority = (arr: Task[]) => {
    const order: Priority[] = ['critical', 'high', 'medium', 'low'];
    return [...arr].sort((a, b) => order.indexOf(a.priority) - order.indexOf(b.priority));
  };

  // Get tasks for current view
  const getViewTasks = () => {
    if (view === 'today') return sortByPriority([...overdueTasks, ...todayTasks]);
    if (view === 'week') return sortByPriority(weekTasks);
    return sortByPriority(tasks.filter((t) => t.status !== 'done'));
  };

  const viewTasks = getViewTasks();

  // Subject grouping for "by subject" view
  const subjectGroups = SUBJECTS.map((s) => ({
    subject: s,
    tasks: tasks.filter((t) => t.subject === s),
    done: tasks.filter((t) => t.subject === s && t.status === 'done').length,
  })).filter((g) => g.tasks.length > 0);

  const VIEW_TABS: { key: PlannerView; label: string }[] = [
    { key: 'today', label: 'Today' },
    { key: 'week',  label: 'This Week' },
    { key: 'all',   label: 'All Tasks' },
    { key: 'subject', label: 'By Subject' },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: 'rgba(17,24,39,0.4)' }}>
      {showAddModal && <AddTaskModal onClose={() => setShowAddModal(false)} />}

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b shrink-0" style={{ borderColor: 'rgba(42,52,71,0.5)', backdropFilter: 'blur(16px)' }}>
        <div>
          <h1 className="text-xl font-bold text-text-hi">Todo Planner</h1>
          <p className="text-xs text-text-low mt-0.5">{tasks.filter((t) => t.status !== 'done').length} active · {tasks.filter((t) => t.status === 'done').length} done</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
          style={{ background: 'linear-gradient(135deg,#C9A84C,#e8c870)', color: '#0A0F1E', boxShadow: '0 4px 16px rgba(201,168,76,0.35)' }}
        >
          <Plus size={16} strokeWidth={2.5} />
          <span className="hidden sm:inline">Add Task</span>
        </button>
      </div>

      {/* View tabs */}
      <div className="flex gap-1 px-4 md:px-6 py-3 overflow-x-auto shrink-0 border-b" style={{ borderColor: 'rgba(42,52,71,0.3)' }}>
        {VIEW_TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setView(key)}
            className="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0"
            style={view === key ? { background: 'rgba(108,99,255,0.2)', color: '#6C63FF', border: '1px solid rgba(108,99,255,0.4)' } : { color: '#4A5568', border: '1px solid transparent' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Task list */}
        <div className={`flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-3 ${selectedTask ? 'hidden md:flex' : 'flex'}`}>

          {view !== 'subject' ? (
            <>
              {/* Overdue banner */}
              {view === 'today' && overdueTasks.length > 0 && (
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border" style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.3)' }}>
                  <AlertTriangle size={15} style={{ color: '#EF4444' }} />
                  <span className="text-sm text-red font-medium">{overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}</span>
                </div>
              )}

              {/* Quick add */}
              <QuickAdd onAdd={(title) => addTask({ title, priority: 'medium', status: 'todo', subtasks: [], dueDate: todayStr })} />

              {/* Tasks */}
              {viewTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 gap-3 text-text-low py-16">
                  <CheckCircle2 size={48} className="opacity-20" />
                  <p className="text-sm">All clear! Add some tasks.</p>
                </div>
              ) : (
                viewTasks.map((t) => <TaskCard key={t.id} task={t} onSelect={setSelectedTask} selected={selectedTask?.id === t.id} />)
              )}

              {/* Done tasks (today view only) */}
              {view === 'today' && doneTodayTasks.length > 0 && (
                <div className="flex flex-col gap-2 mt-2 opacity-60">
                  <p className="text-xs text-text-low px-1">✓ Completed today</p>
                  {doneTodayTasks.map((t) => <TaskCard key={t.id} task={t} onSelect={setSelectedTask} selected={selectedTask?.id === t.id} />)}
                </div>
              )}
            </>
          ) : (
            /* By Subject view */
            subjectGroups.map(({ subject, tasks: sTasks, done }) => {
              const isCollapsed = collapsedSubjects.has(subject);
              const pct = sTasks.length > 0 ? Math.round((done / sTasks.length) * 100) : 0;
              return (
                <div key={subject} className="flex flex-col gap-2">
                  <button
                    onClick={() => setCollapsedSubjects((s) => { const ns = new Set(s); ns.has(subject) ? ns.delete(subject) : ns.add(subject); return ns; })}
                    className="flex items-center gap-3 p-3 rounded-xl border w-full text-left transition-all hover:bg-elevated"
                    style={{ borderColor: 'rgba(42,52,71,0.5)', background: 'rgba(17,24,39,0.6)' }}
                  >
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: SUBJECT_COLOR[subject] }} />
                    <span className="text-sm font-semibold text-text-hi flex-1">{subject}</span>
                    <span className="text-xs text-text-low">{done}/{sTasks.length}</span>
                    <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(42,52,71,0.5)' }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: SUBJECT_COLOR[subject] }} />
                    </div>
                    <ChevronDown size={14} className={`text-text-low transition-transform ${isCollapsed ? '' : 'rotate-180'}`} />
                  </button>
                  {!isCollapsed && sTasks.map((t) => <TaskCard key={t.id} task={t} onSelect={setSelectedTask} selected={selectedTask?.id === t.id} />)}
                </div>
              );
            })
          )}
        </div>

        {/* Task detail panel */}
        {selectedTask && (
          <div className="w-full md:w-80 lg:w-96 shrink-0 border-l md:border-l h-full" style={{ borderColor: 'rgba(42,52,71,0.5)' }}>
            <TaskDetail
              key={selectedTask.id}
              task={tasks.find((t) => t.id === selectedTask.id) ?? selectedTask}
              onClose={() => setSelectedTask(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
