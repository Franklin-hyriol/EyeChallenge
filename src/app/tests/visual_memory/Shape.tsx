"use client";

import clsx from "clsx";

export type ShapeType =
  | "circle"
  | "square"
  | "triangle"
  | "star"
  | "diamond"
  | "hexagon";

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
        // Triangle vers le haut
        return (
          <div
            className={clsx(
              "w-0 h-0 border-l-30 border-l-transparent border-r-30 border-r-transparent border-b-50 border-b-current",
              className
            )}
          />
        );

      case "star":
        return (
          <svg
            viewBox="0 0 24 24"
            className={clsx("w-full h-full", className)}
            fill="currentColor"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
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
