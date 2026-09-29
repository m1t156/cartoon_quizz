import { Cartoon } from "@/types/cartoon";
import { Match, TournamentRound, TournamentState } from "@/types/tournament";

export function advanceWinner(
  state: TournamentState,
  winnerId: number
): TournamentState {
  if (state.completed) {
    return state;
  }

  const { currentRound, currentMatch, rounds } = state;
  const currentRoundObj = rounds[currentRound - 1];
  if (!currentRoundObj) return state;

  const match = currentRoundObj.matches[currentMatch];
  if (!match) return state;

  // Verify winner is valid contestant of this match
  const winnerObj =
    match.cartoonA?.id === winnerId
      ? match.cartoonA
      : match.cartoonB?.id === winnerId
      ? match.cartoonB
      : null;

  if (!winnerObj) {
    throw new Error(
      `Invalid winnerId ${winnerId} for match ${match.id}`
    );
  }

  // Clone rounds deep enough to avoid direct state mutations
  const newRounds = rounds.map((r) => ({
    ...r,
    matches: r.matches.map((m) => ({ ...m })),
  }));

  const updatedMatch = newRounds[currentRound - 1].matches[currentMatch];
  updatedMatch.winnerId = winnerId;

  // Track match decision in history stack for bulletproof undo
  const historyStack = [...(state.historyStack || [])];
  historyStack.push({
    round: currentRound,
    match: currentMatch,
    winnerId,
  });

  // Next position inside current round or next round
  let nextRound = currentRound;
  let nextMatchIndex = currentMatch + 1;
  let completed = false;
  let championId = state.championId;

  const totalMatchesInCurrentRound = currentRoundObj.matches.length;

  if (nextMatchIndex >= totalMatchesInCurrentRound) {
    // Current round finished! Populate next round's contestants if not final round
    if (currentRound < 8) {
      const nextRoundObj = newRounds[currentRound]; // index `currentRound` is round `currentRound + 1`
      const roundWinners: Cartoon[] = [];

      newRounds[currentRound - 1].matches.forEach((m) => {
        const winner =
          m.cartoonA?.id === m.winnerId
            ? m.cartoonA
            : m.cartoonB?.id === m.winnerId
            ? m.cartoonB
            : null;
        if (winner) roundWinners.push(winner);
      });

      for (let i = 0; i < nextRoundObj.matches.length; i++) {
        nextRoundObj.matches[i].cartoonA = roundWinners[i * 2] || null;
        nextRoundObj.matches[i].cartoonB = roundWinners[i * 2 + 1] || null;
      }

      nextRound = currentRound + 1;
      nextMatchIndex = 0;
    } else {
      // Grand Final completed!
      completed = true;
      championId = winnerId;
    }
  }

  return {
    ...state,
    rounds: newRounds,
    currentRound: nextRound,
    currentMatch: nextMatchIndex,
    completed,
    championId,
    historyStack,
  };
}
