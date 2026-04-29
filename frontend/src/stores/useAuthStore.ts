import { create } from 'zustand';
import { apiFetch } from '../lib/api';

interface User {
  id: string;
  username: string;
  phone: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkUsername: (username: string) => Promise<boolean>;
  login: (credentials: any) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => void;
  initAuth: () => void; // Call on app start
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // initial load

  initAuth: async () => {
    try {
      const res = await apiFetch('/auth/me');
      if (res && res.user) {
        set({ user: res.user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (err) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  checkUsername: async (username: string) => {
    try {
      const res = await apiFetch(`/auth/check-username?username=${encodeURIComponent(username)}`);
      return res.available;
    } catch {
      return false; // Safest fallback
    }
  },

  login: async (credentials) => {
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    if (res && res.user) {
      set({ user: res.user, isAuthenticated: true });
    }
  },

  signup: async (data) => {
    const res = await apiFetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    if (res && res.user) {
      set({ user: res.user, isAuthenticated: true });
    }
  },

  logout: async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch(err) {
      console.error('Logout error', err);
    }
    set({ user: null, isAuthenticated: false });
    window.location.href = '/login';
  }
}));
