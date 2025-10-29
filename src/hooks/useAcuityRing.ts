'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

export type GapDirection = 'up' | 'down' | 'left' | 'right' | 'up-right' | 'down-right' | 'down-left' | 'up-left';

const DIRECTIONS_4: GapDirection[] = ['up', 'down', 'left', 'right'];
const DIRECTIONS_8: GapDirection[] = ['up', 'down', 'left', 'right', 'up-right', 'down-right', 'down-left', 'up-left'];

const MAX_LEVEL = 20;
const LEVEL_DURATION = 5; // 5 seconds per level
const INITIAL_SIZE = 40;
const MIN_SIZE = 10;

const successSound = typeof window !== 'undefined' ? new Audio('/true.mp3') : null;
const failSound = typeof window !== 'undefined' ? new Audio('/false.mp3') : null;

export function useAcuityRing() {
  const [status, setStatus] = useState('idle'); // idle, playing, result
  const [level, setLevel] = useState(1);
  const [ringSize, setRingSize] = useState(INITIAL_SIZE);
  const [gapDirection, setGapDirection] = useState<GapDirection>('up');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [inputDivisions, setInputDivisions] = useState<4 | 8>(4);
  const [timeLeft, setTimeLeft] = useState(LEVEL_DURATION);
  const [bestScore, setBestScore] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const storedBestScore = localStorage.getItem('acuityBestScore');
    if (storedBestScore) {
      setBestScore(parseInt(storedBestScore, 10));
    }
  }, []);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const nextLevel = useCallback((currentLevel: number) => {
    stopTimer();
    setFeedback(null);
    setTimeLeft(LEVEL_DURATION);
    const newLevel = currentLevel + 1;
    setLevel(newLevel);

    const newDivisions = newLevel >= 5 ? 8 : 4;
    setInputDivisions(newDivisions);

    const progress = Math.max(0, (newLevel - 1) / MAX_LEVEL);
    const nextSize = INITIAL_SIZE * Math.pow(1 - progress, 2.5) + MIN_SIZE;
    setRingSize(Math.max(nextSize, MIN_SIZE));

    const availableDirections = newDivisions === 4 ? DIRECTIONS_4 : DIRECTIONS_8;
    const randomDirection = availableDirections[Math.floor(Math.random() * availableDirections.length)];
    setGapDirection(randomDirection);
  }, []);

  useEffect(() => {
    if (status === 'playing' && level > bestScore) {
      setBestScore(level);
    }
  }, [level, bestScore, status]);

  const endGame = useCallback(() => {
    stopTimer();
    setStatus('result');
    const finalScore = level - 1;
    if (finalScore > bestScore) {
      setBestScore(finalScore);
      localStorage.setItem('acuityBestScore', finalScore.toString());
    }
  }, [level, bestScore]);

  const handleAnswer = useCallback((answer: GapDirection) => {
    if (status !== 'playing') return;

    if (answer === gapDirection) {
      successSound?.play();
      setFeedback('correct');
      if (level < MAX_LEVEL) {
        setTimeout(() => nextLevel(level), 500);
      } else {
        endGame();
      }
    } else {
      failSound?.play();
      setFeedback('incorrect');
      setTimeout(endGame, 500);
    }
  }, [status, level, gapDirection, nextLevel, endGame]);

  useEffect(() => {
    if (status === 'playing' && feedback === null) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            stopTimer();
            failSound?.play();
            setFeedback('incorrect');
            setTimeout(endGame, 500);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return stopTimer;
  }, [status, feedback, endGame]);

  const startGame = useCallback(() => {
    setStatus('playing');
    setLevel(1);
    setRingSize(INITIAL_SIZE);
    setInputDivisions(4);
    const randomDirection = DIRECTIONS_4[Math.floor(Math.random() * DIRECTIONS_4.length)];
    setGapDirection(randomDirection);
    setFeedback(null);
    setTimeLeft(LEVEL_DURATION);
  }, []);

  return {
    status,
    level,
    MAX_LEVEL,
    ringSize,
    gapDirection,
    feedback,
    inputDivisions,
    timeLeft,
    bestScore,
    startGame,
    handleAnswer,
  };
}
