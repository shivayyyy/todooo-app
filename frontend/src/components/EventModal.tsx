/* ─── EventModal.tsx — Mobile-first, scroll-safe ──────────────────────────── */
import { useEffect, useRef, useState } from 'react';
import { X, Calendar, Clock, BookOpen, Tag, AlignLeft } from 'lucide-react';
import { useCalendarStore } from '../stores/useCalendarStore';
import { CalendarEvent, EventType, Subject, EVENT_TYPE_META, SUBJECT_OPTIONS } from '../types/calendar';
import { fmtDate } from '../lib/calendarUtils';

const DEFAULT_FORM: Omit<CalendarEvent, 'id'> = {
  title: '', type: 'study', subject: 'GS I',
  startDate: fmtDate(new Date()), startTime: '08:00', endTime: '09:00',
  notes: '', color: '#6C63FF',
};

export function EventModal() {
  const { isEventModalOpen, editingEvent, closeModal, addEvent, updateEvent } = useCalendarStore();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<Omit<CalendarEvent, 'id'>>(DEFAULT_FORM);
  const isEdit = !!(editingEvent as CalendarEvent)?.id;

  useEffect(() => {
    if (isEventModalOpen && editingEvent) setForm({ ...DEFAULT_FORM, ...editingEvent });
    else if (!isEventModalOpen) setForm(DEFAULT_FORM);
  }, [isEventModalOpen, editingEvent]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [closeModal]);

  if (!isEventModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (isEdit) updateEvent((editingEvent as CalendarEvent).id, form);
    else addEvent(form);
  };

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const typeColor = EVENT_TYPE_META[form.type].color;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(10,15,30,0.8)', backdropFilter: 'blur(12px)' }}
      onClick={(e) => { if (e.target === overlayRef.current) closeModal(); }}
    >
      {/* Card — centered on all screens */}
      <div
        className="w-full sm:max-w-lg rounded-2xl border shadow-2xl flex flex-col max-h-[85vh]"
        style={{
          background: 'rgba(17,24,39,0.97)',
          backdropFilter: 'blur(24px)',
          borderColor: 'rgba(42,52,71,0.8)',
          boxShadow: `0 0 0 1px rgba(42,52,71,0.5), 0 -8px 48px rgba(0,0,0,0.6), 0 0 60px ${typeColor}15`,
        }}
      >
        {/* Pull bar (mobile) - removed since it's centered now */}

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b shrink-0" style={{ borderColor: 'rgba(42,52,71,0.5)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-7 rounded-full" style={{ background: typeColor }} />
            <h2 className="text-base font-semibold text-text-hi">{isEdit ? 'Edit Event' : 'New Event'}</h2>
          </div>
          <button onClick={closeModal} className="p-2 rounded-xl text-text-mid hover:text-text-hi hover:bg-elevated transition-all">
            <X size={17} />
          </button>
        </div>

        {/* Scrollable form body */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">

            {/* Title */}
            <input type="text" placeholder="Event title…" value={form.title}
              onChange={(e) => set('title', e.target.value)} required autoFocus
              className="w-full bg-transparent border-0 border-b text-lg font-medium text-text-hi placeholder-text-low focus:outline-none pb-2 transition-colors"
              style={{ borderColor: `${typeColor}60` }} />

            {/* Event Type — wrapping chips */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-1.5 text-[10px] text-text-low uppercase tracking-widest">
                <Tag size={11} /> Type
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(Object.entries(EVENT_TYPE_META) as [EventType, typeof EVENT_TYPE_META[EventType]][]).map(([type, meta]) => (
                  <button key={type} type="button"
                    onClick={() => { set('type', type); set('color', meta.color); }}
                    className="px-2.5 py-1 rounded-full text-xs font-medium border transition-all"
                    style={{
                      borderColor: form.type === type ? meta.color : 'rgba(42,52,71,0.6)',
                      background: form.type === type ? meta.bg : 'transparent',
                      color: form.type === type ? meta.color : '#A0AEC0',
                    }}>
                    {meta.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date + Time — stack on very small screens */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <label className="flex items-center gap-1.5 text-[10px] text-text-low uppercase tracking-widest">
                  <Calendar size={10} /> Date
                </label>
                <input type="date" value={form.startDate} onChange={(e) => set('startDate', e.target.value)} className="input-field" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="flex items-center gap-1.5 text-[10px] text-text-low uppercase tracking-widest">
                  <Clock size={10} /> Start
                </label>
                <input type="time" value={form.startTime} onChange={(e) => set('startTime', e.target.value)} className="input-field" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="flex items-center gap-1.5 text-[10px] text-text-low uppercase tracking-widest">
                  <Clock size={10} /> End
                </label>
                <input type="time" value={form.endTime} onChange={(e) => set('endTime', e.target.value)} className="input-field" />
              </div>
            </div>

            {/* Subject */}
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-1.5 text-[10px] text-text-low uppercase tracking-widest">
                <BookOpen size={10} /> Subject
              </label>
              <select value={form.subject ?? ''} onChange={(e) => set('subject', e.target.value as Subject)} className="input-field">
                <option value="">— No subject —</option>
                {SUBJECT_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-1.5 text-[10px] text-text-low uppercase tracking-widest">
                <AlignLeft size={10} /> Notes
              </label>
              <textarea value={form.notes ?? ''} onChange={(e) => set('notes', e.target.value)}
                rows={3} placeholder="Add notes or context…" className="input-field resize-none" />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1 pb-1">
              <button type="button" onClick={closeModal}
                className="flex-1 py-3 rounded-xl border border-border text-text-mid hover:bg-elevated transition-all text-sm font-medium">
                Cancel
              </button>
              <button type="submit"
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
                style={{ background: `linear-gradient(135deg,${typeColor},${typeColor}cc)`, color: '#fff', boxShadow: `0 4px 16px ${typeColor}40` }}>
                {isEdit ? 'Save Changes' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
