export type Difficulty = "easy" | "medium" | "hard";

export interface HistoryEntry {
  idx: number;
  prevValue: number;
  prevNotes: Set<number>;
}