"use client";

import { CARTOONS } from "@/data/cartoons";
import { tournamentEngine } from "@/lib/tournament/tournamentEngine";
import { tournamentStorage } from "@/lib/tournament/tournamentStorage";
import { Cartoon } from "@/types/cartoon";
import {
  Match,
  TournamentMode,
  TournamentProgress,
  TournamentState,
} from "@/types/tournament";
import { useCallback, useEffect, useState } from "react";

export function useTournament() {
  const [tournament, setTournament] = useState<TournamentState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize or resume from localStorage
  useEffect(() => {
    const savedState = tournamentStorage.loadState();
    if (savedState) {
      setTournament(savedState);
    }
    setIsLoaded(true);
  }, []);

  // Save history on completion
  useEffect(() => {
    if (tournament && tournament.completed) {
      const champ = tournamentEngine.getChampion(tournament);
      const runnerUp = tournamentEngine.getRunnerUp(tournament);
      if (champ) {
        tournamentStorage.saveHistory({
          id: tournament.tournamentId,
          date: tournament.createdAt,
          champion: champ,
          runnerUp: runnerUp || undefined,
          mode: tournament.mode,
          totalBattles: 255,
        });
      }
    }
  }, [tournament]);

  const startTournament = useCallback((mode: TournamentMode = "full-random") => {
    const newTournament = tournamentEngine.createTournament(CARTOONS, mode);
    setTournament(newTournament);
    return newTournament;
  }, []);

  const selectWinner = useCallback(
    (winnerId: number) => {
      if (!tournament || tournament.completed) return;
      const nextState = tournamentEngine.selectWinner(tournament, winnerId);
      setTournament(nextState);
    },
    [tournament]
  );

  const undo = useCallback(() => {
    if (!tournament) return;
    const nextState = tournamentEngine.undoLastChoice(tournament);
    setTournament(nextState);
  }, [tournament]);

  const reset = useCallback(
    (mode: TournamentMode = "full-random") => {
      const nextState = tournamentEngine.resetTournament(CARTOONS, mode);
      setTournament(nextState);
    },
    []
  );

  const currentMatch: Match | null = tournament
    ? tournamentEngine.getCurrentMatch(tournament)
    : null;

  const progress: TournamentProgress | null = tournament
    ? tournamentEngine.getProgress(tournament)
    : null;

  const champion: Cartoon | null = tournament
    ? tournamentEngine.getChampion(tournament)
    : null;

  const runnerUp: Cartoon | null = tournament
    ? tournamentEngine.getRunnerUp(tournament)
    : null;

  const finalFour: Cartoon[] = tournament
    ? tournamentEngine.getFinalFour(tournament)
    : [];

  const championPath = tournament
    ? tournamentEngine.getChampionPath(tournament)
    : [];

  return {
    tournament,
    isLoaded,
    currentMatch,
    progress,
    champion,
    runnerUp,
    finalFour,
    championPath,
    startTournament,
    selectWinner,
    undo,
    reset,
  };
}
