'use client';

import { useState, useCallback } from 'react';

export type GapDirection = 'up' | 'down' | 'left' | 'right' | 'up-right' | 'down-right' | 'down-left' | 'up-left';

const DIRECTIONS_4: GapDirection[] = ['up', 'down', 'left', 'right'];
const DIRECTIONS_8: GapDirection[] = ['up', 'down', 'left', 'right', 'up-right', 'down-right', 'down-left', 'up-left'];

const MAX_LEVEL = 20;
const INITIAL_SIZE = 40; // Starting size of the ring in pixels
const MIN_SIZE = 10; // Minimum size

const successSound = typeof window !== 'undefined' ? new Audio('/true.mp3') : null;
const failSound = typeof window !== 'undefined' ? new Audio('/false.mp3') : null;

export function useAcuityRing() {
  const [status, setStatus] = useState('idle'); // idle, playing, result
  const [level, setLevel] = useState(1);
  const [ringSize, setRingSize] = useState(INITIAL_SIZE);
  const [gapDirection, setGapDirection] = useState<GapDirection>('up');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [inputDivisions, setInputDivisions] = useState<4 | 8>(4);

  const nextLevel = useCallback((currentLevel: number) => {
    setFeedback(null);
    const newLevel = currentLevel + 1;
    setLevel(newLevel);

    // Increase divisions at level 5
    const newDivisions = newLevel >= 5 ? 8 : 4;
    setInputDivisions(newDivisions);

    // Decrease size exponentially
    const progress = Math.max(0, (newLevel - 1) / MAX_LEVEL);
    const nextSize = INITIAL_SIZE * Math.pow(1 - progress, 2.5) + MIN_SIZE;
    setRingSize(Math.max(nextSize, MIN_SIZE));

    // Set a new random direction based on current division count
    const availableDirections = newDivisions === 4 ? DIRECTIONS_4 : DIRECTIONS_8;
    const randomDirection = availableDirections[Math.floor(Math.random() * availableDirections.length)];
    setGapDirection(randomDirection);
  }, []);

  const startGame = useCallback(() => {
    setStatus('playing');
    setLevel(1);
    setRingSize(INITIAL_SIZE);
    setInputDivisions(4);
    const randomDirection = DIRECTIONS_4[Math.floor(Math.random() * DIRECTIONS_4.length)];
    setGapDirection(randomDirection);
    setFeedback(null);
  }, []);

  const handleAnswer = useCallback((answer: GapDirection) => {
    if (status !== 'playing') return;

    if (answer === gapDirection) {
      successSound?.play();
      setFeedback('correct');
      if (level < MAX_LEVEL) {
        setTimeout(() => nextLevel(level), 500);
      } else {
        setStatus('result');
      }
    } else {
      failSound?.play();
      setFeedback('incorrect');
      setTimeout(() => {
        setStatus('result');
      }, 500);
    }
  }, [status, level, gapDirection, nextLevel]);

  return {
    status,
    level,
    MAX_LEVEL,
    ringSize,
    gapDirection,
    feedback,
    inputDivisions,
    startGame,
    handleAnswer,
  };
}