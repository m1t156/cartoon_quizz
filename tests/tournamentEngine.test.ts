import { CARTOONS } from "../src/data/cartoons";
import { tournamentEngine } from "../src/lib/tournament/tournamentEngine";
import { describe, expect, it } from "vitest";

describe("Cartoon Super Cup 256 - Tournament Engine Unit Tests", () => {
  it("should create a valid 256-contestant tournament structure", () => {
    const tournament = tournamentEngine.createTournament(CARTOONS, "full-random");

    expect(tournament.rounds.length).toBe(8);
    expect(tournament.currentRound).toBe(1);
    expect(tournament.currentMatch).toBe(0);
    expect(tournament.completed).toBe(false);

    // Round match counts: 128, 64, 32, 16, 8, 4, 2, 1
    const expectedMatchCounts = [128, 64, 32, 16, 8, 4, 2, 1];
    let totalMatches = 0;

    tournament.rounds.forEach((round, idx) => {
      expect(round.matches.length).toBe(expectedMatchCounts[idx]);
      totalMatches += round.matches.length;
    });

    expect(totalMatches).toBe(255);
  });

  it("should enforce exactly 256 unique cartoons dataset", () => {
    expect(CARTOONS.length).toBe(256);
    const idSet = new Set(CARTOONS.map((c) => c.id));
    expect(idSet.size).toBe(256);
  });

  it("should support advancing winners through 255 battles to declare a Champion", () => {
    let state = tournamentEngine.createTournament(CARTOONS, "full-random");
    let battleCount = 0;

    while (!state.completed) {
      const match = tournamentEngine.getCurrentMatch(state);
      expect(match).not.toBeNull();
      expect(match?.cartoonA).not.toBeNull();
      expect(match?.cartoonB).not.toBeNull();

      // Always select cartoonA as winner for deterministic simulation
      const winner = match!.cartoonA!;
      state = tournamentEngine.selectWinner(state, winner.id);
      battleCount++;
    }

    expect(battleCount).toBe(255);
    expect(state.completed).toBe(true);
    expect(state.championId).toBeDefined();

    const champion = tournamentEngine.getChampion(state);
    const runnerUp = tournamentEngine.getRunnerUp(state);
    const finalFour = tournamentEngine.getFinalFour(state);
    const champPath = tournamentEngine.getChampionPath(state);

    expect(champion).not.toBeNull();
    expect(runnerUp).not.toBeNull();
    expect(finalFour.length).toBe(4);
    expect(champPath.length).toBe(8); // Champion won 8 rounds
  });

  it("should correctly handle undoLastChoice across match and round transitions", () => {
    let state = tournamentEngine.createTournament(CARTOONS, "full-random");

    // Play 5 matches
    for (let i = 0; i < 5; i++) {
      const m = tournamentEngine.getCurrentMatch(state)!;
      state = tournamentEngine.selectWinner(state, m.cartoonA!.id);
    }

    expect(state.currentMatch).toBe(5);

    // Undo 1 match
    state = tournamentEngine.undoLastChoice(state);
    expect(state.currentMatch).toBe(4);

    // Complete entire Round 1 (128 matches total)
    // We are at match 4 currently (4 matches played previously)
    while (state.currentRound === 1) {
      const m = tournamentEngine.getCurrentMatch(state)!;
      state = tournamentEngine.selectWinner(state, m.cartoonA!.id);
    }

    expect(state.currentRound).toBe(2);
    expect(state.currentMatch).toBe(0);

    // Undo across round transition back into Round 1 match 127
    state = tournamentEngine.undoLastChoice(state);
    expect(state.currentRound).toBe(1);
    expect(state.currentMatch).toBe(127);
    expect(state.rounds[0].matches[127].winnerId).toBeUndefined();
  });

  it("should create balanced tournament with cross-category pairings", () => {
    const tournament = tournamentEngine.createTournament(CARTOONS, "balanced");
    expect(tournament.rounds[0].matches.length).toBe(128);

    // Verify first 10 matches are paired
    tournament.rounds[0].matches.slice(0, 10).forEach((m) => {
      expect(m.cartoonA).not.toBeNull();
      expect(m.cartoonB).not.toBeNull();
    });
  });

  it("should accurately track overall tournament progress percentage", () => {
    let state = tournamentEngine.createTournament(CARTOONS, "full-random");

    let progress = tournamentEngine.getProgress(state);
    expect(progress.completedMatchesTotal).toBe(0);
    expect(progress.percentage).toBe(0);

    // Play 100 matches
    for (let i = 0; i < 100; i++) {
      const m = tournamentEngine.getCurrentMatch(state)!;
      state = tournamentEngine.selectWinner(state, m.cartoonA!.id);
    }

    progress = tournamentEngine.getProgress(state);
    expect(progress.completedMatchesTotal).toBe(100);
    expect(progress.percentage).toBe(Math.round((100 / 255) * 100));
  });
});
