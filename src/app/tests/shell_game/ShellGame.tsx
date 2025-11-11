'use client';

import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNextChallenge } from '@/hooks/useNextChallenge';
import { useShellGame, Circle } from '@/hooks/useShellGame';
import { TbReload } from 'react-icons/tb';
import { FiShare2, FiCheckCircle, FiAward, FiEye, FiArrowRight } from 'react-icons/fi';
import clsx from 'clsx';
import Progress from '@/components/Progress/Progress';
import { useShare } from '@/hooks/useShare';

const SELECTION_TIME = 5; // Must match the value in the hook

export default function ShellGame() {
  const {
    status,
    round,
    ROUNDS,
    score,
    circles,
    selection,
    shuffleSpeed,
    timeLeft,
    startGame,
    handleCircleClick,
  } = useShellGame();

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const nextTest = useNextChallenge();
  const { shareText, handleShare } = useShare(
    `I scored ${score}/${ROUNDS} in the EyeChallenge Circle Tracking game! Can you beat my score? 👀`,
    "EyeChallenge - Circle Tracking"
  );

  useEffect(() => {
    if (status !== 'idle' && status !== 'result' && gameAreaRef.current) {
      gameAreaRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [status]);

  const getFeedback = (finalScore: number) => {
    if (finalScore === ROUNDS) return { title: 'Perfect!', message: 'Your tracking skills are flawless!', icon: FiAward, className: 'alert-success' };
    if (finalScore >= ROUNDS * 0.7) return { title: 'Excellent!', message: 'You have sharp visual tracking.', icon: FiCheckCircle, className: 'alert-info' };
    return { title: 'Good Effort!', message: 'Practice makes perfect. Keep it up!', icon: FiEye, className: 'alert-warning' };
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'highlighting': return 'Memorize the green circle!';
      case 'shuffling': return 'Follow the circle...';
      case 'selecting':
      case 'feedback': // Show same message during feedback
        return 'Which circle was green?';
      default: return 'Test Complete!';
    }
  };

  // --- Render Logic ---
  if (status === 'idle' && round === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center my-10 md:my-12">
        <button className="btn btn-lg btn-primary" onClick={startGame}>
          Start Test
        </button>
      </div>
    );
  }

  const isGameOver = (status === 'result' && round >= ROUNDS) || (status === 'idle' && round >= ROUNDS);
  if (isGameOver) {
     const feedback = getFeedback(score);
     return (
       <>
         <div className="text-center my-10 md:my-12 max-w-md mx-auto">
           <h2 className="text-2xl font-bold">Test Complete!</h2>
           <p className="text-xl font-semibold mt-2 mb-4">You scored {score} / {ROUNDS}</p>
           <div role="alert" className={clsx('alert mb-4', feedback.className)}>
             <feedback.icon className="text-2xl" />
             <div>
               <h3 className="font-bold">{feedback.title}</h3>
               <div className="text-xs">{feedback.message}</div>
             </div>
           </div>
         </div>
         <div className="flex items-center gap-4 mt-8 justify-center flex-wrap">
           <button className="btn btn-lg btn-outline" onClick={handleShare}><FiShare2 /> {shareText}</button>
           <button className="btn btn-lg btn-primary" onClick={startGame}><TbReload /> Play Again</button>
           <button className="btn btn-lg btn-secondary" onClick={() => router.push(`/${nextTest.link}`)}>Next Challenge <FiArrowRight /></button>
         </div>
       </>
     );
  }

  return (
    <div ref={gameAreaRef} className="w-full flex flex-col items-center pt-10">
      <Progress value={timeLeft} maxValue={SELECTION_TIME} />

      {/* Stats Header */}
      <div className="w-full mt-10 md:mt-12 max-w-4xl">
        <div className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap">
          <div className="text-center flex flex-col"><span className="text-slate-500 dark:text-slate-400 text-sm font-medium">SCORE</span><span className="text-4xl font-bold leading-normal">{score}</span></div>
          <div className="w-px h-16 bg-slate-500 dark:bg-slate-400 hidden sm:block"></div>
          <div className="text-center flex flex-col">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">TIME LEFT</span>
            <span className={clsx("text-4xl font-bold leading-normal text-primary", { "text-red-500 animate-pulse": timeLeft <= 2 })}>{timeLeft}s</span>
          </div>
          <div className="w-px h-16 bg-slate-500 dark:bg-slate-400 hidden sm:block"></div>
          <div className="text-center flex flex-col"><span className="text-slate-500 dark:text-slate-400 text-sm font-medium">ROUND</span><span className="text-4xl font-bold leading-normal">{round} / {ROUNDS}</span></div>
        </div>
        <div role="alert" className={clsx('alert alert-info flex justify-center mt-4 md:mt-6 w-fit m-auto')}>
          <FiEye />
          <span className="font-semibold">{getStatusMessage()}</span>
        </div>
      </div>

      {/* Game Arena */}
      <div className="relative w-full max-w-3xl h-48 my-10 md:my-12 flex items-center justify-center">
        {circles.map((circle: Circle, index: number) => {
          const isHovered = hoveredIndex === index;
          const scale = isHovered && status === 'selecting' ? 1.1 : 1;

          return (
            <div
              key={circle.id}
              onClick={() => handleCircleClick(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={clsx(
                'absolute w-20 h-20 rounded-full transition-colors',
                {
                  'cursor-pointer': status === 'selecting',
                  'cursor-wait': status !== 'selecting',

                  // Highlighting or Feedback state for the correct circle
                  'bg-green-500': (status === 'highlighting' && circle.isTarget) || (status === 'feedback' && circle.isTarget),
                  'bg-red-500': status === 'feedback' && selection?.correct === false && selection.index === index,

                  // Default color
                  'bg-primary': status !== 'highlighting' && status !== 'feedback',
                  // Fade out non-selected, non-target circles during feedback
                  'opacity-50': status === 'feedback' && !circle.isTarget && selection?.index !== index,
                }
              )}
              style={{
                transition: `transform ${shuffleSpeed / 3}ms ease-in-out, background-color 300ms`,
                transform: `translateX(${circle.x}px) translateY(${circle.y}px) scale(${scale})`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}