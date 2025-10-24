
import { useState, useEffect, useRef } from "react";

export const LEVEL_DURATION = 30; // 30 seconds per level

export type GameStatus = "idle" | "playing" | "gameOver";

export const useColorTest = () => {
  const [status, setStatus] = useState<GameStatus>("idle");
  const [level, setLevel] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(LEVEL_DURATION);
  const [bestScore, setBestScore] = useState(0);
  const [clickFeedback, setClickFeedback] = useState<{
    index: number;
    correct: boolean;
  } | null>(null);

  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const incorrectSoundRef = useRef<HTMLAudioElement | null>(null);

  // Load sounds on mount (client-side only)
  useEffect(() => {
    correctSoundRef.current = new Audio("/true.mp3");
    incorrectSoundRef.current = new Audio("/false.mp3");
  }, []);

  // Load best score from localStorage on mount
  useEffect(() => {
    const savedBestScore = localStorage.getItem("colorTestBestScore");
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore, 10));
    }
  }, []);

  useEffect(() => {
    if (status !== "playing") return;

    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime === 1) {
          setStatus("gameOver");
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status]);

  const generateColors = (level: number) => {
    const colors = [];
    let numColors;
    if (level <= 3) {
      numColors = 4; // 2x2 grid
    } else if (level <= 7) {
      numColors = 9; // 3x3 grid
    } else {
      numColors = 16; // 4x4 grid
    }

    const baseColor = [
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
    ];
    const darkerColorIndex = Math.floor(Math.random() * numColors);

    const difficultyFactor = 30 - level * 2; // Adjust difficulty

    for (let i = 0; i < numColors; i++) {
      if (i === darkerColorIndex) {
        const darkerColor = baseColor.map((c) =>
          Math.max(0, c - difficultyFactor)
        );
        colors.push(`rgb(${darkerColor.join(",")})`);
      } else {
        colors.push(`rgb(${baseColor.join(",")})`);
      }
    }
    return { colors, darkerColorIndex };
  };

  const [{ colors, darkerColorIndex }, setGameData] = useState(
    generateColors(level)
  );

  const startGame = () => {
    setStatus("playing");
  };

  const handleColorClick = (index: number) => {
    if (status !== "playing" || clickFeedback) return;

    const isCorrect = index === darkerColorIndex;
    setClickFeedback({ index, correct: isCorrect });

    if (isCorrect) {
      correctSoundRef.current?.play();
      // Add time bonus
      setTimeRemaining((prevTime) => Math.min(prevTime + 2, LEVEL_DURATION));

      setTimeout(() => {
        const nextLevel = level + 1;
        setLevel(nextLevel);
        setGameData(generateColors(nextLevel));
        setClickFeedback(null);
      }, 500);
    } else {
      incorrectSoundRef.current?.play();
      setTimeout(() => {
        setClickFeedback(null);
      }, 500);
    }
  };

  const restartGame = () => {
    setStatus("playing");
    setLevel(1);
    setTimeRemaining(LEVEL_DURATION);
    setGameData(generateColors(1));
    setClickFeedback(null);
  };

  // Save best score to localStorage
  useEffect(() => {
    if (level - 1 > bestScore) {
      const newBestScore = level - 1;
      setBestScore(newBestScore);
      localStorage.setItem("colorTestBestScore", newBestScore.toString());
    }
  }, [level, bestScore]);

  return {
    status,
    level,
    timeRemaining,
    bestScore,
    colors,
    clickFeedback,
    startGame,
    handleColorClick,
    restartGame,
  };
};
