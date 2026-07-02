import { Difficulty, Level } from "./types";

export const LEVELS: Record<Difficulty, Level> = {
  easy:   { size: 6,  par: 6  },
  medium: { size: 9,  par: 12 },
  hard:   { size: 12, par: 20 },
};

export const MAX_BAR_HEIGHT = 12;

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  do {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
  } while (isSorted(a));
  return a;
}

export function isSorted<T>(arr: T[]): boolean {
  return arr.every((v, i) => i === 0 || (v as any) >= (arr[i - 1] as any));
}

export function minSwaps(arr: number[]): number {
  let inv = 0;
  for (let i = 0; i < arr.length; i++)
    for (let j = i + 1; j < arr.length; j++)
      if (arr[i] > arr[j]) inv++;
  return inv;
}

export function generatePuzzle(diff: Difficulty): number[] {
  const { size } = LEVELS[diff];
  const values = Array.from({ length: size }, (_, i) =>
    Math.round(1 + (i / (size - 1)) * (MAX_BAR_HEIGHT - 1))
  );
  return shuffle(values);
}

export function scoreLabel(swaps: number, par: number): { text: string; color: string } {
  const diff = swaps - par;
  if (diff <= 0)  return { text: `EAGLE  (${swaps} swaps)`,   color: "#86efac" };
  if (diff === 1) return { text: `BIRDIE  (${swaps} swaps)`,  color: "#6ee7b7" };
  if (diff === 2) return { text: `PAR  (${swaps} swaps)`,     color: "#d1d5db" };
  if (diff === 3) return { text: `BOGEY  (${swaps} swaps)`,   color: "#fbbf24" };
  return           { text: `DOUBLE+  (${swaps} swaps)`,       color: "#f87171" };
}