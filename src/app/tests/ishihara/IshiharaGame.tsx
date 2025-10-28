"use client";

import { useIshihara } from "@/hooks/useIshihara";
import { useState, useRef, useEffect } from "react";
import { TbReload } from "react-icons/tb";
import {
  FiShare2,
  FiCheckCircle,
  FiXCircle,
  FiAward,
  FiEye,
  FiChevronLeft,
  FiArrowRight,
} from "react-icons/fi";
import IshiharaPlate from "./IshiharaPlate";
import clsx from "clsx";
import Progress from "@/components/Progress/Progress";
import { useRouter } from "next/navigation";
import { useNextChallenge } from "@/hooks/useNextChallenge";

function IshiharaGame() {
  const {
    status,
    round,
    ROUNDS,
    history,
    currentNumber,
    timeRemaining,
    ROUND_DURATION,
    correctAnswers,
    startGame,
    submitAnswer,
    restartGame,
    goToIdle,
  } = useIshihara();

  const [inputValue, setInputValue] = useState("");
  const [shareText, setShareText] = useState("Share my score");
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const nextTest = useNextChallenge();

  useEffect(() => {
    if (status === "playing" && gameAreaRef.current) {
      gameAreaRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [status]);

  const handleNumberClick = (digit: string) => {
    if (inputValue.length < 2) {
      setInputValue(inputValue + digit);
    }
  };

  const handleClearClick = () => {
    setInputValue((prev) => prev.slice(0, -1));
  };

  const handleSeeNothingClick = () => {
    submitAnswer("none");
    setInputValue("");
  };

  const handleSubmit = () => {
    if (!inputValue) return;
    submitAnswer(inputValue);
    setInputValue("");
  };

  const handleShare = async (score: number) => {
    const text = `I scored ${score}/${ROUNDS} on the EyeChallenge Ishihara test! Can you do better? 👀`;
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: "EyeChallenge - Ishihara Test", text, url });
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
    const feedback = getIshiharaFeedback(correctAnswers);
    return (
      <>
        <div className="text-center my-10 md:my-12 max-w-md mx-auto">
          <h2 className="text-2xl font-bold">Test Complete!</h2>
          <p className="text-xl font-semibold mt-2 mb-4">
            You scored {correctAnswers} / {ROUNDS}
          </p>
          <div role="alert" className={clsx("alert mb-4", feedback.className)}>
            <feedback.icon className="text-2xl" />
            <div>
              <h3 className="font-bold">{feedback.title}</h3>
              <div className="text-xs">{feedback.message}</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Plate</th>
                  <th>Correct Number</th>
                  <th>Your Answer</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{item.number}</td>
                    <td>{item.answer}</td>
                    <td>
                      {item.isCorrect ? (
                        <FiCheckCircle className="text-success" />
                      ) : (
                        <FiXCircle className="text-error" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-8 justify-center flex-wrap">
          <button className="btn btn-lg btn-outline" onClick={() => handleShare(correctAnswers)}>
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
    <div
      ref={gameAreaRef}
      className="w-full flex flex-col items-center pt-10"
    >
      <Progress value={timeRemaining} maxValue={ROUND_DURATION} />
      <div className="w-full mt-10 md:mt-12 max-w-4xl">
        <div className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap">
          <div className="text-center flex flex-col">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              PLATE
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
                timeRemaining <= 5 ? "text-red-500 animate-pulse" : "text-primary"
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
              {correctAnswers}
            </span>
          </div>
        </div>
        {status === "playing" && (
          <div
            role="alert"
            className="alert alert-info flex justify-center mt-4 md:mt-6 w-fit m-auto"
          >
            <FiEye />
            <span className="font-semibold">Enter the number you see in the plate.</span>
          </div>
        )}
      </div>

      <div className="my-10 md:my-12 w-full max-w-lg mx-auto flex justify-center">
        <IshiharaPlate numberToDraw={currentNumber} />
      </div>

      {/* Keypad */}
      <div className="w-full max-w-xs space-y-3 flex flex-col items-center">
        <div className="input input-bordered input-lg w-full h-16 text-3xl text-center flex items-center justify-center tracking-widest font-semibold">
          {inputValue || <span className="text-slate-500 dark:text-slate-400 font-normal">...</span>}
        </div>
        <div className="grid grid-cols-5 gap-2 w-full">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
            <button
              key={digit}
              onClick={() => handleNumberClick(digit.toString())}
              className="btn btn-lg"
            >
              {digit}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 w-full">
          <button onClick={handleClearClick} className="btn btn-lg btn-outline">
            <FiChevronLeft />
          </button>
          <button onClick={handleSeeNothingClick} className="btn btn-lg btn-outline">
            I see nothing
          </button>
        </div>
        <button onClick={handleSubmit} className="btn btn-lg btn-primary w-full">
          Submit
        </button>
      </div>

      <div className="flex items-center gap-4 mt-8">
        <button
          className="btn btn-lg btn-primary"
          onClick={restartGame}
        >
          <TbReload /> Restart Test
        </button>
      </div>
    </div>
  );
}

function getIshiharaFeedback(score: number) {
  if (score === 5) {
    return {
      title: "Excellent!",
      message: "You have normal color vision.",
      icon: FiCheckCircle,
      className: "alert-success",
    };
  }
  if (score >= 3) {
    return {
      title: "Good",
      message: "Your color vision seems to be fine.",
      icon: FiEye,
      className: "alert-info",
    };
  }
  return {
    title: "Potential Deficiency",
    message: "You may have a color vision deficiency. Consider consulting a specialist.",
    icon: FiAward,
    className: "alert-warning",
  };
}

export default IshiharaGame;
