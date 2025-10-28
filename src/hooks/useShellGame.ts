'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

// --- Types and Constants ---
type GameStatus = 'idle' | 'highlighting' | 'shuffling' | 'selecting' | 'feedback' | 'result';

// Explicit type for a circle object
export type Circle = {
  id: number;
  x: number;
  y: number;
  isTarget: boolean;
};

// Explicit type for the hook's return value
export interface UseShellGameReturn {
  status: GameStatus;
  round: number;
  ROUNDS: number;
  score: number;
  circles: Circle[];
  selection: { index: number; correct: boolean } | null;
  shuffleSpeed: number;
  timeLeft: number;
  startGame: () => void;
  handleCircleClick: (clickedIndex: number) => void;
}

const ROUNDS_PER_GAME = 5;
const SELECTION_TIME = 5; // seconds
const INITIAL_CIRCLES = 3;
const MAX_CIRCLES = 7; // Maximum number of circles
const INITIAL_SHUFFLE_MOVES = 2; // Start with fewer moves
const INITIAL_SHUFFLE_SPEED = 750; // Start slower

const successSound = typeof window !== 'undefined' ? new Audio('/true.mp3') : null;
const failSound = typeof window !== 'undefined' ? new Audio('/false.mp3') : null;

// --- Hook --- 
export function useShellGame(): UseShellGameReturn {
  const [status, setStatus] = useState<GameStatus>('idle');
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [selection, setSelection] = useState<{ index: number; correct: boolean } | null>(null);
  const [timeLeft, setTimeLeft] = useState(SELECTION_TIME);

  // --- Refs ---
  const numCirclesRef = useRef(INITIAL_CIRCLES);
  const shuffleSpeedRef = useRef(INITIAL_SHUFFLE_SPEED);
  const numMovesRef = useRef(INITIAL_SHUFFLE_MOVES);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // --- Game Flow Callbacks ---
  const startRound = useCallback(() => {
    setSelection(null);
    setRound((r) => r + 1);

    const currentNumCircles = numCirclesRef.current;
    const targetIndex = Math.floor(Math.random() * currentNumCircles);

    const newCircles = Array.from({ length: currentNumCircles }, (_, i) => ({
      id: i,
      x: (i - (currentNumCircles - 1) / 2) * 120,
      y: 0,
      isTarget: i === targetIndex,
    }));

    setCircles(newCircles);
    setStatus('highlighting');
  }, []);

  const shuffleCircles = useCallback(async () => {
    setStatus('shuffling');
    let tempCircles = [...circles];
    const moveDuration = shuffleSpeedRef.current / 3;

    for (let i = 0; i < numMovesRef.current; i++) {
      // Pick two different circles to swap
      const idx1 = Math.floor(Math.random() * tempCircles.length);
      let idx2 = Math.floor(Math.random() * tempCircles.length);
      while (idx1 === idx2) {
        idx2 = Math.floor(Math.random() * tempCircles.length);
      }

      const circle1 = tempCircles[idx1];
      const circle2 = tempCircles[idx2];

      // --- 3-Step Animation ---
      const yOffset = 60; // How far apart they move vertically

      // 1. Move apart vertically
      circle1.y -= yOffset;
      circle2.y += yOffset;
      setCircles([...tempCircles]);
      await new Promise((resolve) => setTimeout(resolve, moveDuration));

      // 2. Cross over horizontally
      const x1 = circle1.x;
      circle1.x = circle2.x;
      circle2.x = x1;
      setCircles([...tempCircles]);
      await new Promise((resolve) => setTimeout(resolve, moveDuration));

      // 3. Move back into the horizontal line
      circle1.y += yOffset;
      circle2.y -= yOffset;
      setCircles([...tempCircles]);
      await new Promise((resolve) => setTimeout(resolve, moveDuration));
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
    setStatus('selecting');
  }, [circles]);

  const handleTimeout = useCallback(() => {
    failSound?.play();
    setSelection({ index: -1, correct: false }); // -1 indicates a timeout
    setStatus('feedback');

    setTimeout(() => {
      if (round >= ROUNDS_PER_GAME) {
        setStatus('result');
      } else {
        startRound();
      }
    }, 1500);
  }, [round, startRound]);

  const handleCircleClick = (clickedIndex: number) => {
    if (status !== 'selecting') return;
    if (timerRef.current) clearInterval(timerRef.current);

    const isCorrect = circles[clickedIndex].isTarget;
    setSelection({ index: clickedIndex, correct: isCorrect });

    if (isCorrect) {
      successSound?.play();
      setScore((s) => s + 1);
      if (numCirclesRef.current < MAX_CIRCLES && round % 2 !== 0) numCirclesRef.current++;
      if (shuffleSpeedRef.current > 200) shuffleSpeedRef.current -= 25;
      if (numMovesRef.current < 10) numMovesRef.current++;
    } else {
      failSound?.play();
    }

    setStatus('feedback');

    setTimeout(() => {
      if (round >= ROUNDS_PER_GAME) {
        setStatus('result');
      } else {
        startRound();
      }
    }, 1500);
  };

  const startGame = useCallback(() => {
    setRound(0);
    setScore(0);
    numCirclesRef.current = INITIAL_CIRCLES;
    shuffleSpeedRef.current = INITIAL_SHUFFLE_SPEED;
    numMovesRef.current = 3;
    startRound();
  }, [startRound]);

  // --- useEffect for state transitions ---
  useEffect(() => {
    if (status === 'highlighting') {
      const timer = setTimeout(() => {
        shuffleCircles();
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (status === 'selecting') {
      setTimeLeft(SELECTION_TIME);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current) };
    }

  }, [status, shuffleCircles]);

  useEffect(() => {
    if (timeLeft === 0 && status === 'selecting') {
      if (timerRef.current) clearInterval(timerRef.current);
      handleTimeout();
    }
  }, [timeLeft, status, handleTimeout]);

  useEffect(() => {
    if (round > ROUNDS_PER_GAME) {
        setStatus('result');
    }
  }, [round]);

  return {
    status,
    round,
    ROUNDS: ROUNDS_PER_GAME,
    score,
    circles,
    selection,
    shuffleSpeed: shuffleSpeedRef.current,
    timeLeft,
    startGame,
    handleCircleClick,
  };
}