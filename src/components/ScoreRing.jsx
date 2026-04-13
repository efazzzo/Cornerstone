"use client";

import { COLORS } from "@/data/farms";

export default function ScoreRing({ score, size = 56 }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(201,149,42,0.2)" strokeWidth={4} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={COLORS.gold} strokeWidth={4}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
      />
      <text
        x={size/2} y={size/2 + 1}
        textAnchor="middle" dominantBaseline="middle"
        style={{
          transform: `rotate(90deg) translate(0, -${size}px)`,
          transformOrigin: `${size/2}px ${size/2}px`,
          fill: COLORS.gold,
          fontSize: size < 60 ? 11 : 14,
          fontWeight: 700,
          fontFamily: "Georgia, serif",
        }}
      >
        {score}
      </text>
    </svg>
  );
}
