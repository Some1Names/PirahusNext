export function canPlace(board: number[], row: number, col: number, n: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (board[row * 9 + i] === n || board[i * 9 + col] === n) return false;
  }
  const br = Math.floor(row / 3) * 3;
  const bc = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      if (board[(br + i) * 9 + (bc + j)] === n) return false;
  return true;
}

export function solve(board: number[]): boolean {
  const pos = board.indexOf(0);
  if (pos < 0) return true;
  const row = Math.floor(pos / 9);
  const col = pos % 9;
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
  for (const n of nums) {
    if (canPlace(board, row, col, n)) {
      board[pos] = n;
      if (solve(board)) return true;
      board[pos] = 0;
    }
  }
  return false;
}

export function generatePuzzle(diff: "easy" | "medium" | "hard"): { board: number[]; solution: number[] } {
  const sol = Array(81).fill(0);
  solve(sol);
  const puzzle = [...sol];
  const removals = { easy: 35, medium: 45, hard: 52 };
  const cells = [...Array(81).keys()].sort(() => Math.random() - 0.5);
  for (let i = 0; i < removals[diff]; i++) puzzle[cells[i]] = 0;
  return { board: puzzle, solution: sol };
}