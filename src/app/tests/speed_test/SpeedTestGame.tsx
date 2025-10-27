"use client";
import { useSpeedTest } from "@/hooks/useSpeedTest";
import {
  FiMousePointer,
  FiShare2,
  FiZap,
  FiCheckCircle,
  FiAward,
} from "react-icons/fi";
import { RiTimerFlashLine } from "react-icons/ri";
import { TbReload } from "react-icons/tb";
import clsx from "clsx";
import { useState, useRef, useEffect } from "react";

function SpeedTestGame() {
  const {
    status,
    results,
    bestTime,
    earlyClickMessage,
    startGame,
    restartGame,
    goToIdle,
    handleTargetClick,
  } = useSpeedTest();

  const [shareText, setShareText] = useState("Share my score");
  const gameAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (status === "waiting" && gameAreaRef.current) {
      gameAreaRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [status]);

  const lastTime = results.length > 0 ? results[results.length - 1] : null;
  const averageTime = status === "result" ? Math.round(results.reduce((a, b) => a + b, 0) / results.length) : null;

  const handleShare = async () => {
    if (!averageTime) return;

    const text = `My average reaction time is ${averageTime}ms on the EyeChallenge speed test! Can you do better? 👀`;
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: "EyeChallenge - Speed Test", text, url });
      } catch (err) {
        console.error("Share error:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        setShareText("Copied!");
        setTimeout(() => setShareText("Share my score"), 2000);
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

  if (status === "result") {
    const feedback = getSpeedTestFeedback(averageTime!);
    const bestSessionTime = Math.min(...results);

    return (
      <div className="text-center my-10 md:my-12 max-w-md mx-auto">
        <h2 className="text-2xl font-bold">Test Complete!</h2>
        <p className="text-xl font-semibold mt-2 mb-4">
          Your best time was {bestSessionTime}ms
        </p>

        <div role="alert" className={clsx("alert mb-4", feedback.className)}>
          <feedback.icon className="text-2xl" />
          <div>
            <h3 className="font-bold">{feedback.title}</h3>
            <div className="text-xs">{feedback.message}</div>
          </div>
        </div>

        <div className="stats stats-vertical shadow-lg">
          {results.map((time, index) => (
            <div className="stat" key={index}>
              <div className="stat-title">Round {index + 1}</div>
              <div
                className={clsx("stat-value", {
                  "text-primary": time === bestSessionTime,
                })}
              >
                {time}ms
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-8">
          <button className="btn btn-lg btn-outline" onClick={handleShare}>
            <FiShare2 />
            {shareText}
          </button>
          <button className="btn btn-lg btn-primary" onClick={goToIdle}>
            <TbReload />
            Restart Test
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={gameAreaRef}
      className="w-full flex flex-col items-center pt-10"
    >
      <div className="w-full mt-10 md:mt-12 max-w-4xl">
        <div className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap">
          <div className="text-center flex flex-col">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              ROUND
            </span>
            <span className="text-4xl font-bold leading-normal">
              {results.length} / 5
            </span>
          </div>

          <div className="w-px h-16 bg-slate-500 dark:bg-slate-400 hidden sm:block"></div>

          <div className="text-center flex flex-col">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Last Time
            </span>
            <span className="text-4xl font-bold leading-normal">
              {lastTime ? `${lastTime}ms` : "-"}
            </span>
          </div>

          <div className="w-px h-16 bg-slate-500 dark:bg-slate-400 hidden sm:block"></div>

          <div className="text-center flex flex-col">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Best Time
            </span>
            <span className=" text-4xl font-bold leading-normal text-primary">
              {bestTime ? `${bestTime}ms` : "-"}
            </span>
          </div>
        </div>

        <div
          role="alert"
          className="alert alert-info flex justify-center mt-4 md:mt-6"
        >
          <FiMousePointer />
          <span className="font-semibold">
            {status === "waiting"
              ? "Click when the circle turns green"
              : "Click NOW!"}
          </span>
        </div>

        {earlyClickMessage && (
          <div
            role="alert"
            className="alert alert-warning flex justify-center mt-4 md:mt-6"
          >
            <span className="font-semibold">{earlyClickMessage}</span>
          </div>
        )}
      </div>

      <div
        className={clsx(
          "my-10 md:my-12 relative flex h-64 w-64 cursor-pointer flex-col items-center justify-center rounded-full shadow-lg transition-all duration-300 sm:h-80 sm:w-80",
          status === "waiting" && "bg-red-500 hover:scale-105 active:scale-95",
          status === "clicking" && "bg-green-500 scale-105 animate-pulse"
        )}
        onClick={handleTargetClick}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          {status === "waiting" ? (
            <>
              <RiTimerFlashLine className="text-5xl" />
              <p className="text-xl font-bold">Wait for green</p>
            </>
          ) : (
            <p className="text-3xl font-bold">Click!</p>
          )}
        </div>
      </div>

      {["waiting", "clicking"].includes(status) && (
        <button className="btn btn-lg btn-primary" onClick={restartGame}>
          <TbReload />
          Restart Test
        </button>
      )}
    </div>
  );
}

function getSpeedTestFeedback(avgTime: number) {
  if (avgTime < 150) {
    return {
      title: "Exceptional Reflexes!",
      message: "Your reaction time is extraordinary, worthy of a top athlete.",
      icon: FiAward,
      className: "alert-warning",
    };
  }
  if (avgTime < 200) {
    return {
      title: "Lightning Fast!",
      message: "You have incredibly fast reflexes, well above average.",
      icon: FiZap,
      className: "alert-success",
    };
  }
  if (avgTime < 250) {
    return {
      title: "Very Good!",
      message: "Your reaction time is faster than the average person.",
      icon: FiCheckCircle,
      className: "alert-success",
    };
  }
  return {
    title: "Solid Reflexes",
    message: "You have a standard and reliable reaction time.",
    icon: FiMousePointer,
    className: "alert-info",
  };
}

export default SpeedTestGame;
