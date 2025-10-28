"use client";

import { useState, useCallback, useEffect, useRef } from "react";

type GameStatus = "idle" | "playing" | "result";

const ROUNDS = 10;
const ROUND_DURATION = 10; // 10 seconds per round
const INITIAL_CIRCLES = 2;
const MAX_CIRCLES = 9;
const INITIAL_SIZE_INCREMENT = 12; // in pixels

const successSound = typeof window !== "undefined" ? new Audio("/true.mp3") : null;
const failSound = typeof window !== "undefined" ? new Audio("/false.mp3") : null;

// Difficulty is now based on score, not round
const getNumberOfCirclesForScore = (score: number): number => {
  if (score < 2) return 2; // Score 0-1
  if (score < 5) return 4; // Score 2-4
  if (score < 8) return 6; // Score 5-7
  return 9; // Score 8-9
};

export function usePrecisionPerception() {
  const [status, setStatus] = useState<GameStatus>("idle");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(ROUND_DURATION);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Difficulty states
  const [numberOfCircles, setNumberOfCircles] = useState(INITIAL_CIRCLES);
  const [sizeIncrement, setSizeIncrement] = useState(INITIAL_SIZE_INCREMENT);
  const [correctCircleIndex, setCorrectCircleIndex] = useState(0);

  const generateNewRound = useCallback((currentScore: number) => {
    const newNumberOfCircles = getNumberOfCirclesForScore(currentScore);
    const newSizeIncrement = Math.max(INITIAL_SIZE_INCREMENT - currentScore, 1);

    setNumberOfCircles(newNumberOfCircles);
    setSizeIncrement(newSizeIncrement);
    setCorrectCircleIndex(Math.floor(Math.random() * newNumberOfCircles));
    setTimeRemaining(ROUND_DURATION);
  }, []);

  const handleCircleClick = useCallback(
    (clickedIndex: number) => {
      if (status !== "playing") return;

      const isCorrect = clickedIndex === correctCircleIndex;
      const scoreForNextDifficulty = isCorrect ? score + 1 : score;

      if (isCorrect) {
        setScore((s) => s + 1);
        successSound?.play();
      } else {
        failSound?.play();
      }

      const nextRound = round + 1;
      if (nextRound < ROUNDS) {
        setRound(nextRound);
        generateNewRound(scoreForNextDifficulty);
      } else {
        setStatus("result");
      }
    },
    [round, score, correctCircleIndex, generateNewRound, status]
  );

  useEffect(() => {
    if (status === "playing") {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleCircleClick(-1); // Auto-fail if time runs out
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
  }, [status, handleCircleClick]);

  const startGame = useCallback(() => {
    setScore(0);
    setRound(0);
    setStatus("playing");
    generateNewRound(0);
  }, [generateNewRound]);

  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  const goToIdle = useCallback(() => {
    setStatus("idle");
  }, []);

  return {
    status,
    round,
    ROUNDS,
    score,
    timeRemaining,
    ROUND_DURATION,
    numberOfCircles,
    sizeIncrement,
    correctCircleIndex,
    startGame,
    handleCircleClick,
    restartGame,
    goToIdle,
  };
}
