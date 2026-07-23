"use client";

interface RingProps {
  value: number;
  size?: number;
  color?: string;
  label?: string;
}

export default function Ring({ value, size = 100, color = "#35319B", label }: RingProps) {
  const strokeW = 6;
  const r = (size - strokeW) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;

  return (
    <div className="flex flex-col items-center" style={{ width: size, fontFamily: "Poppins, sans-serif" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F0F0F0" strokeWidth={strokeW} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={strokeW}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
        <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central"
          fill="#171717" fontSize="18" fontWeight="700" fontFamily="Poppins, sans-serif">
          {Math.round(value)}%
        </text>
      </svg>
      {label && <span className="text-[11px] font-medium mt-[4px] text-center" style={{ color: "#888" }}>{label}</span>}
    </div>
  );
}
