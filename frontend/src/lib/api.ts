const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  // Fallback for mobile browsers that block 3rd-party cookies
  const token = localStorage.getItem('civictask_token');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include' // THIS is crucial for sending cookies
  });

  // Automatically log out if unauthorized
  if (response.status === 401 && endpoint !== '/auth/login' && endpoint !== '/auth/me') {
    localStorage.removeItem('civictask_token');
    window.location.href = '/login';
    return null;
  }

  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.error || 'An error occurred');
  }

  return data;
};
