/* AnswersPage.tsx — Answer Writing Tracker */
import { useState } from 'react';
import { Plus, Flame, X, BarChart2, BookOpen, Calendar, Clock, Star } from 'lucide-react';
import { useAnswerStore } from '../stores/useAnswerStore';
import { AnswerEntry, MISTAKE_TAGS, MistakeTag, QuestionSource, GSPaper } from '../types/answers';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

type SubView = 'log' | 'analytics' | 'history' | 'bank';

const PAPERS: GSPaper[] = ['GS I', 'GS II', 'GS III', 'GS IV', 'Essay', 'Optional'];
const SOURCES: QuestionSource[] = ['PYQ', 'Mock Test', 'Self-generated', 'Coaching material'];
const PAPER_COLORS: Record<GSPaper, string> = {
  'GS I': '#7C3AED', 'GS II': '#0369A1', 'GS III': '#047857',
  'GS IV': '#9D174D', 'Essay': '#D97706', 'Optional': '#3730A3',
};
const toDate = (s: string) => new Date(s + 'T00:00:00');
const todayStr = () => new Date().toISOString().split('T')[0];

// ── Writing streak calc ────────────────────────────────────────────────────────
function calcStreak(entries: AnswerEntry[]) {
  let streak = 0;
  const d = new Date();
  while (true) {
    const ds = d.toISOString().split('T')[0];
    if (entries.some((e) => e.dateAttempted === ds)) { streak++; d.setDate(d.getDate() - 1); }
    else break;
  }
  return streak;
}

// ── Log Answer Modal ────────────────────────────────────────────────────────────
function LogAnswerModal({ onClose }: { onClose: () => void }) {
  const { addEntry } = useAnswerStore();
  const [form, setForm] = useState({
    question: '', source: 'PYQ' as QuestionSource, paper: 'GS II' as GSPaper,
    topic: '', dateAttempted: todayStr(), wordCount: 250, timeTaken: 12,
    selfScore: 7, mistakeTags: [] as MistakeTag[], notes: '',
  });
  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) => setForm(f => ({ ...f, [k]: v }));
  const toggleMistake = (tag: MistakeTag) => set('mistakeTags', form.mistakeTags.includes(tag) ? form.mistakeTags.filter(t => t !== tag) : [...form.mistakeTags, tag]);

  const save = () => {
    if (!form.question.trim()) return;
    addEntry({ ...form });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: 'rgba(10,15,30,0.85)', backdropFilter: 'blur(12px)' }} onClick={onClose}>
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border flex flex-col gap-4 p-6" style={{ background: 'rgba(17,24,39,0.97)', borderColor: 'rgba(42,52,71,0.7)', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-text-hi text-lg">Log Answer</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-text-low hover:text-text-hi hover:bg-elevated"><X size={16} /></button>
        </div>

        {/* Source + Paper */}
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-[10px] text-text-low uppercase tracking-widest block mb-1">Source</label>
            <select value={form.source} onChange={e => set('source', e.target.value as QuestionSource)} className="input-field text-sm">
              {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div><label className="text-[10px] text-text-low uppercase tracking-widest block mb-1">GS Paper</label>
            <select value={form.paper} onChange={e => set('paper', e.target.value as GSPaper)} className="input-field text-sm">
              {PAPERS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* Question */}
        <div><label className="text-[10px] text-text-low uppercase tracking-widest block mb-1">Question</label>
          <textarea value={form.question} onChange={e => set('question', e.target.value)} rows={3} placeholder="Paste or type the question…" className="input-field resize-none text-sm" autoFocus />
        </div>

        {/* Date + Word + Time */}
        <div className="grid grid-cols-3 gap-3">
          <div><label className="text-[10px] text-text-low uppercase tracking-widest block mb-1">Date</label>
            <input type="date" value={form.dateAttempted} onChange={e => set('dateAttempted', e.target.value)} className="input-field text-sm" />
          </div>
          <div><label className="text-[10px] text-text-low uppercase tracking-widest block mb-1">Words</label>
            <input type="number" value={form.wordCount} onChange={e => set('wordCount', +e.target.value)} className="input-field text-sm" />
          </div>
          <div><label className="text-[10px] text-text-low uppercase tracking-widest block mb-1">Mins</label>
            <input type="number" value={form.timeTaken} onChange={e => set('timeTaken', +e.target.value)} className="input-field text-sm" />
          </div>
        </div>

        {/* Self Score */}
        <div><label className="text-[10px] text-text-low uppercase tracking-widest block mb-2">Self Score: <span className="text-gold font-bold">{form.selfScore}/10</span></label>
          <input type="range" min={1} max={10} value={form.selfScore} onChange={e => set('selfScore', +e.target.value)} className="w-full accent-gold" />
        </div>

        {/* Mistake tags */}
        <div><label className="text-[10px] text-text-low uppercase tracking-widest block mb-2">Mistakes</label>
          <div className="flex flex-wrap gap-2">
            {MISTAKE_TAGS.map(tag => (
              <button key={tag} type="button" onClick={() => toggleMistake(tag)}
                className="px-2.5 py-1 rounded-full text-xs border transition-all"
                style={form.mistakeTags.includes(tag)
                  ? { background: 'rgba(239,68,68,0.2)', borderColor: 'rgba(239,68,68,0.5)', color: '#EF4444' }
                  : { borderColor: 'rgba(42,52,71,0.5)', color: '#4A5568' }}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div><label className="text-[10px] text-text-low uppercase tracking-widest block mb-1">Notes</label>
          <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} placeholder="What to improve next time…" className="input-field resize-none text-sm" />
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-text-mid hover:bg-elevated text-sm font-medium">Cancel</button>
          <button onClick={save} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ background: 'linear-gradient(135deg,#C9A84C,#e8c870)', color: '#0A0F1E', boxShadow: '0 4px 16px rgba(201,168,76,0.3)' }}>Save Entry</button>
        </div>
      </div>
    </div>
  );
}

