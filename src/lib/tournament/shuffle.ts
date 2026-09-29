import { Cartoon } from "@/types/cartoon";

/**
 * Standard Fisher-Yates shuffle for full random tournament mode.
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Balanced shuffle mode:
 * Group cartoons by category, shuffle within each category, then interleave them
 * so cartoons of the same category are matched cross-category in Round 1 rather than facing each other immediately.
 */
export function balancedShuffle(cartoons: Cartoon[]): Cartoon[] {
  // Group by category
  const categoriesMap = new Map<string, Cartoon[]>();

  cartoons.forEach((c) => {
    const cat = c.category || "international";
    if (!categoriesMap.has(cat)) {
      categoriesMap.set(cat, []);
    }
    categoriesMap.get(cat)!.push(c);
  });

  // Shuffle within each category pool
  const pools: Cartoon[][] = [];
  categoriesMap.forEach((list) => {
    pools.push(shuffleArray(list));
  });

  // Interleave from pools into two halves: Left Wing (cartoonA) and Right Wing (cartoonB)
  const left: Cartoon[] = [];
  const right: Cartoon[] = [];
  let currentPoolIdx = 0;

  const total = cartoons.length;
  for (let i = 0; i < total; i++) {
    // find a pool with items
    let attempts = 0;
    while (pools[currentPoolIdx].length === 0 && attempts < pools.length) {
      currentPoolIdx = (currentPoolIdx + 1) % pools.length;
      attempts++;
    }

    if (pools[currentPoolIdx].length > 0) {
      const item = pools[currentPoolIdx].pop()!;
      if (i % 2 === 0) {
        left.push(item);
      } else {
        right.push(item);
      }
    }
    currentPoolIdx = (currentPoolIdx + 1) % pools.length;
  }

  // Combine left and right in alternating order so left[k] faces right[k]
  const balanced: Cartoon[] = [];
  for (let i = 0; i < left.length; i++) {
    balanced.push(left[i]);
    if (i < right.length) {
      balanced.push(right[i]);
    }
  }

  return balanced;
}
