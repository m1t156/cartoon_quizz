import { Cartoon } from "./cartoon";

export type TournamentMode = "full-random" | "balanced";

export interface Match {
  id: string; // e.g. "r1-m0", "r2-m15"
  round: number; // 1 to 8
  index: number; // 0-based index in round matches array
  cartoonA: Cartoon | null;
  cartoonB: Cartoon | null;
  winnerId?: number;
}

export interface TournamentRound {
  roundNumber: number; // 1..8
  name: string; // "Round of 256", "Round of 128", etc.
  matches: Match[];
}

export interface TournamentState {
  tournamentId: string;
  createdAt: number;
  mode: TournamentMode;
  currentRound: number; // 1..8
  currentMatch: number; // 0-indexed within current round
  rounds: TournamentRound[];
  championId?: number;
  completed: boolean;
  historyStack?: Array<{
    round: number;
    match: number;
    winnerId: number;
  }>;
}

export interface TournamentProgress {
  currentRoundNumber: number;
  currentRoundName: string;
  matchInRound: number; // 1-indexed for UI display
  totalMatchesInRound: number; // e.g., 128 in round 1
  completedMatchesTotal: number; // 0..255
  totalMatches: number; // 255
  percentage: number; // 0..100
  isRoundComplete: boolean;
  isTournamentComplete: boolean;
}

export interface TournamentHistoryItem {
  id: string;
  date: number;
  champion: Cartoon;
  runnerUp?: Cartoon;
  mode: TournamentMode;
  totalBattles: number;
}

export const ROUND_NAMES: Record<number, string> = {
  1: "Round of 256",
  2: "Round of 128",
  3: "Round of 64",
  4: "Round of 32",
  5: "Sweet 16",
  6: "Quarterfinal",
  7: "Semifinal",
  8: "Grand Final",
};
