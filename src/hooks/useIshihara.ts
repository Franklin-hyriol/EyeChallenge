"use client";

import { useState, useCallback, useEffect, useRef } from "react";

type GameStatus = "idle" | "playing" | "result";
const ROUNDS = 5;
const ROUND_DURATION = 15; // 15 seconds per plate

export function useIshihara() {
  const [status, setStatus] = useState<GameStatus>("idle");
  const [round, setRound] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [currentNumber, setCurrentNumber] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(ROUND_DURATION);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateNewNumber = useCallback(() => {
    const newNumber = Math.floor(Math.random() * 100);
    setCurrentNumber(newNumber);
  }, []);

  const nextRound = useCallback(() => {
    if (round + 1 < ROUNDS) {
      setRound(round + 1);
      generateNewNumber();
      setTimeRemaining(ROUND_DURATION);
    } else {
      setStatus("result");
    }
  }, [round, generateNewNumber]);

  const submitAnswer = useCallback((answer: string) => {
    const isCorrect = answer === currentNumber.toString();
    const newHistory = [...history, { number: currentNumber, answer, isCorrect }];
    setHistory(newHistory);
    nextRound();
  }, [currentNumber, history, nextRound]);

  useEffect(() => {
    if (status === "playing") {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            submitAnswer("-"); // Auto-submit as incorrect if time runs out
            return ROUND_DURATION;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, submitAnswer]);

  const startGame = useCallback(() => {
    setHistory([]);
    setRound(0);
    generateNewNumber();
    setTimeRemaining(ROUND_DURATION);
    setStatus("playing");
  }, [generateNewNumber]);

  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  const goToIdle = useCallback(() => {
    setStatus("idle");
  }, []);

  const correctAnswers = history.filter((h) => h.isCorrect).length;

  return {
    status,
    round,
    ROUNDS,
    history,
    currentNumber,
    timeRemaining,
    ROUND_DURATION,
    correctAnswers,
    startGame,
    submitAnswer,
    restartGame,
    goToIdle,
  };
}
