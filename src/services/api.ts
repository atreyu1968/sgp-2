import { ReviewData } from '../types/review';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Include cookies for session management
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message);
  }

  return response.json();
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    logout: () => fetchApi('/auth/logout', { method: 'POST' }),
    me: () => fetchApi('/auth/me'),
  },

  reviews: {
    save: (reviewData: ReviewData) =>
      fetchApi('/reviews', {
        method: 'POST',
        body: JSON.stringify(reviewData),
      }),
    get: (projectId: string) => fetchApi(`/reviews/${projectId}`),
    list: (projectId: string) => fetchApi(`/reviews/project/${projectId}`),
  },

  projects: {
    list: () => fetchApi('/projects'),
    get: (id: string) => fetchApi(`/projects/${id}`),
    create: (data: any) =>
      fetchApi('/projects', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      fetchApi(`/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchApi(`/projects/${id}`, {
        method: 'DELETE',
      }),
  },

  users: {
    list: () => fetchApi('/users'),
    get: (id: string) => fetchApi(`/users/${id}`),
    create: (data: any) =>
      fetchApi('/users', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      fetchApi(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchApi(`/users/${id}`, {
        method: 'DELETE',
      }),
  },

  convocatorias: {
    list: () => fetchApi('/convocatorias'),
    get: (id: string) => fetchApi(`/convocatorias/${id}`),
    create: (data: any) =>
      fetchApi('/convocatorias', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      fetchApi(`/convocatorias/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchApi(`/convocatorias/${id}`, {
        method: 'DELETE',
      }),
  },

  settings: {
    get: () => fetchApi('/settings'),
    update: (data: any) =>
      fetchApi('/settings', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    backup: () => fetchApi('/settings/backup'),
    restore: (file: File) => {
      const formData = new FormData();
      formData.append('backup', file);
      return fetchApi('/settings/restore', {
        method: 'POST',
        body: formData,
        headers: {}, // Let browser set content-type for FormData
      });
    },
  },
};