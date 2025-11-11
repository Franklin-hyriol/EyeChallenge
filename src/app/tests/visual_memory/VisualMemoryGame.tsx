"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNextChallenge } from "@/hooks/useNextChallenge";
import { useVisualMemory } from "@/hooks/useVisualMemory";
import Shape, { ShapeType } from "./Shape";
import { TbReload } from "react-icons/tb";
import {
  FiShare2,
  FiAward,
  FiEye,
  FiArrowRight as FiNext,
} from "react-icons/fi";
import clsx from "clsx";
import Progress from "@/components/Progress/Progress";
import { useShare } from "@/hooks/useShare";

export default function VisualMemoryGame() {
  const {
    status,
    level,
    MAX_LEVEL,
    targetShapes,
    gridShapes,
    userSelection,
    feedback,
    bestScore,
    timeLeft,
    startGame,
    handleShapeClick,
  } = useVisualMemory();


  const gameAreaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const nextTest = useNextChallenge();
  const { shareText, handleShare } = useShare(
    `I reached level ${level - 1} on the Visual Memory Test! Can you beat my score? 👀`,
    "EyeChallenge - Visual Memory Test"
  );

  useEffect(() => {
    if (status !== "idle" && gameAreaRef.current) {
      gameAreaRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [status]);



  const getStatusMessage = () => {
    if (status === "memorize")
      return `Memorize ${targetShapes.length} shape(s)!`;
    if (status === "recall")
      return `Select the ${targetShapes.length} shape(s) you saw.`;
    return "";
  };

  if (status === "idle") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center my-10 md:my-12">
        <button className="btn btn-lg btn-primary" onClick={startGame}>
          Start Test
        </button>
      </div>
    );
  }

  if (status === "result") {
    const finalScore = level - 1;
    return (
      <>
        <div className="text-center my-10 md:my-12 max-w-md mx-auto">
          <h2 className="text-2xl font-bold">Test Complete!</h2>
          <p className="text-xl font-semibold mt-2 mb-4">
            You reached level {finalScore}
          </p>
          <div
            role="alert"
            className={clsx(
              "alert",
              finalScore > 5 ? "alert-success" : "alert-info"
            )}
          >
            {finalScore > 5 ? <FiAward /> : <FiEye />}
            <span>
              {finalScore > 5
                ? "Excellent memory!"
                : "Good job! Keep practicing."}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-8 justify-center flex-wrap">
          <button className="btn btn-lg btn-outline" onClick={handleShare}>
            <FiShare2 /> {shareText}
          </button>
          <button className="btn btn-lg btn-primary" onClick={startGame}>
            <TbReload /> Play Again
          </button>
          <button
            className="btn btn-lg btn-secondary"
            onClick={() => router.push(`/${nextTest.link}`)}
          >
            Next Challenge <FiNext />
          </button>
        </div>
      </>
    );
  }

  return (
    <div ref={gameAreaRef} className="w-full flex flex-col items-center pt-10">
      {status === "recall" && <Progress value={timeLeft} maxValue={5} />}

      {/* Stats Header */}
      <div className="w-full mt-10 md:mt-12 max-w-4xl">
        <div className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap">
          <div className="text-center flex flex-col">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              LEVEL
            </span>
            <span className="text-4xl font-bold leading-normal">{level}</span>
          </div>
          <div className="w-px h-16 bg-slate-500 dark:bg-slate-400 hidden sm:block"></div>
          <div className="text-center flex flex-col">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              TIME LEFT
            </span>
            <span
              className={clsx(
                "text-4xl font-bold leading-normal text-primary",
                {
                  "text-red-500 animate-pulse":
                    timeLeft <= 2 && status === "recall",
                }
              )}
            >
              {timeLeft}s
            </span>
          </div>
          <div className="w-px h-16 bg-slate-500 dark:bg-slate-400 hidden sm:block"></div>
          <div className="text-center flex flex-col">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              BEST SCORE
            </span>
            <span className="text-4xl font-bold leading-normal">
              {bestScore}
            </span>
          </div>
        </div>
        <div
          role="alert"
          className="alert alert-info flex justify-center mt-4 md:mt-6 w-fit m-auto"
        >
          <FiEye />
          <span className="font-semibold">{getStatusMessage()}</span>
        </div>
      </div>

      {/* Game Arena */}
      <div className="w-full flex items-center justify-center my-10 md:my-12 min-h-[300px]">
        {status === "memorize" && targetShapes.length > 0 && (
          <div className="flex flex-wrap justify-center items-center gap-4 animate-in fade-in">
            {targetShapes.map((shape: ShapeType) => (
              <Shape key={shape} type={shape} className="text-primary" />
            ))}
          </div>
        )}
        {status === "recall" && (
          <div
            className={clsx("grid gap-4 animate-in fade-in", {
              "grid-cols-2 w-64": gridShapes.length === 4,
              "grid-cols-3 w-96": (gridShapes.length >= 6),
            })}
          >
            {gridShapes.map((shape, index) => (
              <button
                key={`${shape}-${index}`}
                onClick={() => handleShapeClick(shape)}
                disabled={userSelection.includes(shape) || feedback !== null}
                className={clsx("p-4 rounded-lg border-2 transition-all w-fit flex items-center justify-center", {
                  "bg-green-500/20 border-green-500":
                    userSelection.includes(shape),
                  "border-transparent hover:border-primary/50":
                    !userSelection.includes(shape),
                  "border-green-500 bg-green-500/20":
                    feedback === "correct" && targetShapes.includes(shape),
                  "border-red-500 bg-red-500/20":
                    feedback === "incorrect" &&
                    userSelection.includes(shape) &&
                    !targetShapes.includes(shape),
                })}
              >
                <Shape type={shape} className="text-base-content" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
