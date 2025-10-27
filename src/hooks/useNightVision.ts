"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type GameStatus = "idle" | "fading" | "result";

const FADE_DURATION = 15000; // 15 seconds to full opacity
const ROUNDS = 5;

const successSound = typeof window !== "undefined" ? new Audio("/true.mp3") : null;

export function useNightVision() {
  const [status, setStatus] = useState<GameStatus>("idle");
  const [results, setResults] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    const storedBestTime = localStorage.getItem("nightVisionBestTime");
    if (storedBestTime) {
      setBestTime(JSON.parse(storedBestTime));
    }
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, []);

  const startRound = useCallback(() => {
    setStatus("fading");
    setStartTime(Date.now());
  }, []);

  const startGame = useCallback(() => {
    setResults([]);
    startRound();
  }, [startRound]);

  const handleTargetClick = useCallback(() => {
    if (status !== "fading") return;

    successSound?.play();
    const reactionTime = Date.now() - startTime;

    if (bestTime === null || reactionTime < bestTime) {
      setBestTime(reactionTime);
      localStorage.setItem("nightVisionBestTime", JSON.stringify(reactionTime));
    }

    const newResults = [...results, reactionTime];
    setResults(newResults);

    if (newResults.length < ROUNDS) {
      startRound();
    } else {
      setStatus("result");
    }
  }, [status, startTime, results, bestTime, startRound]);

  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  const goToIdle = useCallback(() => {
    setStatus("idle");
    setResults([]);
  }, []);

  return {
    status,
    results,
    bestTime,
    FADE_DURATION,
    ROUNDS,
    startTime,
    startGame,
    restartGame,
    goToIdle,
    handleTargetClick,
    animationFrameRef,
  };
}
