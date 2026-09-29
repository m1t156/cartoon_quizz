import { Cartoon } from "@/types/cartoon";
import {
  Match,
  ROUND_NAMES,
  TournamentMode,
  TournamentProgress,
  TournamentState,
} from "@/types/tournament";
import { advanceWinner } from "./advanceWinner";
import { generateBracket } from "./generateBracket";
import { tournamentStorage } from "./tournamentStorage";

export const tournamentEngine = {
  createTournament(
    cartoons: Cartoon[],
    mode: TournamentMode = "full-random"
  ): TournamentState {
    const rounds = generateBracket(cartoons, mode);
    const state: TournamentState = {
      tournamentId: `tsc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: Date.now(),
      mode,
      currentRound: 1,
      currentMatch: 0,
      rounds,
      completed: false,
      historyStack: [],
    };
    tournamentStorage.saveState(state);
    return state;
  },

  selectWinner(state: TournamentState, winnerId: number): TournamentState {
    const updated = advanceWinner(state, winnerId);
    tournamentStorage.saveState(updated);
    return updated;
  },

  getCurrentMatch(state: TournamentState): Match | null {
    if (state.completed) return null;
    const roundObj = state.rounds[state.currentRound - 1];
    if (!roundObj) return null;
    return roundObj.matches[state.currentMatch] || null;
  },

  getProgress(state: TournamentState): TournamentProgress {
    const roundNumber = state.currentRound;
    const roundObj = state.rounds[roundNumber - 1];
    const totalMatchesInRound = roundObj ? roundObj.matches.length : 0;

    // Calculate completed matches overall
    // Total matches in rounds 1..(roundNumber-1) plus state.currentMatch
    let completedTotal = 0;
    for (let r = 1; r < roundNumber; r++) {
      completedTotal += state.rounds[r - 1].matches.length;
    }
    if (state.completed) {
      completedTotal = 255;
    } else {
      completedTotal += state.currentMatch;
    }

    const totalMatches = 255;
    const percentage = Math.min(100, Math.round((completedTotal / totalMatches) * 100));

    return {
      currentRoundNumber: roundNumber,
      currentRoundName: ROUND_NAMES[roundNumber] || `Round ${roundNumber}`,
      matchInRound: state.completed
        ? totalMatchesInRound
        : Math.min(totalMatchesInRound, state.currentMatch + 1),
      totalMatchesInRound,
      completedMatchesTotal: completedTotal,
      totalMatches,
      percentage,
      isRoundComplete: state.currentMatch >= totalMatchesInRound,
      isTournamentComplete: state.completed,
    };
  },

  undoLastChoice(state: TournamentState): TournamentState {
    const stack = state.historyStack ? [...state.historyStack] : [];
    if (stack.length === 0) {
      return state; // Nothing to undo
    }

    const lastAction = stack.pop()!;
    const { round: targetRound, match: targetMatchIdx } = lastAction;

    // Clone rounds
    const newRounds = state.rounds.map((r) => ({
      ...r,
      matches: r.matches.map((m) => ({ ...m })),
    }));

    // Reset winner of target match
    newRounds[targetRound - 1].matches[targetMatchIdx].winnerId = undefined;

    // If targetRound < 8, reset downstream matches in targetRound+1 that depended on this
    // Since round transition re-evaluates round winners, reset future round contestants if they were populated
    for (let r = targetRound; r < 8; r++) {
      const futureRoundMatches = newRounds[r].matches;
      // If we are resetting match targetMatchIdx in round targetRound, the winner went to match Math.floor(targetMatchIdx / 2) in round targetRound+1
      futureRoundMatches.forEach((m) => {
        m.cartoonA = null;
        m.cartoonB = null;
        m.winnerId = undefined;
      });

      // Re-populate downstream rounds if that round's previous matches are still all complete
      const prevRoundMatches = newRounds[r - 1].matches;
      const allPrevDone = prevRoundMatches.every((m) => m.winnerId !== undefined);
      if (allPrevDone) {
        const roundWinners: Cartoon[] = [];
        prevRoundMatches.forEach((m) => {
          const w =
            m.cartoonA?.id === m.winnerId
              ? m.cartoonA
              : m.cartoonB?.id === m.winnerId
              ? m.cartoonB
              : null;
          if (w) roundWinners.push(w);
        });
        for (let i = 0; i < futureRoundMatches.length; i++) {
          futureRoundMatches[i].cartoonA = roundWinners[i * 2] || null;
          futureRoundMatches[i].cartoonB = roundWinners[i * 2 + 1] || null;
        }
      } else {
        break; // Stop cascading if previous round is no longer fully complete
      }
    }

    const updatedState: TournamentState = {
      ...state,
      rounds: newRounds,
      currentRound: targetRound,
      currentMatch: targetMatchIdx,
      completed: false,
      championId: undefined,
      historyStack: stack,
    };

    tournamentStorage.saveState(updatedState);
    return updatedState;
  },

  resetTournament(
    cartoons: Cartoon[],
    mode: TournamentMode = "full-random"
  ): TournamentState {
    tournamentStorage.clearState();
    return this.createTournament(cartoons, mode);
  },

  resumeTournament(): TournamentState | null {
    return tournamentStorage.loadState();
  },

  getChampion(state: TournamentState): Cartoon | null {
    if (!state.completed || !state.championId) return null;
    const grandFinalMatch = state.rounds[7]?.matches[0];
    if (!grandFinalMatch) return null;
    if (grandFinalMatch.cartoonA?.id === state.championId) return grandFinalMatch.cartoonA;
    if (grandFinalMatch.cartoonB?.id === state.championId) return grandFinalMatch.cartoonB;
    return null;
  },

  getRunnerUp(state: TournamentState): Cartoon | null {
    if (!state.completed || !state.championId) return null;
    const grandFinalMatch = state.rounds[7]?.matches[0];
    if (!grandFinalMatch) return null;
    if (grandFinalMatch.cartoonA?.id === state.championId) return grandFinalMatch.cartoonB;
    return grandFinalMatch.cartoonA;
  },

  getFinalFour(state: TournamentState): Cartoon[] {
    const semifinalObj = state.rounds[6]; // Round 7 (Semifinal)
    if (!semifinalObj) return [];
    const contestants: Cartoon[] = [];
    semifinalObj.matches.forEach((m) => {
      if (m.cartoonA) contestants.push(m.cartoonA);
      if (m.cartoonB) contestants.push(m.cartoonB);
    });
    return contestants;
  },

  getChampionPath(state: TournamentState): { defeated: Cartoon; roundName: string }[] {
    if (!state.completed || !state.championId) return [];
    const champId = state.championId;
    const path: { defeated: Cartoon; roundName: string }[] = [];

    state.rounds.forEach((r) => {
      const matchWithChamp = r.matches.find(
        (m) => m.cartoonA?.id === champId || m.cartoonB?.id === champId
      );
      if (matchWithChamp && matchWithChamp.winnerId === champId) {
        const opponent =
          matchWithChamp.cartoonA?.id === champId
            ? matchWithChamp.cartoonB
            : matchWithChamp.cartoonA;
        if (opponent) {
          path.push({ defeated: opponent, roundName: r.name });
        }
      }
    });

    return path;
  },
};