// ── Answer Card ─────────────────────────────────────────────────────────────────
function AnswerCard({ entry }: { entry: AnswerEntry }) {
  const color = PAPER_COLORS[entry.paper];
  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border" style={{ background: 'rgba(17,24,39,0.7)', borderColor: 'rgba(42,52,71,0.5)', borderLeft: `3px solid ${color}` }}>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-text-hi font-medium line-clamp-2 leading-snug">{entry.question}</p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold border" style={{ background: `${color}20`, color, borderColor: `${color}40` }}>{entry.paper}</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] border" style={{ borderColor: 'rgba(42,52,71,0.5)', color: '#4A5568' }}>{entry.source}</span>
          </div>
        </div>
        <div className="flex flex-col items-center shrink-0">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: `${color}20`, color, border: `2px solid ${color}40` }}>{entry.selfScore}</div>
          <span className="text-[9px] text-text-low mt-0.5">/10</span>
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs text-text-low">
        <span className="flex items-center gap-1"><BookOpen size={11} />{entry.wordCount}w</span>
        <span className="flex items-center gap-1"><Clock size={11} />{entry.timeTaken}m</span>
        <span className="flex items-center gap-1"><Calendar size={11} />{entry.dateAttempted}</span>
      </div>
      {entry.mistakeTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {entry.mistakeTags.map(t => <span key={t} className="px-2 py-0.5 rounded-full text-[10px] border" style={{ background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)', color: '#EF4444' }}>{t}</span>)}
        </div>
      )}
    </div>
  );
}

