"use client";

import { useRef, useEffect } from "react";

interface IshiharaPlateProps {
  numberToDraw: number;
}

// --- Fonctions utilitaires portées depuis le script original ---

function randomNormal(mean: number, variance: number) {
  let V1, V2, S;
  do {
    const U1 = Math.random();
    const U2 = Math.random();
    V1 = 2 * U1 - 1;
    V2 = 2 * U2 - 1;
    S = V1 * V1 + V2 * V2;
  } while (S > 1);
  let X = Math.sqrt((-2 * Math.log(S)) / S) * V1;
  return mean + Math.sqrt(variance) * X;
}

const MIN_DOT_DISTANCE = 2.0 / 400;

function calcDistance(p1: any, p2: any) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

function dotCollisionCheck(p1: any, p2: any) {
  const dist = calcDistance(p1, p2);
  return dist <= p1.radius + p2.radius + MIN_DOT_DISTANCE;
}

function hsvToRgb(H: number, S: number, V: number) {
  const C = V * S;
  const H1 = H / 60;
  const X = C * (1 - Math.abs((H1 % 2) - 1));
  let RGB1;
  if (0 <= H1 && H1 < 1) RGB1 = [C, X, 0];
  else if (1 <= H1 && H1 < 2) RGB1 = [X, C, 0];
  else if (2 <= H1 && H1 < 3) RGB1 = [0, C, X];
  else if (3 <= H1 && H1 < 4) RGB1 = [0, X, C];
  else if (4 <= H1 && H1 < 5) RGB1 = [X, 0, C];
  else if (5 <= H1 && H1 < 6) RGB1 = [C, 0, X];
  else RGB1 = [0, 0, 0];
  const m = V - C;
  return [
    Math.floor((RGB1[0] + m) * 256),
    Math.floor((RGB1[1] + m) * 256),
    Math.floor((RGB1[2] + m) * 256),
  ];
}

function randomMagnitude() {
  let mag = Math.log(Math.random() * Math.PI) / Math.log(Math.PI);
  return mag > 0 ? mag : 1 / (1 - mag);
}

// --- Composant React ---

const IshiharaPlate = ({ numberToDraw }: IshiharaPlateProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // --- Logique de couleurs dynamiques ---
    const baseHue = Math.random() * 360;
    const numberHue = (baseHue + 120 + Math.random() * 60) % 360;

    const bgSaturation = 0.5 + Math.random() * 0.2;
    const bgValue = 0.8 + Math.random() * 0.15;

    const numSaturation = 0.6 + Math.random() * 0.2;
    const numValue = 0.6 + Math.random() * 0.15;

    // --- Logique de dessin principale ---

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 400, 400);

    ctx.font = 'italic bold 280px "Comic Sans MS"';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#000000";
    ctx.fillText(numberToDraw.toString(), 180, 240);

    const TOTAL_DOTS = 500;
    const DOT_SIZE_MEAN = 0.04;
    const DOT_SIZE_VARIANCE = 0.0001;
    const dots: any[] = [];

    for (let i = 0; i < TOTAL_DOTS; i++) {
      let x, y, radius, j;
      do {
        const magnitude = randomMagnitude();
        const angle = Math.random() * 2 * Math.PI;
        x = magnitude * Math.cos(angle);
        y = magnitude * Math.sin(angle);
        radius = Math.abs(randomNormal(DOT_SIZE_MEAN, DOT_SIZE_VARIANCE));
        j = 0;
        for (; j < i; j++) {
          if (dotCollisionCheck({ x, y, radius }, dots[j])) break;
        }
      } while (j !== i);

      const pixel = ctx.getImageData(x * 200 + 200, 200 - y * 200, 1, 1).data;
      const isOnText = pixel[0] === 0;

      const color = isOnText
        ? hsvToRgb(numberHue + Math.random() * 20 - 10, numSaturation, numValue)
        : hsvToRgb(baseHue + Math.random() * 30 - 15, bgSaturation, bgValue);

      dots.push({ x, y, radius, isOnText, color });
    }

    // Agrandissement des points
    dots.sort((a, b) => a.radius - b.radius);
    for (let pass = 0; pass < 2; pass++) {
      for (let j = 0; j < dots.length; j++) {
        let minDist = Infinity;
        for (let k = 0; k < dots.length; k++) {
          if (j === k) continue;
          const dist =
            calcDistance(dots[j], dots[k]) -
            (dots[j].radius + dots[k].radius + MIN_DOT_DISTANCE);
          if (dist < minDist) minDist = dist;
        }
        if (minDist > 0) dots[j].radius += minDist;
      }
      dots.sort((a, b) => a.radius - b.radius);
    }

    // Dessin final
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const RADIUS = 200;
    dots.forEach((dot) => {
      ctx.fillStyle = `rgb(${dot.color[0]}, ${dot.color[1]}, ${dot.color[2]})`;
      ctx.beginPath();
      ctx.arc(
        dot.x * RADIUS + RADIUS,
        RADIUS - dot.y * RADIUS,
        dot.radius * RADIUS,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });
  }, [numberToDraw]);

  return <canvas ref={canvasRef} width={400} height={400} className="rounded-full" />;
};

export default IshiharaPlate;
