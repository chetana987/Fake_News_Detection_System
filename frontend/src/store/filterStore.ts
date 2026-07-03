import { create } from 'zustand';
import type { Verdict } from '@/types/claim';

interface FilterState {
  verdict: Verdict | 'ALL';
  platform: string;
  search: string;
  confidenceMin: number;
  confidenceMax: number;
  dateFrom: string;
  dateTo: string;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  reset: () => void;
}

const initial = {
  verdict: 'ALL' as const,
  platform: '',
  search: '',
  confidenceMin: 0,
  confidenceMax: 1,
  dateFrom: '',
  dateTo: '',
};

export const useFilterStore = create<FilterState>((set) => ({
  ...initial,
  setFilter: (key, value) => set((s) => ({ ...s, [key]: value })),
  reset: () => set(initial),
}));
