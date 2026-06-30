// ── Base points per difficulty ──────────────────────────────────────────
const BASE_PTS: Record<"easy" | "medium" | "hard", number> = {
  easy: 10,
  medium: 25,
  hard: 50,
};

// ── Dungeon ─────────────────────────────────────────────────────────────
export function calculateDungeonPts(fragmentsFound: number, trapCount: number): number {
  const base = 50;
  const fragmentBonus = fragmentsFound * 15; // up to 4 fragments
  const trapPenalty = trapCount * 3; // total trap count in the dungeon, not hits
  return Math.max(10, base + fragmentBonus - trapPenalty);
}

// ── Sudoku ───────────────────────────────────────────────────────────────
export function calculateSudokuPts(
  diff: "easy" | "medium" | "hard",
  mistakes: number
): number {
  const base = BASE_PTS[diff];
  const multiplier =
    mistakes === 0 ? 1.5 :
    mistakes === 1 ? 1.0 :
    0.7;
  return Math.floor(base * multiplier);
}

// ── Sort ─────────────────────────────────────────────────────────────────
export function calculateSortPts(
  diff: "easy" | "medium" | "hard",
  swaps: number,
  par: number
): number {
  const base = BASE_PTS[diff];
  const parDiff = swaps - par;
  const multiplier =
    parDiff <= 0 ? 1.5 :
    parDiff === 1 ? 1.25 :
    parDiff === 2 ? 1.0 :
    parDiff === 3 ? 0.75 :
    0.5;
  return Math.floor(base * multiplier);
}

// ── Trace ────────────────────────────────────────────────────────────────
export function calculateTracePts(score: number, timeLeft: number): number {
  const base = 40; // ค่าคงที่ เพราะ Trace มี progression ในตัวอยู่แล้ว
  const accuracy = score / 10;
  const timeFactor =
    timeLeft > 120 ? 1.5 :
    timeLeft > 60  ? 1.25 :
    1.0;
  return Math.floor(base * accuracy * timeFactor);
}