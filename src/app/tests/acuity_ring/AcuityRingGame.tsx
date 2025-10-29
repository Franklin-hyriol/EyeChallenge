'use client';

import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNextChallenge } from '@/hooks/useNextChallenge';
import { useAcuityRing, GapDirection } from '@/hooks/useAcuityRing';
import AcuityRing from './AcuityRing';
import { TbReload } from 'react-icons/tb';
import { FiShare2, FiAward, FiEye, FiCheckCircle, FiXCircle, FiArrowRight as FiNext } from 'react-icons/fi';
import clsx from 'clsx';
import Progress from '@/components/Progress/Progress';

// Helper function to calculate the SVG path for a pie slice
function getPieSlicePath(cx: number, cy: number, radius: number, startAngle: number, endAngle: number): string {
  const start = {
    x: cx + radius * Math.cos((startAngle * Math.PI) / 180),
    y: cy + radius * Math.sin((startAngle * Math.PI) / 180),
  };
  const end = {
    x: cx + radius * Math.cos((endAngle * Math.PI) / 180),
    y: cy + radius * Math.sin((endAngle * Math.PI) / 180),
  };
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  const path = [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 1, end.x, end.y,
    'L', cx, cy,
    'Z',
  ].join(' ');
  return path;
}

const DIRECTIONS_MAP: GapDirection[] = [
  'up', 'up-right', 'right', 'down-right', 'down', 'down-left', 'left', 'up-left',
];

export default function AcuityRingGame() {
  const {
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
  } = useAcuityRing();

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const nextTest = useNextChallenge();

  useEffect(() => {
    if (status === 'playing' && gameAreaRef.current) {
      gameAreaRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [status]);

  const handleShare = async () => {
    const text = `I reached level ${level - 1} on the EyeChallenge Acuity Test! Can you beat my score? 👀`;
    // Sharing logic here...
  };

  if (status === 'idle') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center my-10 md:my-12">
        <button className="btn btn-lg btn-primary" onClick={startGame}>
          Start Test
        </button>
      </div>
    );
  }

  if (status === 'result') {
    const finalScore = level - 1;
    return (
      <>
        <div className="text-center my-10 md:my-12 max-w-md mx-auto">
          <h2 className="text-2xl font-bold">Test Complete!</h2>
          <p className="text-xl font-semibold mt-2 mb-4">You reached level {finalScore}</p>
          <div role="alert" className={clsx('alert', finalScore > 10 ? 'alert-success' : 'alert-info')}>
            {finalScore > 10 ? <FiAward /> : <FiEye />}
            <span>{finalScore > 10 ? 'Excellent vision!' : 'Good job! Keep practicing.'}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-8 justify-center flex-wrap">
          <button className="btn btn-lg btn-outline" onClick={handleShare}>
            <FiShare2 /> Share
          </button>
          <button className="btn btn-lg btn-primary" onClick={startGame}>
            <TbReload /> Play Again
          </button>
          <button className="btn btn-lg btn-secondary" onClick={() => router.push(`/${nextTest.link}`)}>
            Next Challenge <FiNext />
          </button>
        </div>
      </>
    );
  }

  const outerRadius = 150;
  const innerRadius = 70;
  const angleStep = 360 / inputDivisions;

  return (
    <div ref={gameAreaRef} className="w-full flex flex-col items-center pt-10">
      <Progress value={timeLeft} maxValue={5} />

      {/* Stats Header */}
      <div className="w-full mt-10 md:mt-12 max-w-4xl">
        <div className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap">
          <div className="text-center flex flex-col">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">LEVEL</span>
            <span className="text-4xl font-bold leading-normal">{level}</span>
          </div>
          <div className="w-px h-16 bg-slate-500 dark:bg-slate-400 hidden sm:block"></div>
          <div className="text-center flex flex-col">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">TIME LEFT</span>
            <span className={clsx('text-4xl font-bold leading-normal text-primary', { 'text-red-500 animate-pulse': timeLeft <= 2 })}>
              {timeLeft}s
            </span>
          </div>
          <div className="w-px h-16 bg-slate-500 dark:bg-slate-400 hidden sm:block"></div>
          <div className="text-center flex flex-col">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">BEST SCORE</span>
            <span className="text-4xl font-bold leading-normal">{bestScore}</span>
          </div>
        </div>
      </div>

      {/* Game Arena */}
      <div className="w-full flex flex-col items-center gap-8 my-10 md:my-12">
        {/* Top part: The target ring */}
        <div className="relative w-full min-h-[100px] flex items-center justify-center">
          <AcuityRing
            size={ringSize}
            gapDirection={gapDirection}
            divisions={inputDivisions}
            className={clsx({
              'text-green-500': feedback === 'correct',
              'text-red-500': feedback === 'incorrect',
              'text-base-content': feedback === null,
            })}
          />
          {feedback && (
            <div className={clsx('absolute inset-0 flex items-center justify-center', {
                'text-green-500': feedback === 'correct',
                'text-red-500': feedback === 'incorrect',
              })}>
              {feedback === 'correct' && <FiCheckCircle className="text-7xl" />}
              {feedback === 'incorrect' && <FiXCircle className="text-7xl" />}
            </div>
          )}
        </div>

        {/* Bottom part: The clickable segmented ring */}
        <div className="relative">
          <svg width={outerRadius * 2} height={outerRadius * 2} viewBox={`0 0 ${outerRadius * 2} ${outerRadius * 2}`}>
            <defs>
              <mask id="hole">
                <rect width="100%" height="100%" fill="white" />
                <circle cx={outerRadius} cy={outerRadius} r={innerRadius} fill="black" />
              </mask>
            </defs>
            <g mask="url(#hole)">
              {Array.from({ length: inputDivisions }).map((_, i) => {
                const startAngle = i * angleStep - angleStep / 2 - 90;
                const endAngle = (i + 1) * angleStep - angleStep / 2 - 90;
                const direction = DIRECTIONS_MAP[i * (8 / inputDivisions)];
                return (
                  <path
                    key={i}
                    d={getPieSlicePath(outerRadius, outerRadius, outerRadius, startAngle, endAngle)}
                    className="fill-base-content opacity-80 hover:opacity-100 cursor-pointer transition-opacity"
                    onClick={() => handleAnswer(direction)}
                  />
                );
              })}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}