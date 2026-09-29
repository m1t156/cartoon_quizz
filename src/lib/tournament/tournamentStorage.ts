import { TournamentHistoryItem, TournamentState } from "@/types/tournament";

const STORAGE_KEY = "cartoon-super-cup-state";
const HISTORY_KEY = "cartoon-super-cup-history";

export const tournamentStorage = {
  saveState(state: TournamentState): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save tournament state to localStorage", e);
    }
  },

  loadState(): TournamentState | null {
    if (typeof window === "undefined") return null;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;
      return JSON.parse(data) as TournamentState;
    } catch (e) {
      console.error("Failed to parse tournament state from localStorage", e);
      return null;
    }
  },

  clearState(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear tournament state", e);
    }
  },

  saveHistory(item: TournamentHistoryItem): void {
    if (typeof window === "undefined") return;
    try {
      const history = this.loadHistory();
      const updated = [item, ...history.filter((h) => h.id !== item.id)].slice(0, 5);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save tournament history", e);
    }
  },

  loadHistory(): TournamentHistoryItem[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      if (!data) return [];
      return JSON.parse(data) as TournamentHistoryItem[];
    } catch (e) {
      console.error("Failed to load history", e);
      return [];
    }
  },
};
