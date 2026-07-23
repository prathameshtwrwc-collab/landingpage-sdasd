"use client";

interface MiniLineProps {
  data: number[];
  color?: string;
  h?: number;
}

export default function MiniLine({ data, color = "#35319B", h = 60 }: MiniLineProps) {
  if (!data.length) return null;
  const w = 200;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const stepX = w / (data.length - 1);
  const points = data.map((v, i) => `${i * stepX},${h - ((v - min) / range) * (h - 4) - 2}`).join(" ");
  const fillPoints = `${points} ${(data.length - 1) * stepX},${h} 0,${h}`;

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polygon points={fillPoints} fill={`url(#grad-${color.replace("#", "")})`} />
    </svg>
  );
}
