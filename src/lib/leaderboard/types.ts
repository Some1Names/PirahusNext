export type PointsEntry = {
  userId: string;
  username: string;
  points: number;
  rank: number;
};

export type Difficulty = "easy" | "medium" | "hard";

export type SpeedrunEntry = {
  userId: string;
  username: string;
  timeMs: number;
  rank: number;
  difficulty?: Difficulty; // sudoku, sort
  score?: number; // trace
  correctAnswers?: number; // trace
  totalAnswers?: number; // trace
};

export type GameKey = "dungeon" | "sudoku" | "trace" | "sort";

export const DIFFICULTIES: { key: Difficulty; label: string }[] = [
  { key: "easy", label: "EASY" },
  { key: "medium", label: "MEDIUM" },
  { key: "hard", label: "HARD" },
];

// games that are ranked separately per difficulty
export const HAS_DIFFICULTY: Partial<Record<GameKey, boolean>> = {
  sudoku: true,
  sort: true,
};

export type LeaderboardProps = {
  pointsEndpoint?: string; // returns PointsEntry[]
  speedrunEndpoint?: string; // returns SpeedrunEntry[], expects ?game=&limit=
  currentUserId?: string;
};

export const GAMES: { key: GameKey; label: string; color: string }[] = [
  { key: "dungeon", label: "DUNGEON", color: "#22d3ee" },
  { key: "sudoku", label: "SUDOKU", color: "#fb923c" },
  { key: "trace", label: "TRACE", color: "#a78bfa" },
  { key: "sort", label: "SORT", color: "#fb7185" },
];

export const RANK_COLORS = ["#facc15", "#cbd5e1", "#d97706"]; // gold, silver, bronze
export const RANK_GLYPHS = ["①", "②", "③"];

export function formatTime(ms: number) {
  const totalSec = ms / 1000;
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toFixed(2).padStart(5, "0")}`;
}
