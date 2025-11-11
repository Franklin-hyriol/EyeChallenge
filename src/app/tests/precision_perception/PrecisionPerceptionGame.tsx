"use client";

import { usePrecisionPerception } from "@/hooks/usePrecisionPerception";
import { useState, useRef, useEffect } from "react";
import { TbReload } from "react-icons/tb";
import {
  FiShare2,
  FiEye,
  FiCheckCircle,
  FiTrendingUp,
  FiAward,
  FiAlertTriangle,
  FiArrowRight,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useNextChallenge } from "@/hooks/useNextChallenge";
import clsx from "clsx";
import Progress from "@/components/Progress/Progress";

function PrecisionPerceptionGame() {
  const {
    status,
    round,
    ROUNDS,
    score,
    timeRemaining,
    ROUND_DURATION,
    numberOfCircles,
    sizeIncrement,
    correctCircleIndex,
    startGame,
    handleCircleClick,
    restartGame,
    goToIdle,
  } = usePrecisionPerception();

  const [shareText, setShareText] = useState("Share my score");
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const nextTest = useNextChallenge();

  useEffect(() => {
    if (status === "playing" && gameAreaRef.current) {
      gameAreaRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [status]);

  const handleShare = async () => {
    const text = `I scored ${score}/${ROUNDS} on the EyeChallenge Precision Perception test! Can you do better? 👀`;
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: "EyeChallenge - Precision Perception Test", text, url });
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setShareText("Copied!");
      setTimeout(() => setShareText("Share my score"), 2000);
    }
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
    const feedback = getPrecisionFeedback(score);
    return (
      <>
        <div className="text-center my-10 md:my-12 max-w-md mx-auto">
          <h2 className="text-2xl font-bold">Test Complete!</h2>
          <p className="text-xl font-semibold mt-2 mb-4">
            You scored {score} / {ROUNDS}
          </p>
          <div role="alert" className={clsx("alert mb-4", feedback.className)}>
            <feedback.icon className="text-2xl" />
            <div>
              <h3 className="font-bold">{feedback.title}</h3>
              <div className="text-xs">{feedback.message}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-8 justify-center flex-wrap">
          <button className="btn btn-lg btn-outline" onClick={handleShare}>
            <FiShare2 /> {shareText}
          </button>
          <button className="btn btn-lg btn-primary" onClick={goToIdle}>
            <TbReload /> Restart Test
          </button>
          <button
            className="btn btn-lg btn-secondary"
            onClick={() => router.push(`/${nextTest.link}`)}
          >
            Next Challenge <FiArrowRight />
          </button>
        </div>
      </>
    );
  }

  const baseSize = 80; // Base size in pixels

  const gridClass = {
    2: "grid-cols-2",
    4: "grid-cols-2",
    6: "grid-cols-3",
    9: "grid-cols-3",
  }[numberOfCircles];

  return (
    <div ref={gameAreaRef} className="w-full flex flex-col items-center pt-10">
      <Progress value={timeRemaining} maxValue={ROUND_DURATION} />

      <div className="w-full mt-10 md:mt-12 max-w-4xl">
        <div className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap">
          <div className="text-center flex flex-col">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              ROUND
            </span>
            <span className="text-4xl font-bold leading-normal">
              {round + 1} / {ROUNDS}
            </span>
          </div>
          <div className="w-px h-16 bg-slate-500 dark:bg-slate-400 hidden sm:block"></div>
          <div className="text-center flex flex-col">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              TIME LEFT
            </span>
            <span
              className={clsx(
                "text-4xl font-bold leading-normal",
                timeRemaining <= 3 ? "text-red-500 animate-pulse" : "text-primary"
              )}
            >
              {timeRemaining}s
            </span>
          </div>
          <div className="w-px h-16 bg-slate-500 dark:bg-slate-400 hidden sm:block"></div>
          <div className="text-center flex flex-col">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              SCORE
            </span>
            <span className="text-4xl font-bold leading-normal">
              {score}
            </span>
          </div>
        </div>
        {status === "playing" && (
          <div
            role="alert"
            className="alert alert-info flex justify-center mt-4 md:mt-6 w-fit m-auto"
          >
            <FiEye />
            <span className="font-semibold">Click the circle that is slightly bigger.</span>
          </div>
        )}
      </div>

      <div
        key={round} // Force re-render to re-trigger animation
        className={clsx(
          "my-10 md:my-12 w-full max-w-lg mx-auto gap-4 animate-in fade-in zoom-in-95",
          numberOfCircles <= 2
            ? "flex justify-center items-center"
            : `grid ${gridClass}`
        )}
      >
        {Array.from({ length: numberOfCircles }, (_, i) => i).map((index) => {
          const size =
            baseSize + (index === correctCircleIndex ? sizeIncrement : 0);
          return (
            <div
              key={index}
              onClick={() => handleCircleClick(index)}
              className="bg-primary rounded-full cursor-pointer transition-transform justify-self-center"
              style={{ width: size, height: size }}
            ></div>
          );
        })}
      </div>

      <button className="btn btn-lg btn-primary" onClick={restartGame}>
        <TbReload /> Restart Test
      </button>
    </div>
  );
}

function getPrecisionFeedback(score: number) {
  if (score < 3) {
    return {
      title: "Needs Improvement",
      message: "You had some trouble spotting the differences. Try again!",
      icon: FiAlertTriangle,
      className: "alert-warning",
    };
  }
  if (score < 6) {
    return {
      title: "Good Eye!",
      message: "You have a solid ability to detect small differences.",
      icon: FiTrendingUp,
      className: "alert-info",
    };
  }
  if (score < 9) {
    return {
      title: "Excellent Precision!",
      message: "Your perception of detail is well above average. Great job!",
      icon: FiCheckCircle,
      className: "alert-success",
    };
  }
  return {
    title: "Eagle Eye!",
    message: "You have exceptional precision. Truly impressive!",
    icon: FiAward,
    className: "alert-success",
  };
}

export default PrecisionPerceptionGame;
