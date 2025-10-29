"use client";

import clsx from "clsx";

export type ShapeType =
  | "circle"
  | "square"
  | "triangle"
  | "star"
  | "diamond"
  | "hexagon"
  | "cross"
  | "pentagon"
  | "heart"
  | "oval";

interface ShapeProps {
  type: ShapeType;
  className?: string;
}

export default function Shape({ type, className }: ShapeProps) {
  const renderShape = () => {
    switch (type) {
      case "circle":
        return (
          <div
            className={clsx("w-full h-full rounded-full bg-current", className)}
          />
        );

      case "square":
        return <div className={clsx("w-full h-full bg-current", className)} />;

      case "triangle":
        return (
          <svg
            viewBox="0 0 100 100"
            className={clsx("w-full h-full", className)}
            fill="currentColor"
          >
            <polygon points="50,0 100,100 0,100" />
          </svg>
        );

      case "star":
        return (
          <svg
            viewBox="0 0 100 100"
            className={clsx("w-full h-full", className)}
            fill="currentColor"
          >
            <polygon points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35" />
          </svg>
        );

      case "diamond":
        return (
          <div
            className={clsx(
              "w-[60px] h-[60px] bg-current rotate-45",
              className
            )}
          />
        );

      case "hexagon":
        return (
          <svg
            viewBox="0 0 100 100"
            className={clsx("w-full h-full", className)}
            fill="currentColor"
          >
            <polygon points="50 0, 100 25, 100 75, 50 100, 0 75, 0 25" />
          </svg>
        );

      case "cross":
        return (
          <svg
            viewBox="0 0 100 100"
            className={clsx("w-full h-full", className)}
            fill="currentColor"
          >
            <polygon points="40,0 60,0 60,40 100,40 100,60 60,60 60,100 40,100 40,60 0,60 0,40 40,40" />
          </svg>
        );

      case "pentagon":
        return (
          <svg
            viewBox="0 0 100 100"
            className={clsx("w-full h-full", className)}
            fill="currentColor"
          >
            <polygon points="50 0, 100 38, 82 100, 18 100, 0 38" />
          </svg>
        );

      case "heart":
        return (
          <svg
            viewBox="0 0 100 100"
            className={clsx("w-full h-full", className)}
            fill="currentColor"
          >
            <path d="M50 95C40 85 10 60 10 40C10 20 30 5 50 25C70 5 90 20 90 40C90 60 60 85 50 95Z" />
          </svg>
        );

      case "oval":
        return (
          <div
            className={clsx("w-full h-2/3 rounded-full bg-current", className)}
          />
        );

      default:
        return (
          <div
            className={clsx("w-full h-full rounded-full bg-current", className)}
          />
        );
    }
  };

  return (
    <div className="w-24 h-24 flex items-center justify-center">
      {renderShape()}
    </div>
  );
}
