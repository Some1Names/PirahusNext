import { useState, useEffect, useCallback, useRef } from "react";
import { Difficulty, HistoryEntry } from "./types";
import { generatePuzzle } from "./sudokuLogic";
import { useGamePoints } from "@/src/hooks/useGamePoints";
import { calculateSudokuPts } from "@/src/lib/game/scoring";

export const MAX_MISTAKES = 3;

export function useSudoku() {
  const [board, setBoard] = useState<number[]>(Array(81).fill(0));
  const [solution, setSolution] = useState<number[]>(Array(81).fill(0));
  const [given, setGiven] = useState<boolean[]>(Array(81).fill(false));
  const [notes, setNotes] = useState<Set<number>[]>(Array(81).fill(null).map(() => new Set()));
  const [selected, setSelected] = useState<number | null>(null);
  const [notesMode, setNotesMode] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [diff, setDiff] = useState<Difficulty>("easy");
  const [timer, setTimer] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasAwardedRef = useRef(false);
  const { awardPoints, popupPoints, showPopup, closePopup } = useGamePoints("sudoku");

  const startGame = useCallback((d: Difficulty) => {
    const { board: b, solution: s } = generatePuzzle(d);
    setBoard(b);
    setSolution(s);
    setGiven(b.map((v) => v !== 0));
    setNotes(Array(81).fill(null).map(() => new Set()));
    setSelected(null);
    setNotesMode(false);
    setMistakes(0);
    setHistory([]);
    setDiff(d);
    setGameOver(false);
    setWin(false);
    setTimer(0);
    hasAwardedRef.current = false;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => startGame("easy"));
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startGame]);

  useEffect(() => {
    if (hasAwardedRef.current || gameOver || win || board.some((v) => v === 0)) return;
    
    if (board.every((v, i) => v === solution[i])) {
      hasAwardedRef.current = true;
      Promise.resolve().then(() => setWin(true));
      if (timerRef.current) clearInterval(timerRef.current);
      const pts = calculateSudokuPts(diff, mistakes);
      awardPoints(pts, { diff, mistakes, timeTaken: timer });
    }
  }, [board, solution, gameOver, win, diff, mistakes, timer, awardPoints]);

  const inputNumber = useCallback((n: number) => {
    if (selected === null || given[selected] || gameOver || win) return;
    setHistory((h) => [...h, { idx: selected, prevValue: board[selected], prevNotes: new Set(notes[selected]) }]);

    if (notesMode && n !== 0) {
      setNotes((prev) => {
        const next = prev.map((s) => new Set(s));
        if (next[selected].has(n)) next[selected].delete(n);
        else next[selected].add(n);
        return next;
      });
      return;
    }

    if (n === 0) {
      setBoard((b) => { const nb = [...b]; nb[selected] = 0; return nb; });
      return;
    }

    if (board[selected] === n) {
      setBoard((b) => { const nb = [...b]; nb[selected] = 0; return nb; });
      return;
    }

    const isCorrect = n === solution[selected];
    if (!isCorrect) {
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      if (newMistakes >= MAX_MISTAKES) {
        setGameOver(true);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }

    setBoard((b) => {
      const nb = [...b];
      nb[selected] = n;
      return nb;
    });

    if (isCorrect) {
      setNotes((prev) => {
        const next = prev.map((s) => new Set(s));
        const selRow = Math.floor(selected / 9);
        const selCol = selected % 9;
        const selBox = Math.floor(selRow / 3) * 3 + Math.floor(selCol / 3);
        for (let i = 0; i < 81; i++) {
          const r = Math.floor(i / 9), c = i % 9;
          const box = Math.floor(r / 3) * 3 + Math.floor(c / 3);
          if (r === selRow || c === selCol || box === selBox) next[i].delete(n);
        }
        return next;
      });
    }
  }, [selected, given, gameOver, win, notesMode, board, solution, mistakes, notes]);

  const undoMove = useCallback(() => {
    if (!history.length || gameOver || win) return;
    const last = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setBoard((b) => { const nb = [...b]; nb[last.idx] = last.prevValue; return nb; });
    setNotes((prev) => {
      const next = prev.map((s) => new Set(s));
      next[last.idx] = last.prevNotes;
      return next;
    });
  }, [history, gameOver, win]);

  const toggleNotesMode = useCallback(() => setNotesMode((m) => !m), []);

  return {
    board, solution, given, notes, selected, setSelected,
    notesMode, toggleNotesMode, mistakes, diff,
    timer, gameOver, win,
    startGame, inputNumber, undoMove,
    popupPoints, showPopup, closePopup,
  };
}