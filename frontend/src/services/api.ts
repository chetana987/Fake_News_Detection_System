import axios from 'axios';
import type { DashboardStats } from '@/types/stats';
import type { FlaggedPost, Claim } from '@/types/claim';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message || err.message || 'Request failed';
    console.error('[API Error]', msg);
    return Promise.reject(new Error(msg));
  },
);

export async function fetchStats(): Promise<DashboardStats> {
  const { data } = await api.get<DashboardStats>('/stats');
  return data;
}

export async function fetchFlagged(): Promise<FlaggedPost[]> {
  const { data } = await api.get<FlaggedPost[]>('/flagged');
  return data;
}

export async function fetchFlaggedById(id: string): Promise<FlaggedPost | null> {
  try {
    const { data } = await api.get<FlaggedPost>(`/flagged/${id}`);
    return data;
  } catch {
    return null;
  }
}

export type { DashboardStats, FlaggedPost, Claim };
