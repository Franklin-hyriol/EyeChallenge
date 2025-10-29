'use client';

import { useState, useCallback, useEffect } from 'react';
import { type ShapeType } from '@/app/tests/visual_memory/Shape';

const ALL_SHAPES: ShapeType[] = ['circle', 'square', 'triangle', 'star', 'diamond', 'hexagon'];
const MEMORIZE_TIME = 1500;
const RECALL_TIME = 5;
const MAX_LEVEL = 15;
const GRID_SIZE = 4;

const successSound = typeof window !== 'undefined' ? new Audio('/true.mp3') : null;
const failSound = typeof window !== 'undefined' ? new Audio('/false.mp3') : null;

function getRandomUniqueItems<T>(array: T[], count: number): T[] {
  const available = [...array];
  const result: T[] = [];
  while (result.length < count && available.length > 0) {
    const index = Math.floor(Math.random() * available.length);
    result.push(available.splice(index, 1)[0]);
  }
  return result;
}

export function useVisualMemory() {
  const [status, setStatus] = useState<'idle' | 'memorize' | 'recall' | 'result'>('idle');
  const [level, setLevel] = useState(1);
  const [targetShape, setTargetShape] = useState<ShapeType | null>(null);
  const [gridShapes, setGridShapes] = useState<ShapeType[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [bestScore, setBestScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(RECALL_TIME);

  useEffect(() => {
    const storedBestScore = localStorage.getItem('visualMemoryBestScore');
    if (storedBestScore) setBestScore(parseInt(storedBestScore, 10));
  }, []);

  const endGame = useCallback(() => {
    setStatus('result');
    if (level - 1 > bestScore) {
      const newBest = level - 1;
      setBestScore(newBest);
      localStorage.setItem('visualMemoryBestScore', newBest.toString());
    }
  }, [level, bestScore]);

  const startLevel = useCallback((currentLevel: number) => {
    setFeedback(null);
    setTimeLeft(RECALL_TIME);

    const [newTarget] = getRandomUniqueItems(ALL_SHAPES, 1);
    setTargetShape(newTarget);

    const otherShapes = ALL_SHAPES.filter(shape => shape !== newTarget);
    const lures = getRandomUniqueItems(otherShapes, GRID_SIZE - 1);
    const finalGrid = [...lures, newTarget].sort(() => Math.random() - 0.5);
    setGridShapes(finalGrid);

    setStatus('memorize');
  }, []);

  const handleShapeClick = (shape: ShapeType) => {
    if (status !== 'recall') return;

    const isCorrect = shape === targetShape;
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      successSound?.play();
      const newLevel = level + 1;
      if (newLevel > bestScore) setBestScore(newLevel);

      if (newLevel <= MAX_LEVEL) {
        setTimeout(() => {
          setLevel(newLevel);
          setTimeout(() => startLevel(newLevel), 200); // 👈 sécurité visuelle
        }, 1000);
      } else {
        setTimeout(endGame, 1000);
      }
    } else {
      failSound?.play();
      setTimeout(endGame, 1000);
    }
  };

  useEffect(() => {
    if (status === 'memorize') {
      const timer = setTimeout(() => {
        if (targetShape) setStatus('recall');
      }, MEMORIZE_TIME);
      return () => clearTimeout(timer);
    }

    if (status === 'recall') {
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            failSound?.play();
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status, targetShape, endGame]);

  const startGame = () => {
    setLevel(1);
    startLevel(1);
  };

  return {
    status,
    level,
    MAX_LEVEL,
    targetShape,
    gridShapes,
    feedback,
    bestScore,
    timeLeft,
    startGame,
    handleShapeClick,
  };
}
