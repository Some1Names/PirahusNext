import { useState, useEffect, useCallback, useRef } from "react";
import { Phase, Question } from "./types";
import { buildQuestionSet } from "./questions";
import { useGamePoints } from "@/src/hooks/useGamePoints";
import { calculateTracePts } from "@/src/lib/game/scoring";

export const INITIAL_TIME = 180;
export const MAX_QUESTIONS = 10;

export function useTraceGame() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [input, setInput] = useState("");
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [bonusFlash, setBonusFlash] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasAwardedRef = useRef(false);
  const { awardPoints, popupPoints, showPopup, closePopup } = useGamePoints("trace");

  const currentQ = questions[qIdx] ?? null;

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { stopTimer(); setPhase("gameover"); return 0; }
        return t - 1;
      });
    }, 1000);
  }, [stopTimer]);

  const startGame = useCallback(() => {
    setQuestions(buildQuestionSet());
    setQIdx(0);
    setTimeLeft(INITIAL_TIME);
    setScore(0);
    setStreak(0);
    setInput("");
    setSelectedChoice(null);
    setFeedback(null);
    setBonusFlash(null);
    hasAwardedRef.current = false;
    setPhase("playing");
  }, []);

  useEffect(() => {
    if (phase === "playing") startTimer();
    else stopTimer();
    return stopTimer;
  }, [phase, startTimer, stopTimer]);

  useEffect(() => {
    if (phase === "result" && !hasAwardedRef.current) {
      hasAwardedRef.current = true;
      const pts = calculateTracePts(score, timeLeft);
      awardPoints(pts, { score, timeLeft });
    }
  }, [phase, score, timeLeft, awardPoints]);

  const advance = useCallback(() => {
    setFeedback(null);
    setInput("");
    setSelectedChoice(null);
    setBonusFlash(null);
    const next = qIdx + 1;
    if (next >= MAX_QUESTIONS || next >= questions.length) {
      setPhase("result");
    } else {
      setQIdx(next);
    }
  }, [qIdx, questions.length]);

  const submitAnswer = useCallback((answer: string) => {
    if (!currentQ || feedback) return;
    const correct = answer.trim() === currentQ.answer.trim();
    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
      setTimeLeft((t) => Math.min(t + currentQ.timeBonus, INITIAL_TIME));
      setBonusFlash(currentQ.timeBonus);
      setFeedback("correct");
    } else {
      setStreak(0);
      setFeedback("wrong");
    }
    setTimeout(advance, correct ? 1200 : 1800);
  }, [currentQ, feedback, advance]);

  const handleTypeSubmit = useCallback(() => {
    submitAnswer(input);
  }, [input, submitAnswer]);

  const handleChoiceClick = useCallback((choice: string) => {
    if (feedback) return;
    setSelectedChoice(choice);
    submitAnswer(choice);
  }, [feedback, submitAnswer]);

  return {
    phase, currentQ, qIdx, timeLeft, score, streak,
    input, setInput, selectedChoice, feedback, bonusFlash,
    startGame, handleTypeSubmit, handleChoiceClick,
    popupPoints, showPopup, closePopup,
  };
}