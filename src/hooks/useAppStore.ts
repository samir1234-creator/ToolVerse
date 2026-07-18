import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { HistoryEntry, ThemeMode } from '@/types';

interface AppState {
  favorites: string[];
  recents: string[];
  history: HistoryEntry[];
  theme: ThemeMode;
  animationsEnabled: boolean;
  hapticsEnabled: boolean;
  toggleFavorite: (toolId: string) => void;
  isFavorite: (toolId: string) => boolean;
  addRecent: (toolId: string) => void;
  addHistory: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  setTheme: (theme: ThemeMode) => void;
  setAnimationsEnabled: (v: boolean) => void;
  setHapticsEnabled: (v: boolean) => void;
}

const MAX_RECENTS = 15;
const MAX_HISTORY = 50;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      favorites: [],
      recents: [],
      history: [],
      theme: 'system',
      animationsEnabled: true,
      hapticsEnabled: true,

      toggleFavorite: (toolId) =>
        set((state) => ({
          favorites: state.favorites.includes(toolId)
            ? state.favorites.filter((id) => id !== toolId)
            : [...state.favorites, toolId],
        })),

      isFavorite: (toolId) => get().favorites.includes(toolId),

      addRecent: (toolId) =>
        set((state) => ({
          recents: [toolId, ...state.recents.filter((id) => id !== toolId)].slice(0, MAX_RECENTS),
        })),

      addHistory: (entry) =>
        set((state) => ({
          history: [
            { ...entry, id: crypto.randomUUID(), timestamp: Date.now() },
            ...state.history,
          ].slice(0, MAX_HISTORY),
        })),

      clearHistory: () => set({ history: [] }),
      setTheme: (theme) => set({ theme }),
      setAnimationsEnabled: (v) => set({ animationsEnabled: v }),
      setHapticsEnabled: (v) => set({ hapticsEnabled: v }),
    }),
    { name: 'toolverse-store' }
  )
);
