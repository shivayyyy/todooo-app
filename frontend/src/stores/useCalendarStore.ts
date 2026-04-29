// stores/useCalendarStore.ts — Zustand store for all calendar state

import { create } from 'zustand';
import { CalendarEvent, CalendarView } from '../types/calendar';
import { apiFetch } from '../lib/api';

const TODAY = new Date();
const fmt = (d: Date) => d.toISOString().split('T')[0];

interface CalendarStore {
  events: CalendarEvent[];
  view: CalendarView;
  currentDate: string; // ISO date — anchor for current view
  selectedEventId: string | null;
  isEventModalOpen: boolean;
  editingEvent: Partial<CalendarEvent> | null;
  isLoading: boolean;

  fetchEvents: () => Promise<void>;
  setView: (v: CalendarView) => void;
  navigate: (direction: 'prev' | 'next' | 'today') => void;

  addEvent: (ev: Omit<CalendarEvent, 'id'>) => Promise<void>;
  updateEvent: (id: string, patch: Partial<CalendarEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  moveEvent: (id: string, newDate: string, newStart: string, newEnd: string) => Promise<void>;

  openCreateModal: (defaults?: Partial<CalendarEvent>) => void;
  openEditModal: (id: string) => void;
  closeModal: () => void;
  selectEvent: (id: string | null) => void;
}

function shiftDate(dateStr: string, view: CalendarView, dir: 1 | -1): string {
  const d = new Date(dateStr);
  if (view === 'month') d.setMonth(d.getMonth() + dir);
  else if (view === 'week') d.setDate(d.getDate() + 7 * dir);
  else d.setDate(d.getDate() + dir);
  return fmt(d);
}

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  events: [],
  view: 'week',
  currentDate: fmt(TODAY),
  selectedEventId: null,
  isEventModalOpen: false,
  editingEvent: null,
  isLoading: false,

  fetchEvents: async () => {
    set({ isLoading: true });
    try {
      const data = await apiFetch('/calendar');
      if (data) set({ events: data });
    } catch (err) {
      console.error(err);
    } finally {
      set({ isLoading: false });
    }
  },

  setView: (v) => set({ view: v }),

  navigate: (direction) => {
    if (direction === 'today') {
      set({ currentDate: fmt(new Date()) });
      return;
    }
    const { currentDate, view } = get();
    set({ currentDate: shiftDate(currentDate, view, direction === 'next' ? 1 : -1) });
  },

  addEvent: async (ev) => {
    try {
      const data = await apiFetch('/calendar', { method: 'POST', body: JSON.stringify(ev) });
      set((s) => ({
        events: [...s.events, data],
        isEventModalOpen: false,
        editingEvent: null,
      }));
    } catch (err) {
      console.error(err);
    }
  },

  updateEvent: async (id, patch) => {
    try {
      const data = await apiFetch(`/calendar/${id}`, { method: 'PUT', body: JSON.stringify(patch) });
      set((s) => ({
        events: s.events.map((e) => (e.id === id ? { ...e, ...data } : e)),
        isEventModalOpen: false,
        editingEvent: null,
      }));
    } catch (err) {
      console.error(err);
    }
  },

  deleteEvent: async (id) => {
    try {
      await apiFetch(`/calendar/${id}`, { method: 'DELETE' });
      set((s) => ({
        events: s.events.filter((e) => e.id !== id),
        selectedEventId: s.selectedEventId === id ? null : s.selectedEventId,
      }));
    } catch (err) {
      console.error(err);
    }
  },

  moveEvent: async (id, newDate, newStart, newEnd) => {
    try {
      const patch = { startDate: newDate, startTime: newStart, endTime: newEnd };
      const data = await apiFetch(`/calendar/${id}`, { method: 'PUT', body: JSON.stringify(patch) });
      set((s) => ({
        events: s.events.map((e) => (e.id === id ? { ...e, ...data } : e)),
      }));
    } catch (err) {
      console.error(err);
    }
  },

  openCreateModal: (defaults) =>
    set({ isEventModalOpen: true, editingEvent: defaults ?? {}, selectedEventId: null }),

  openEditModal: (id) => {
    const ev = get().events.find((e) => e.id === id);
    if (ev) set({ isEventModalOpen: true, editingEvent: { ...ev } });
  },

  closeModal: () => set({ isEventModalOpen: false, editingEvent: null }),
  selectEvent: (id) => set({ selectedEventId: id }),
}));
