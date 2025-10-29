'use client';

import { ShapeType } from '@/app/tests/visual_memory/Shape';
import { useState, useCallback, useEffect, useRef } from 'react';

const ALL_SHAPES: ShapeType[] = ['circle', 'square', 'triangle', 'star', 'diamond', 'hexagon'];
const MEMORIZE_DURATION = 2; // seconds
const MAX_LEVEL = 10;

const successSound = typeof window !== 'undefined' ? new Audio('/true.mp3') : null;
const failSound = typeof window !== 'undefined' ? new Audio('/false.mp3') : null;

function getRandomSubset<T>(array: T[], size: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, size);
}

export function useVisualMemory() {
  const [status, setStatus] = useState('idle'); // idle, memorize, recall, result
  const [level, setLevel] = useState(1);
  const [shapesToMemorize, setShapesToMemorize] = useState<ShapeType[]>([]);
  const [gridShapes, setGridShapes] = useState<ShapeType[]>([]);
  const [userSelection, setUserSelection] = useState<ShapeType[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [bestScore, setBestScore] = useState(0);
  const [memorizeTimeLeft, setMemorizeTimeLeft] = useState(MEMORIZE_DURATION);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const storedBestScore = localStorage.getItem('visualMemoryBestScore');
    if (storedBestScore) setBestScore(parseInt(storedBestScore, 10));
  }, []);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startLevel = useCallback((currentLevel: number) => {
    setStatus('memorize');
    setUserSelection([]);
    setFeedback(null);
    setMemorizeTimeLeft(MEMORIZE_DURATION);

    const numTargets = Math.min(Math.floor(currentLevel / 2) + 1, ALL_SHAPES.length - 1); // Ensure numTargets leaves at least one non-target
    const gridSize = Math.min(numTargets * 2 + 2, ALL_SHAPES.length); // Grid size should not exceed total available shapes

    const targets = getRandomSubset(ALL_SHAPES, numTargets);
    setShapesToMemorize(targets);

    const nonTargets = ALL_SHAPES.filter(shape => !targets.includes(shape));
    const fillers = getRandomSubset(nonTargets, gridSize - numTargets);
    const finalGrid = [...targets, ...fillers].sort(() => 0.5 - Math.random());
    setGridShapes(finalGrid);
  }, []);

  useEffect(() => {
    if (status === 'memorize') {
      timerRef.current = setInterval(() => {
        setMemorizeTimeLeft(prev => prev - 1);
      }, 1000);
      return stopTimer;
    }
  }, [status]);

  useEffect(() => {
    if (memorizeTimeLeft === 0 && status === 'memorize') {
      stopTimer();
      setStatus('recall');
    }
  }, [memorizeTimeLeft, status]);

  const handleShapeClick = (shape: ShapeType) => {
    if (status !== 'recall' || userSelection.includes(shape)) return;

    const newSelection = [...userSelection, shape];
    setUserSelection(newSelection);

    if (newSelection.length === shapesToMemorize.length) {
      const isCorrect = shapesToMemorize.every(target => newSelection.includes(target));
      
      if (isCorrect) {
        successSound?.play();
        setFeedback('correct');
        const newLevel = level + 1;
        if (newLevel > bestScore) {
            setBestScore(newLevel);
            localStorage.setItem('visualMemoryBestScore', newLevel.toString());
        }
        if (newLevel <= MAX_LEVEL) {
          setTimeout(() => {
            setLevel(newLevel);
            startLevel(newLevel);
          }, 1000);
        } else {
          setStatus('result');
        }
      } else {
        failSound?.play();
        setFeedback('incorrect');
        setTimeout(() => setStatus('result'), 1000);
      }
    }
  };

  const startGame = () => {
    setLevel(1);
    startLevel(1);
  };

  return {
    status,
    level,
    MAX_LEVEL,
    shapesToMemorize,
    gridShapes,
    userSelection,
    feedback,
    bestScore,
    memorizeTimeLeft,
    startGame,
    handleShapeClick,
  };
}