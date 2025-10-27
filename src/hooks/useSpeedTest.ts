"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type GameStatus = "idle" | "waiting" | "clicking" | "result";

const successSound = typeof window !== "undefined" ? new Audio("/true.mp3") : null;
const failSound = typeof window !== "undefined" ? new Audio("/false.mp3") : null;

export function useSpeedTest() {
  const [status, setStatus] = useState<GameStatus>("idle");
  const [results, setResults] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [earlyClickMessage, setEarlyClickMessage] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const storedBestTime = localStorage.getItem("speedTestBestTime");
    if (storedBestTime) {
      setBestTime(JSON.parse(storedBestTime));
    }

    // Clear timer on component unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const prepareNextRound = useCallback(() => {
    setStatus("waiting");

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const delay = Math.random() * 4000 + 1000; // 1-5 seconds delay
    timerRef.current = setTimeout(() => {
      setStatus("clicking");
      setStartTime(Date.now());
    }, delay);
  }, []);

  const startGame = useCallback(() => {
    setResults([]);
    setEarlyClickMessage("");
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    prepareNextRound();
  }, [prepareNextRound]);

  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  const goToIdle = useCallback(() => {
    setStatus("idle");
    setResults([]);
    setEarlyClickMessage("");
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  const handleTargetClick = useCallback(() => {
    if (status === "clicking") {
      successSound?.play();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setEarlyClickMessage(""); // Clear message on success
      const endTime = Date.now();
      const reactionTime = endTime - startTime;

      // Check for new best time
      if (bestTime === null || reactionTime < bestTime) {
        setBestTime(reactionTime);
        localStorage.setItem("speedTestBestTime", JSON.stringify(reactionTime));
      }

      const newResults = [...results, reactionTime];
      setResults(newResults);

      if (newResults.length < 5) {
        prepareNextRound();
      } else {
        setStatus("result");
      }
    } else if (status === "waiting") {
      failSound?.play();
      setEarlyClickMessage("The circle stays red if you spam clicks!");
      // Reset the timer process to penalize spamming
      prepareNextRound();
    }
  }, [status, startTime, results, bestTime, prepareNextRound]);



  return {
    status,
    results,
    bestTime,
    earlyClickMessage,
    startGame,
    restartGame,
    goToIdle,
    handleTargetClick,
  };
}