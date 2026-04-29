// stores/useAnswerStore.ts
import { create } from 'zustand';
import { AnswerEntry, MistakeTag, QuestionSource, GSPaper } from '../types/answers';
import { apiFetch } from '../lib/api';

interface AnswerStore {
  entries: AnswerEntry[];
  weeklyTarget: number;
  isLoading: boolean;

  fetchAnswers: () => Promise<void>;
  addEntry: (e: Omit<AnswerEntry, 'id' | 'createdAt'>) => Promise<void>;
  updateEntry: (id: string, patch: Partial<AnswerEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  setWeeklyTarget: (n: number) => void;
}

export const useAnswerStore = create<AnswerStore>((set, get) => ({
  entries: [],
  weeklyTarget: 10,
  isLoading: false,

  fetchAnswers: async () => {
    set({ isLoading: true });
    try {
      const data = await apiFetch('/answers');
      if (data) set({ entries: data });
    } catch (err) {
      console.error(err);
    } finally {
      set({ isLoading: false });
    }
  },

  addEntry: async (e) => {
    try {
      const data = await apiFetch('/answers', { method: 'POST', body: JSON.stringify(e) });
      set((s) => ({ entries: [...s.entries, data] }));
    } catch (err) {
      console.error(err);
    }
  },

  updateEntry: async (id, patch) => {
    try {
      const data = await apiFetch(`/answers/${id}`, { method: 'PUT', body: JSON.stringify(patch) });
      set((s) => ({ entries: s.entries.map((e) => (e.id === id ? { ...e, ...data } : e)) }));
    } catch (err) {
      console.error(err);
    }
  },

  deleteEntry: async (id) => {
    try {
      await apiFetch(`/answers/${id}`, { method: 'DELETE' });
      set((s) => ({ entries: s.entries.filter((e) => e.id !== id) }));
    } catch (err) {
      console.error(err);
    }
  },

  setWeeklyTarget: (n) => {
    // Save locally for now as it's a preference, could be moved to User profile later
    localStorage.setItem('civictask_weekly_target', n.toString());
    set({ weeklyTarget: n });
  },
}));
