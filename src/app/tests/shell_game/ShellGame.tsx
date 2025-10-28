'use client';

import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNextChallenge } from '@/hooks/useNextChallenge';
import { useShellGame, Circle } from '@/hooks/useShellGame';
import { TbReload } from 'react-icons/tb';
import { FiShare2, FiCheckCircle, FiAward, FiEye, FiArrowRight } from 'react-icons/fi';
import clsx from 'clsx';

function ShellGame() {
  const {
    status,
    round,
    ROUNDS,
    score,
    circles,
    selection,
    shuffleSpeed,
    startGame,
    handleCircleClick,
  } = useShellGame();

  const [shareText, setShareText] = useState('Share my score');
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const nextTest = useNextChallenge();

  useEffect(() => {
    if (status !== 'idle' && status !== 'result' && gameAreaRef.current) {
      gameAreaRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [status]);

  const handleShare = async () => {
    const text = `I scored ${score}/${ROUNDS} in the EyeChallenge Circle Tracking game! Can you beat my score? 👀`;
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: 'EyeChallenge - Circle Tracking', text, url });
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setShareText('Copied!');
      setTimeout(() => setShareText('Share my score'), 2000);
    }
  };

  const getFeedback = (finalScore: number) => {
    if (finalScore === ROUNDS) return { title: 'Perfect!', message: 'Your tracking skills are flawless!', icon: FiAward, className: 'alert-success' };
    if (finalScore >= ROUNDS * 0.7) return { title: 'Excellent!', message: 'You have sharp visual tracking.', icon: FiCheckCircle, className: 'alert-info' };
    return { title: 'Good Effort!', message: 'Practice makes perfect. Keep it up!', icon: FiEye, className: 'alert-warning' };
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'highlighting': return 'Memorize the green circle!';
      case 'shuffling': return 'Follow the circle...';
      case 'selecting': return 'Which circle was green?';
      default: return 'Test Complete!';
    }
  };

  const isGameOver = (status === 'result' && round >= ROUNDS) || (status === 'idle' && round >= ROUNDS);

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
      {/* Stats Header */}
      <div className="w-full mt-10 md:mt-12 max-w-4xl">
        <div className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap">
          <div className="text-center flex flex-col"><span className="text-slate-500 dark:text-slate-400 text-sm font-medium">ROUND</span><span className="text-4xl font-bold leading-normal">{round} / {ROUNDS}</span></div>
          <div className="w-px h-16 bg-slate-500 dark:bg-slate-400 hidden sm:block"></div>
          <div className="text-center flex flex-col"><span className="text-slate-500 dark:text-slate-400 text-sm font-medium">SCORE</span><span className="text-4xl font-bold leading-normal">{score}</span></div>
        </div>
        <div role="alert" className="alert alert-info flex justify-center mt-4 md:mt-6 w-fit m-auto">
          <FiEye />
          <span className="font-semibold">{getStatusMessage()}</span>
        </div>
      </div>

      {/* Game Arena */}
      <div className="relative w-full max-w-3xl h-48 my-10 md:my-12 flex items-center justify-center">
        {circles.map((circle, index) => (
          <div
            key={circle.id}
            onClick={() => handleCircleClick(index)}
            className={clsx(
              'absolute w-20 h-20 rounded-full border-4 border-transparent',
              {
                'bg-green-500': status === 'highlighting' && circle.isTarget,
                'bg-primary': status !== 'highlighting',
                'cursor-pointer hover:scale-110': status === 'selecting',
                'cursor-wait': status !== 'selecting',
                // Feedback state borders
                'border-green-500': status === 'feedback' && circle.isTarget,
                'border-red-500': status === 'feedback' && !circle.isTarget && selection?.index === index,
              }
            )}
            style={{
              transition: `transform ${shuffleSpeed}ms ease-in-out, background-color 300ms`,
              transform: `translateX(${circle.x}px) translateY(${circle.y}px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default ShellGame;
