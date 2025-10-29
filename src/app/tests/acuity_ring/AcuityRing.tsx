'use client';

import clsx from 'clsx';
import { GapDirection } from '@/hooks/useAcuityRing';

// Helper function to calculate the SVG path for a pie slice
function getPieSlicePath(cx: number, cy: number, radius: number, startAngle: number, endAngle: number): string {
    const start = {
        x: cx + radius * Math.cos(startAngle * Math.PI / 180),
        y: cy + radius * Math.sin(startAngle * Math.PI / 180)
    };
    const end = {
        x: cx + radius * Math.cos(endAngle * Math.PI / 180),
        y: cy + radius * Math.sin(endAngle * Math.PI / 180)
    };
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    const path = [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y,
        "L", cx, cy,
        "Z"
    ].join(" ");
    return path;
}

const DIRECTIONS_MAP: GapDirection[] = ['up', 'up-right', 'right', 'down-right', 'down', 'down-left', 'left', 'up-left'];

interface AcuityRingProps {
  size: number;
  gapDirection: GapDirection;
  divisions: 4 | 8;
  className?: string;
}

export default function AcuityRing({ size, gapDirection, divisions, className }: AcuityRingProps) {
  const outerRadius = 50; // Using a 100x100 viewBox for consistency
  const innerRadius = 25; // This creates the donut hole
  const angleStep = 360 / divisions;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={clsx('transition-all duration-300', className)}
      aria-label={`Ring with gap facing ${gapDirection}`}
    >
      <defs>
        <mask id="ring-hole">
          <rect width="100" height="100" fill="white"/>
          <circle cx="50" cy="50" r={innerRadius} fill="black"/>
        </mask>
      </defs>
      <g mask="url(#ring-hole)">
        {Array.from({ length: divisions }).map((_, i) => {
          const direction = DIRECTIONS_MAP[i * (8 / divisions)];
          
          // This is the key: we simply don't render the segment that matches the gap direction
          if (direction === gapDirection) {
            return null;
          }

          const startAngle = (i * angleStep) - (angleStep / 2) - 90;
          const endAngle = ((i + 1) * angleStep) - (angleStep / 2) - 90;
          
          return (
            <path
              key={i}
              d={getPieSlicePath(50, 50, outerRadius, startAngle, endAngle)}
              className="fill-current"
            />
          );
        })}
      </g>
    </svg>
  );
}