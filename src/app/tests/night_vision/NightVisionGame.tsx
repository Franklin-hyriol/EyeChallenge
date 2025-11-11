"use client";

import { useNightVision } from "@/hooks/useNightVision";
import { useState, useRef, useEffect } from "react";
import { TbReload } from "react-icons/tb";
import clsx from "clsx";
import {
  FiShare2,
  FiCheckCircle,
  FiAward,
  FiTrendingUp,
  FiEye,
  FiArrowRight,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useNextChallenge } from "@/hooks/useNextChallenge";

const TARGET_SIZE = 64; // Target size in pixels

function NightVisionGame() {
  const {
    status,
    results,
    bestTime,
    FADE_DURATION,
    ROUNDS,
    startTime,
    startGame,
    restartGame,
    goToIdle,
    handleTargetClick,
    animationFrameRef,
  } = useNightVision();

  const [shareText, setShareText] = useState("Share my score");
  const [opacity, setOpacity] = useState(0);
  const [position, setPosition] = useState({ top: "50%", left: "50%" });
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const blackBoxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const nextTest = useNextChallenge();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (status === "fading" && gameAreaRef.current) {
      gameAreaRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [status]);

  useEffect(() => {
    if (status === "fading") {
      const blackBox = blackBoxRef.current;
      if (!blackBox) return;

      const newPos = {
        top: `${Math.random() * (blackBox.clientHeight - TARGET_SIZE)}px`,
        left: `${Math.random() * (blackBox.clientWidth - TARGET_SIZE)}px`,
      };
      setPosition(newPos);

      const animate = () => {
        const elapsedTime = Date.now() - startTime;
        const newOpacity = Math.min(elapsedTime / FADE_DURATION, 1);
        setOpacity(newOpacity);
        if (newOpacity < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);

      return () => cancelAnimationFrame(animationFrameRef.current);
    }
  }, [status, startTime, FADE_DURATION, animationFrameRef]);

  const handleShare = async (avgTime: number) => {
    const text = `I scored an average of ${avgTime.toFixed(0)}ms on the EyeChallenge Night Vision test! Can you do better? 👀`;
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: "EyeChallenge - Night Vision Test", text, url });
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
    const averageTime = results.reduce((a, b) => a + b, 0) / results.length;
    const feedback = getNightVisionFeedback(averageTime);
    return (
      <>
        <div className="text-center my-10 md:my-12 max-w-md mx-auto">
          <h2 className="text-2xl font-bold">Test Complete!</h2>
          <p className="text-xl font-semibold mt-2 mb-4">
            Your average detection time is {averageTime.toFixed(0)}ms
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
                <div className="stat-value">{time.toFixed(0)}ms</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 mt-8 justify-center flex-wrap">
          <button className="btn btn-lg btn-outline" onClick={() => handleShare(averageTime)}>
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

  return (
    <div ref={gameAreaRef} className="w-full flex flex-col items-center pt-10">
      <div className="w-full mt-10 md:mt-12 max-w-4xl">
        <div className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap">
          <div className="text-center flex flex-col">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">ROUND</span>
            <span className="text-4xl font-bold leading-normal">{results.length + 1} / {ROUNDS}</span>
          </div>
          <div className="w-px h-16 bg-slate-500 dark:bg-slate-400 hidden sm:block"></div>
          <div className="text-center flex flex-col">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Last Time</span>
            <span className="text-4xl font-bold leading-normal">
              {results.length > 0 ? `${results[results.length - 1].toFixed(0)}ms` : "-"}
            </span>
          </div>
          <div className="w-px h-16 bg-slate-500 dark:bg-slate-400 hidden sm:block"></div>
          <div className="text-center flex flex-col">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Best Time</span>
            <span className="text-4xl font-bold leading-normal text-primary">
              {bestTime ? `${bestTime.toFixed(0)}ms` : "-"}
            </span>
          </div>
        </div>
      </div>
      <div
        role="alert"
        className="alert alert-info flex justify-center mt-4 md:mt-6 w-fit m-auto"
      >
        <FiEye />
        <span className="font-semibold">Click the circle as soon as you see it</span>
      </div>
      <div
        ref={blackBoxRef}
        className="my-10 md:my-12 w-full max-w-lg h-96 bg-black relative rounded-lg shadow-lg"
      >
        {status === "fading" && (
          <div
            onClick={handleTargetClick}
            className="absolute rounded-full bg-gray-700 cursor-pointer"
            style={{
              top: position.top,
              left: position.left,
              width: TARGET_SIZE,
              height: TARGET_SIZE,
              opacity: opacity,
            }}
          ></div>
        )}
      </div>
      <button className="btn btn-lg btn-primary" onClick={restartGame}>
        <TbReload /> Restart Test
      </button>
    </div>
  );
}

function getNightVisionFeedback(avgTime: number) {
  if (avgTime < 2000) {
    return { title: "Exceptional!", message: "You can spot things in the dark like an owl!", icon: FiAward, className: "alert-warning" };
  }
  if (avgTime < 4000) {
    return { title: "Excellent!", message: "You have a great ability to detect low-contrast objects.", icon: FiCheckCircle, className: "alert-success" };
  }
  if (avgTime < 7000) {
    return { title: "Good!", message: "Your night vision adaptation is solid.", icon: FiTrendingUp, className: "alert-success" };
  }
  return { title: "Average", message: "This is a typical detection time.", icon: FiEye, className: "alert-info" };
}

export default NightVisionGame;
