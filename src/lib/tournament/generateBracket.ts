import { Cartoon } from "@/types/cartoon";
import { Match, ROUND_NAMES, TournamentMode, TournamentRound } from "@/types/tournament";
import { balancedShuffle, shuffleArray } from "./shuffle";

export function generateBracket(
  cartoons: Cartoon[],
  mode: TournamentMode = "full-random"
): TournamentRound[] {
  if (cartoons.length !== 256) {
    throw new Error(`Tournament requires exactly 256 cartoons, received ${cartoons.length}`);
  }

  // Validate unique IDs
  const idSet = new Set(cartoons.map((c) => c.id));
  if (idSet.size !== 256) {
    throw new Error("Duplicate cartoon IDs detected in dataset!");
  }

  const seededCartoons =
    mode === "balanced" ? balancedShuffle(cartoons) : shuffleArray(cartoons);

  const rounds: TournamentRound[] = [];

  // Create Round 1 (128 matches)
  const round1Matches: Match[] = [];
  for (let i = 0; i < 128; i++) {
    round1Matches.push({
      id: `r1-m${i}`,
      round: 1,
      index: i,
      cartoonA: seededCartoons[i * 2],
      cartoonB: seededCartoons[i * 2 + 1],
    });
  }

  rounds.push({
    roundNumber: 1,
    name: ROUND_NAMES[1],
    matches: round1Matches,
  });

  // Create empty slots for Round 2 through Round 8
  const roundSizes = [64, 32, 16, 8, 4, 2, 1];
  roundSizes.forEach((size, idx) => {
    const roundNumber = idx + 2;
    const matches: Match[] = [];
    for (let i = 0; i < size; i++) {
      matches.push({
        id: `r${roundNumber}-m${i}`,
        round: roundNumber,
        index: i,
        cartoonA: null,
        cartoonB: null,
      });
    }
    rounds.push({
      roundNumber,
      name: ROUND_NAMES[roundNumber],
      matches,
    });
  });

  return rounds;
}
