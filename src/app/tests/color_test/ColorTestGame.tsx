"use client";

import { useColorTest, LEVEL_DURATION } from "@/hooks/useColorTest";
import Progress from "@/components/Progress/Progress";
import { TbReload } from "react-icons/tb";
import clsx from "clsx";
import {
  FiShare2,
  FiCheckCircle,
  FiAward,
  FiTrendingUp,
  FiCoffee,
  FiMousePointer,
} from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

export default function ColorTestGame() {
  const {
    status,
    level,
    timeRemaining,
    bestScore,
    colors,
    clickFeedback,
    startGame,
    handleColorClick,
    restartGame,
  } = useColorTest();

  const [shareText, setShareText] = useState("Share my score");
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const gridCols = Math.ceil(Math.sqrt(colors.length));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (status === "playing" && gameAreaRef.current) {
      gameAreaRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [status]);

  const handleShare = async () => {
    const score = level - 1;
    const text = `I reached level ${score} on the EyeChallenge color sensitivity test! Can you do better? 👀`;
    const url = window.location.href;

    const shareData = {
      title: "EyeChallenge - Color Test",
      text: text,
      url: url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Share error:", err);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        setShareText("Copied!");
        setTimeout(() => {
          setShareText("Share my score");
        }, 2000);
      } catch (err) {
        console.error("Copy error:", err);
      }
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

  const scoreInfo = getScoreInfo(level - 1);

  return (
    <div
      ref={gameAreaRef}
      className="w-full flex flex-col items-center pt-10"
    >
      <Progress value={timeRemaining} maxValue={LEVEL_DURATION} />

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
                "text-4xl font-bold leading-normal",
                timeRemaining <= 5
                  ? "text-red-500 animate-pulse"
                  : "text-primary"
              )}
            >
              {timeRemaining}s
            </span>
          </div>

          <div className="w-px h-16 bg-slate-500 dark:bg-slate-400 hidden sm:block"></div>

          <div className="text-center flex flex-col">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              BEST SCORE
            </span>
            <span className=" text-4xl font-bold leading-normal">
              {bestScore}
            </span>
          </div>
        </div>

        {status === "playing" && (
          <div
            role="alert"
            className="alert alert-info flex justify-center mt-4 md:mt-6"
          >
            <FiMousePointer />
            <span className="font-semibold">Click on the darkest square</span>
          </div>
        )}
      </div>

      {status === "playing" ? (
        <div
          key={level}
          className="grid gap-3 p-4 max-w-lg mx-auto w-full my-10 md:my-12 animate-in fade-in zoom-in-95"
          style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
        >
          {colors.map((color, index) => (
            <button
              key={index}
              aria-label={`Color option ${index + 1}`}
              className={clsx(
                "flex flex-col gap-3 group focus:outline-none rounded-xl transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer",
                {
                  "ring-4 ring-green-500":
                    clickFeedback?.index === index && clickFeedback.correct,
                  "ring-4 ring-red-500":
                    clickFeedback?.index === index && !clickFeedback.correct,
                }
              )}
              onClick={() => handleColorClick(index)}
            >
              <div
                className="w-full aspect-square rounded-xl"
                style={{ backgroundColor: color }}
                data-alt={`color square ${color}`}
              ></div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center my-10 md:my-12 max-w-md mx-auto">
          <h2 className="text-2xl font-bold">Game Over!</h2>
          <p className="text-xl font-semibold mt-2 mb-4">
            Your score is {level - 1}
          </p>
          <div role="alert" className={clsx("alert", scoreInfo.className)}>
            <scoreInfo.icon className="text-2xl" />
            <div>
              <h3 className="font-bold">{scoreInfo.title}</h3>
              <div className="text-xs">{scoreInfo.message}</div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        {status === "gameOver" && (
          <button className="btn btn-lg btn-outline" onClick={handleShare}>
            <FiShare2 />
            {shareText}
          </button>
        )}
        <button className="btn btn-lg btn-primary" onClick={restartGame}>
          <TbReload />
          Restart Test
        </button>
      </div>
    </div>
  );
}

function getScoreInfo(score: number) {
  if (score < 5) {
    return {
      title: "Standard Sensitivity",
      message: "You distinguish basic colors well.",
      icon: FiCoffee,
      className: "alert-info",
    };
  }
  if (score < 10) {
    return {
      title: "Good Sensitivity",
      message: "You perceive subtle nuances well.",
      icon: FiTrendingUp,
      className: "alert-success",
    };
  }
  if (score < 15) {
    return {
      title: "Excellent Sensitivity",
      message:
        "Your perception of nuances is well above average. Congratulations!",
      icon: FiCheckCircle,
      className: "alert-success",
    };
  }
  return {
    title: "Exceptional Vision",
    message:
      "You have a rare ability to distinguish the slightest variations. Impressive!",
    icon: FiAward,
    className: "alert-warning",
  };
}
