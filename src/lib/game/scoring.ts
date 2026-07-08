// ── Base points per difficulty ──────────────────────────────────────────
const BASE_PTS: Record<"easy" | "medium" | "hard", number> = {
  easy: 10,
  medium: 25,
  hard: 50,
};

// ── Dungeon ─────────────────────────────────────────────────────────────
export function calculateDungeonPts(
  fragmentsFound: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _trapCount: number,
): number {
  const base = 10;
  const fragmentBonus = fragmentsFound * 10;
  const completionBonus = fragmentsFound === 4 ? 15 : 0;
  return base + fragmentBonus + completionBonus;
}

// ── Sudoku ───────────────────────────────────────────────────────────────
export function calculateSudokuPts(
  diff: "easy" | "medium" | "hard",
  mistakes: number,
): number {
  const base = BASE_PTS[diff];
  const multiplier = mistakes === 0 ? 1.5 : mistakes === 1 ? 1.0 : 0.7;
  return Math.floor(base * multiplier);
}

// ── Sort ─────────────────────────────────────────────────────────────────
export function calculateSortPts(
  diff: "easy" | "medium" | "hard",
  swaps: number,
  par: number,
): number {
  const base = BASE_PTS[diff];
  const parDiff = swaps - par;
  const multiplier =
    parDiff <= 0
      ? 1.5
      : parDiff === 1
        ? 1.25
        : parDiff === 2
          ? 1.0
          : parDiff === 3
            ? 0.75
            : 0.5;
  return Math.floor(base * multiplier);
}

// ── Trace ────────────────────────────────────────────────────────────────
export function calculateTracePts(score: number, timeLeft: number): number {
  const base = 40; // ค่าคงที่ เพราะ Trace มี progression ในตัวอยู่แล้ว
  const accuracy = score / 10;
  const timeFactor = timeLeft > 120 ? 1.5 : timeLeft > 60 ? 1.25 : 1.0;
  return Math.min(50, Math.floor(base * accuracy * timeFactor));
}
