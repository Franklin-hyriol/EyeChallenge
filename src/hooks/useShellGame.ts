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
  startGame: () => void;
  handleCircleClick: (clickedIndex: number) => void;
}


const ROUNDS_PER_GAME = 5;
const INITIAL_CIRCLES = 3;
const MAX_CIRCLES = 7; // Maximum number of circles
const INITIAL_SHUFFLE_MOVES = 2; // Start with fewer moves
const INITIAL_SHUFFLE_SPEED = 500; // Start slower

const successSound = typeof window !== 'undefined' ? new Audio('/true.mp3') : null;
const failSound = typeof window !== 'undefined' ? new Audio('/false.mp3') : null;

// --- Hook --- 
export function useShellGame(): UseShellGameReturn {
  const [status, setStatus] = useState<GameStatus>('idle');
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [selection, setSelection] = useState<{ index: number; correct: boolean } | null>(null);

  // --- Difficulty Refs ---
  const numCirclesRef = useRef(INITIAL_CIRCLES);
  const shuffleSpeedRef = useRef(INITIAL_SHUFFLE_SPEED);
  const numMovesRef = useRef(INITIAL_SHUFFLE_MOVES);

  // --- Game Flow Callbacks ---
  const startRound = useCallback(() => {
    setStatus('idle'); // Reset status before calculating new positions
    setSelection(null);
    setRound((r) => r + 1);

    const currentNumCircles = numCirclesRef.current;
    const targetIndex = Math.floor(Math.random() * currentNumCircles);

    // Position circles in a horizontal line
    const newCircles = Array.from({ length: currentNumCircles }, (_, i) => ({
      id: i,
      x: (i - (currentNumCircles - 1) / 2) * 120, // e.g., -120, 0, 120 for 3 circles
      y: 0,
      isTarget: i === targetIndex,
    }));

    setCircles(newCircles);
    setStatus('highlighting');
  }, [round, score]);

  const shuffleCircles = useCallback(async () => {
    setStatus('shuffling');
    let tempCircles = [...circles];

    for (let i = 0; i < numMovesRef.current; i++) {
      await new Promise((resolve) => setTimeout(resolve, shuffleSpeedRef.current + 100)); // Wait for animation

      // Pick two different circles to swap
      const idx1 = Math.floor(Math.random() * tempCircles.length);
      let idx2 = Math.floor(Math.random() * tempCircles.length);
      while (idx1 === idx2) {
        idx2 = Math.floor(Math.random() * tempCircles.length);
      }

      // Swap their positions
      const pos1 = { x: tempCircles[idx1].x, y: tempCircles[idx1].y };
      const pos2 = { x: tempCircles[idx2].x, y: tempCircles[idx2].y };
      tempCircles[idx1].x = pos2.x;
      tempCircles[idx1].y = pos2.y;
      tempCircles[idx2].x = pos1.x;
      tempCircles[idx2].y = pos1.y;

      setCircles([...tempCircles]);
    }

    await new Promise((resolve) => setTimeout(resolve, shuffleSpeedRef.current));
    setStatus('selecting');
  }, [circles]);

  const handleCircleClick = (clickedIndex: number) => {
    if (status !== 'selecting') return;

        const isCorrect = circles[clickedIndex].isTarget;

        setSelection({ index: clickedIndex, correct: isCorrect });

    

        if (isCorrect) {

          successSound?.play();

          setScore((s) => s + 1);

    

          // --- Difficulty Progression on Success ---

          if (numCirclesRef.current < MAX_CIRCLES && round % 2 !== 0) { // Add a circle every other round

            numCirclesRef.current++;

          }

          if (shuffleSpeedRef.current > 200) {

            shuffleSpeedRef.current -= 25; // Faster

          }

          if (numMovesRef.current < 10) {

            numMovesRef.current++; // More moves

          }

        } else {

          failSound?.play();
        }

    setStatus('feedback');

    setTimeout(() => {
      if (round >= ROUNDS_PER_GAME) {
        setStatus('result'); // Final result screen
      } else {
        startRound();
      }
    }, 1500);
  };

  const startGame = useCallback(() => {
    setRound(0);
    setScore(0);
    numCirclesRef.current = INITIAL_CIRCLES;
    shuffleSpeedRef.current = 400;
    numMovesRef.current = 3;
    startRound();
  }, [startRound]);

  // --- useEffect for state transitions ---
  useEffect(() => {
    if (status === 'highlighting') {
      const timer = setTimeout(() => {
        shuffleCircles();
      }, 1000); // Highlight for 1 second
      return () => clearTimeout(timer);
    }
  }, [status, shuffleCircles]);

  // This effect handles the end of the game
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
    startGame,
    handleCircleClick,
  };
}
