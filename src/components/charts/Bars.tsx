"use client";

interface BarsProps {
  data: { label: string; value: number }[];
  color?: string;
  h?: number;
}

export default function Bars({ data, color = "#35319B", h = 80 }: BarsProps) {
  if (!data.length) return null;
  const max = Math.max(...data.map((d) => d.value), 1);
  const barW = Math.max(20, Math.min(60, 200 / data.length - 8));

  return (
    <div className="flex items-end gap-[8px]" style={{ height: h }}>
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-[4px] flex-1">
          <div
            className="w-full rounded-t transition-all duration-300"
            style={{
              height: `${(d.value / max) * (h - 20)}px`,
              background: color,
              opacity: 0.7 + (i / data.length) * 0.3,
              borderRadius: "3px 3px 0 0",
            }}
          />
          <span className="text-[8px] font-medium text-center" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}