// ── Heatmap (History view) ──────────────────────────────────────────────────────
function Heatmap({ entries }: { entries: AnswerEntry[] }) {
  const days = Array.from({ length: 84 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (83 - i));
    const ds = d.toISOString().split('T')[0];
    const count = entries.filter(e => e.dateAttempted === ds).length;
    return { date: ds, count, label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) };
  });
  const getColor = (n: number) => n === 0 ? 'rgba(42,52,71,0.4)' : n === 1 ? 'rgba(201,168,76,0.3)' : n === 2 ? 'rgba(201,168,76,0.6)' : '#C9A84C';

  return (
    <div className="p-4 rounded-xl border" style={{ background: 'rgba(17,24,39,0.7)', borderColor: 'rgba(42,52,71,0.5)' }}>
      <p className="text-sm font-semibold text-text-hi mb-4">Writing Activity — Last 12 Weeks</p>
      <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}>
        {Array.from({ length: 12 }, (_, week) => (
          <div key={week} className="flex flex-col gap-1">
            {days.slice(week * 7, week * 7 + 7).map((d, i) => (
              <div key={i} title={`${d.label}: ${d.count} answer${d.count !== 1 ? 's' : ''}`}
                className="w-full aspect-square rounded-sm transition-all hover:scale-125 cursor-pointer"
                style={{ background: getColor(d.count) }} />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3 justify-end">
        <span className="text-[10px] text-text-low">Less</span>
        {[0, 1, 2, 3].map(n => <div key={n} className="w-3 h-3 rounded-sm" style={{ background: getColor(n) }} />)}
        <span className="text-[10px] text-text-low">More</span>
      </div>
    </div>
  );
}

// ── Analytics View ──────────────────────────────────────────────────────────────
function AnalyticsView({ entries }: { entries: AnswerEntry[] }) {
  const last8Weeks = Array.from({ length: 8 }, (_, i) => {
    const end = new Date(); end.setDate(end.getDate() - i * 7);
    const start = new Date(end); start.setDate(end.getDate() - 6);
    const label = `W${8 - i}`;
    const count = entries.filter(e => { const d = toDate(e.dateAttempted); return d >= start && d <= end; }).length;
    return { label, count };
  }).reverse();

  const last30 = entries.slice(-30);
  const scoreData = last30.map((e, i) => ({ name: i + 1, score: e.selfScore }));
  const wordData = last30.map((e, i) => ({ name: i + 1, words: e.wordCount }));

  const paperDist = PAPERS.map(p => ({ name: p, value: entries.filter(e => e.paper === p).length })).filter(d => d.value > 0);
  const mistakeFreq = MISTAKE_TAGS.map(t => ({ tag: t, count: entries.filter(e => e.mistakeTags.includes(t)).length })).sort((a, b) => b.count - a.count).slice(0, 5);

  const tip = { axis: { tick: { fill: '#4A5568', fontSize: 11 } }, tooltip: { contentStyle: { background: '#111827', border: '1px solid rgba(42,52,71,0.8)', borderRadius: 8, color: '#F1F5F9', fontSize: 12 }, cursor: { fill: 'rgba(108,99,255,0.1)' } } };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Weekly volume */}
        <div className="p-4 rounded-xl border" style={{ background: 'rgba(17,24,39,0.7)', borderColor: 'rgba(42,52,71,0.5)' }}>
          <p className="text-sm font-semibold text-text-hi mb-3">Answers Per Week</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={last8Weeks}><XAxis dataKey="label" {...tip.axis} /><YAxis {...tip.axis} /><Tooltip {...tip.tooltip} /><Bar dataKey="count" fill="#6C63FF" radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </div>
        {/* Score trend */}
        <div className="p-4 rounded-xl border" style={{ background: 'rgba(17,24,39,0.7)', borderColor: 'rgba(42,52,71,0.5)' }}>
          <p className="text-sm font-semibold text-text-hi mb-3">Self-Score Trend</p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={scoreData}><XAxis dataKey="name" hide /><YAxis domain={[0, 10]} {...tip.axis} /><Tooltip {...tip.tooltip} /><Line type="monotone" dataKey="score" stroke="#C9A84C" strokeWidth={2} dot={false} /></LineChart>
          </ResponsiveContainer>
        </div>
        {/* Word count */}
        <div className="p-4 rounded-xl border" style={{ background: 'rgba(17,24,39,0.7)', borderColor: 'rgba(42,52,71,0.5)' }}>
          <p className="text-sm font-semibold text-text-hi mb-3">Word Count Trend</p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={wordData}><XAxis dataKey="name" hide /><YAxis {...tip.axis} /><Tooltip {...tip.tooltip} /><Line type="monotone" dataKey="words" stroke="#10B981" strokeWidth={2} dot={false} /></LineChart>
          </ResponsiveContainer>
        </div>
        {/* Paper distribution */}
        <div className="p-4 rounded-xl border" style={{ background: 'rgba(17,24,39,0.7)', borderColor: 'rgba(42,52,71,0.5)' }}>
          <p className="text-sm font-semibold text-text-hi mb-3">Paper Distribution</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={120} height={120}>
              <PieChart><Pie data={paperDist} cx="50%" cy="50%" innerRadius={30} outerRadius={55} dataKey="value">
                {paperDist.map((d) => <Cell key={d.name} fill={PAPER_COLORS[d.name as GSPaper]} />)}
              </Pie></PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1.5 flex-1">
              {paperDist.map(d => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: PAPER_COLORS[d.name as GSPaper] }} />
                  <span className="text-text-mid flex-1">{d.name}</span>
                  <span className="text-text-hi font-bold">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Top mistakes */}
      <div className="p-4 rounded-xl border" style={{ background: 'rgba(17,24,39,0.7)', borderColor: 'rgba(42,52,71,0.5)' }}>
        <p className="text-sm font-semibold text-text-hi mb-3">Top Mistakes</p>
        <div className="flex flex-col gap-2">
          {mistakeFreq.map(({ tag, count }) => (
            <div key={tag} className="flex items-center gap-3">
              <span className="text-xs text-text-mid w-28 shrink-0">{tag}</span>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(42,52,71,0.5)' }}>
                <div className="h-full rounded-full" style={{ width: `${(count / entries.length) * 100}%`, background: '#EF4444' }} />
              </div>
              <span className="text-xs text-text-low w-4 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export function AnswersPage() {
  const { entries, weeklyTarget } = useAnswerStore();
  const [view, setView] = useState<SubView>('log');
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

  const streak = calcStreak(entries);
  const todayEntries = entries.filter(e => e.dateAttempted === todayStr());
  const last7 = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return { ds: d.toISOString().split('T')[0], wrote: entries.some(e => e.dateAttempted === d.toISOString().split('T')[0]) }; });
  const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
  const weekCount = entries.filter(e => toDate(e.dateAttempted) >= weekStart).length;

  const TABS: { key: SubView; label: string }[] = [
    { key: 'log', label: 'Daily Log' }, { key: 'analytics', label: 'Analytics' },
    { key: 'history', label: 'History' }, { key: 'bank', label: 'Question Bank' },
  ];

  const bankEntries = entries.filter(e => !search || e.question.toLowerCase().includes(search.toLowerCase()) || e.paper.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: 'rgba(17,24,39,0.4)' }}>
      {showModal && <LogAnswerModal onClose={() => setShowModal(false)} />}

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b shrink-0" style={{ borderColor: 'rgba(42,52,71,0.5)' }}>
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-bold text-text-hi">Answer Writing</h1>
            <p className="text-xs text-text-low mt-0.5">{entries.length} entries · {weekCount}/{weeklyTarget} this week</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border" style={{ background: streak > 0 ? 'rgba(217,119,6,0.1)' : 'rgba(28,35,51,0.5)', borderColor: streak > 0 ? 'rgba(217,119,6,0.3)' : 'rgba(42,52,71,0.4)' }}>
            <Flame size={14} style={{ color: streak > 0 ? '#D97706' : '#4A5568' }} />
            <span className="text-xs font-bold" style={{ color: streak > 0 ? '#C9A84C' : '#4A5568' }}>{streak}d</span>
          </div>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: 'linear-gradient(135deg,#C9A84C,#e8c870)', color: '#0A0F1E', boxShadow: '0 4px 16px rgba(201,168,76,0.35)' }}>
          <Plus size={16} strokeWidth={2.5} />
          <span className="hidden sm:inline">Log Answer</span>
        </button>
      </div>

      {/* 7-day streak row */}
      <div className="flex items-center gap-2 px-4 md:px-6 py-3 border-b overflow-x-auto shrink-0" style={{ borderColor: 'rgba(42,52,71,0.3)' }}>
        {last7.map(({ ds, wrote }, i) => {
          const label = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][(new Date(ds + 'T00:00:00').getDay() + 6) % 7];
          return (
            <div key={ds} className="flex flex-col items-center gap-1 shrink-0">
              <span className="text-[9px] text-text-low">{label}</span>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={wrote ? { background: 'linear-gradient(135deg,#C9A84C,#e8c870)', color: '#0A0F1E' } : { background: 'rgba(42,52,71,0.5)', color: '#4A5568' }}>
                {wrote ? '✓' : new Date(ds + 'T00:00:00').getDate()}
              </div>
            </div>
          );
        })}
        <div className="ml-auto flex items-center gap-2 text-xs text-text-low shrink-0">
          <BarChart2 size={12} />
          <span>{weekCount}/{weeklyTarget} this week</span>
          <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(42,52,71,0.5)' }}>
            <div className="h-full rounded-full" style={{ width: `${Math.min((weekCount / weeklyTarget) * 100, 100)}%`, background: '#C9A84C' }} />
          </div>
        </div>
      </div>

      {/* Sub-nav tabs */}
      <div className="flex gap-1 px-4 md:px-6 py-3 overflow-x-auto shrink-0 border-b" style={{ borderColor: 'rgba(42,52,71,0.3)' }}>
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setView(key)} className="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0"
            style={view === key ? { background: 'rgba(219,39,119,0.2)', color: '#DB2777', border: '1px solid rgba(219,39,119,0.4)' } : { color: '#4A5568', border: '1px solid transparent' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {view === 'log' && (
          <div className="flex flex-col gap-3 p-4 md:p-6">
            {todayEntries.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-text-low">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl" style={{ background: 'rgba(219,39,119,0.1)', border: '1px solid rgba(219,39,119,0.2)' }}>✍️</div>
                <p className="text-sm text-center">No answers logged today.<br /><span style={{ color: '#DB2777' }}>Mains is won on writing.</span></p>
                <button onClick={() => setShowModal(true)} className="px-6 py-2.5 rounded-xl text-sm font-semibold" style={{ background: 'linear-gradient(135deg,#DB2777,#f472b6)', color: '#fff', boxShadow: '0 4px 16px rgba(219,39,119,0.35)' }}>Log Your First Answer Today</button>
              </div>
            ) : (
              todayEntries.map(e => <AnswerCard key={e.id} entry={e} />)
            )}
          </div>
        )}
        {view === 'analytics' && <AnalyticsView entries={entries} />}
        {view === 'history' && (
          <div className="flex flex-col gap-4 p-4 md:p-6">
            <Heatmap entries={entries} />
          </div>
        )}
        {view === 'bank' && (
          <div className="flex flex-col gap-3 p-4 md:p-6">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search questions…" className="input-field text-sm" />
            {bankEntries.map(e => <AnswerCard key={e.id} entry={e} />)}
          </div>
        )}
      </div>
    </div>
  );
}
