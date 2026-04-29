// stores/usePlannerStore.ts
import { create } from 'zustand';
import { Task, Priority, TaskStatus, SubTask, GSubject } from '../types/planner';
import { apiFetch } from '../lib/api';

interface PlannerStore {
  tasks: Task[];
  isLoading: boolean;
  
  fetchTasks: () => Promise<void>;
  addTask: (t: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, patch: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleDone: (id: string) => Promise<void>;
  toggleSubtask: (taskId: string, subId: string) => Promise<void>;
}

export const usePlannerStore = create<PlannerStore>((set, get) => ({
  tasks: [],
  isLoading: false,

  fetchTasks: async () => {
    set({ isLoading: true });
    try {
      const data = await apiFetch('/tasks');
      if (data) set({ tasks: data });
    } catch (err) {
      console.error(err);
    } finally {
      set({ isLoading: false });
    }
  },

  addTask: async (t) => {
    try {
      const data = await apiFetch('/tasks', { method: 'POST', body: JSON.stringify(t) });
      set((s) => ({ tasks: [...s.tasks, data] }));
    } catch (err) {
      console.error(err);
    }
  },

  updateTask: async (id, patch) => {
    try {
      const data = await apiFetch(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(patch) });
      set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)) }));
    } catch (err) {
      console.error(err);
    }
  },

  deleteTask: async (id) => {
    try {
      await apiFetch(`/tasks/${id}`, { method: 'DELETE' });
      set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
    } catch (err) {
      console.error(err);
    }
  },

  toggleDone: async (id) => {
    const task = get().tasks.find(t => t.id === id);
    if (!task) return;
    
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    const completedAt = newStatus === 'done' ? new Date().toISOString() : undefined;
    
    try {
      const patch = { status: newStatus, completedAt };
      const data = await apiFetch(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(patch) });
      set((s) => ({
        tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)),
      }));
    } catch (err) {
      console.error(err);
    }
  },

  toggleSubtask: async (taskId, subId) => {
    const task = get().tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedSubtasks = task.subtasks.map((st) => 
      st.id === subId ? { ...st, done: !st.done } : st
    );

    try {
      const patch = { subtasks: updatedSubtasks };
      const data = await apiFetch(`/tasks/${taskId}`, { method: 'PUT', body: JSON.stringify(patch) });
      set((s) => ({
        tasks: s.tasks.map((t) => (t.id !== taskId ? t : { ...t, ...data })),
      }));
    } catch (err) {
      console.error(err);
    }
  },
}));
