/**
 * src/services/api.ts
 *
 * Thin wrapper around fetch to call the QuizBlast Express API.
 * The Vite dev server proxies /api/* → http://localhost:3001 automatically.
 *
 * Usage:
 *   import api from '@/services/api';
 *   const quizzes = await api.quizzes.list();
 *   const quiz    = await api.quizzes.get('abc');
 *   const created = await api.quizzes.create({ title: 'My Quiz', questions: [] });
 */

const BASE = '/api';

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error ?? `HTTP ${res.status}`);
  }

  return data as T;
}

// ── Quizzes ──────────────────────────────────────────────────────────────────

export const quizzesApi = {
  list: (params?: { category?: string; difficulty?: string; search?: string }) => {
    const qs = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
    return request<{ success: boolean; count: number; data: Quiz[] }>('GET', `/quizzes${qs}`);
  },

  get: (id: string) =>
    request<{ success: boolean; data: Quiz }>('GET', `/quizzes/${id}`),

  create: (quiz: Partial<Quiz>) =>
    request<{ success: boolean; data: Quiz }>('POST', '/quizzes', quiz),

  update: (id: string, changes: Partial<Quiz>) =>
    request<{ success: boolean; data: Quiz }>('PUT', `/quizzes/${id}`, changes),

  remove: (id: string) =>
    request<{ success: boolean; message: string }>('DELETE', `/quizzes/${id}`),
};

// ── Users ───────────────────────────────────────────────────────────────────

export const usersApi = {
  list: () =>
    request<{ success: boolean; count: number; data: User[] }>('GET', '/users'),

  get: (id: string) =>
    request<{ success: boolean; data: User }>('GET', `/users/${id}`),

  create: (user: Partial<User>) =>
    request<{ success: boolean; data: User }>('POST', '/users', user),

  update: (id: string, changes: Partial<User>) =>
    request<{ success: boolean; data: User }>('PUT', `/users/${id}`, changes),

  remove: (id: string) =>
    request<{ success: boolean; message: string }>('DELETE', `/users/${id}`),
};

// ── Sessions ─────────────────────────────────────────────────────────────────

export const sessionsApi = {
  create: (quizId: string, hostId: string) =>
    request<{ success: boolean; data: GameSession }>('POST', '/sessions', { quizId, hostId }),

  get: (code: string) =>
    request<{ success: boolean; data: GameSession }>('GET', `/sessions/${code}`),

  join: (code: string, playerId: string, playerName: string) =>
    request<{ success: boolean; data: GameSession }>('PUT', `/sessions/${code}/join`, { playerId, playerName }),

  start: (code: string) =>
    request<{ success: boolean; data: GameSession }>('PUT', `/sessions/${code}/start`),

  end: (code: string, scores?: { id: string; score: number }[]) =>
    request<{ success: boolean; data: GameSession }>('PUT', `/sessions/${code}/end`, { scores }),

  remove: (code: string) =>
    request<{ success: boolean; message: string }>('DELETE', `/sessions/${code}`),
};

// ── Shared types ─────────────────────────────────────────────────────────────

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  timeLimit: number;
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  hostId: string;
  createdAt: string;
  updatedAt?: string;
  questions: Question[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'teacher' | 'player';
  createdAt: string;
}

export interface GameSession {
  id: string;
  code: string;
  quizId: string;
  hostId: string;
  status: 'waiting' | 'active' | 'ended';
  players: { id: string; name: string; score: number }[];
  currentQuestion: number;
  startedAt: string | null;
  endedAt: string | null;
  createdAt: string;
}

const api = { quizzes: quizzesApi, users: usersApi, sessions: sessionsApi };
export default api;
