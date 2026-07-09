import { useState, useEffect, useCallback, useRef } from "react";
import { Difficulty } from "./types";
import { LEVELS, generatePuzzle, isSorted } from "./sortLogic";
import { useGamePoints } from "@/src/hooks/useGamePoints";
import { calculateSortPts } from "@/src/lib/game/scoring";

export function useSortGame() {
  const [diff, setDiff] = useState<Difficulty>("easy");
  const [bars, setBars] = useState<number[]>([]);
  const [original, setOriginal] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [swaps, setSwaps] = useState(0);
  const [won, setWon] = useState(false);
  const [history, setHistory] = useState<number[][]>([]);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const hasAwardedRef = useRef(false);
  const { awardPoints, popupPoints, showPopup, closePopup } = useGamePoints("sort");

  const par = LEVELS[diff].par;

  const startGame = useCallback((d: Difficulty) => {
    const puzzle = generatePuzzle(d);
    setBars(puzzle);
    setOriginal(puzzle);
    setSelected(null);
    setSwaps(0);
    setWon(false);
    setHistory([]);
    setDiff(d);
    setTimer(0);
    hasAwardedRef.current = false;
    setTimerActive(true);
  }, []);

  useEffect(() => { Promise.resolve().then(() => startGame("easy")); }, [startGame]);

  useEffect(() => {
    if (!timerActive) return;
    const id = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [timerActive]);

  useEffect(() => {
    if (hasAwardedRef.current || won || bars.length === 0) return;
    
    if (isSorted(bars) && swaps > 0) {
      hasAwardedRef.current = true;
      Promise.resolve().then(() => {
        setWon(true);
        setTimerActive(false);
      });
      const pts = calculateSortPts(diff, swaps, par);
      awardPoints(pts, { diff, swaps, par, score: pts, timeTaken: timer });
    }
  }, [bars, diff, par, swaps, won, awardPoints, timer]);

  const handleBarClick = useCallback((idx: number) => {
    if (won) return;
    if (selected === null) { setSelected(idx); return; }
    if (selected === idx) { setSelected(null); return; }
    if (Math.abs(selected - idx) !== 1) { setSelected(idx); return; }

    setHistory((h) => [...h, [...bars]]);
    const next = [...bars];
    [next[selected], next[idx]] = [next[idx], next[selected]];
    setBars(next);
    setSwaps((s) => s + 1);
    setSelected(null);
  }, [selected, bars, won]);

  const undo = useCallback(() => {
    if (!history.length || won) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setBars(prev);
    setSwaps((s) => Math.max(0, s - 1));
    setSelected(null);
  }, [history, won]);

  const reset = useCallback(() => {
    setBars(original);
    setSelected(null);
    setSwaps(0);
    setWon(false);
    setHistory([]);
    setTimer(0);
    setTimerActive(true);
  }, [original]);

  return {
    diff, bars, selected, swaps, won, history,
    timer, par, startGame, handleBarClick, undo, reset,
    popupPoints, showPopup, closePopup,
  };
}