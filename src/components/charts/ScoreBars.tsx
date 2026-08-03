import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";

interface ScoreBarsProps {
  data: { label: string; value: number }[];
  colors?: string[];
  height?: number;
  accentColor?: string;
}

function ScoreBarsBase({ data, colors, height = 240, accentColor = "#30268F" }: ScoreBarsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const measure = useCallback(() => {
    if (containerRef.current) {
      const w = containerRef.current.clientWidth;
      if (w > 0) setContainerWidth(w);
    }
  }, []);

  useEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const maxValue = useMemo(() => Math.max(...data.map((d) => d.value), 1), [data]);
  const winnerIdx = useMemo(() => {
    let idx = 0;
    data.forEach((d, i) => { if (d.value > data[idx].value) idx = i; });
    return idx;
  }, [data]);

  const padTop = 24;
  const padBottom = 26;
  const padLeft = 6;
  const padRight = 6;
  const plotH = Math.max(height - padTop - padBottom, 60);
  const plotW = Math.max(containerWidth - padLeft - padRight, 100);
  const barGap = 12;
  const barCount = data.length;
  const barWidth = Math.min(Math.max((plotW - barGap * (barCount - 1)) / barCount, 18), 64);

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((f) => ({
    y: padTop + plotH - f * plotH,
    value: Math.round((maxValue * f) / 4) * 4,
  }));

  return (
    <div className="w-full">
      <div ref={containerRef} className="relative w-full" style={{ height }}>
        {containerWidth > 0 && (
          <>
            {/* Gridlines */}
            {gridLines.map((g, i) => (
              <div key={i} className="absolute left-0 right-0 flex items-center"
                style={{ top: g.y, transform: "translateY(-50%)" }}>
                <div className="flex-1" style={{ borderTop: "1px dashed #ECECF2" }} />
                <span className="ml-[6px] text-[9px] font-medium" style={{ color: "#B8B8C6", fontFamily: "Poppins, sans-serif", lineHeight: 1 }}>
                  {g.value}
                </span>
              </div>
            ))}

            {/* Bars */}
            <div className="absolute left-0 right-0 flex items-end justify-center" style={{ top: padTop, height: plotH }}>
              {data.map((d, i) => {
                const barH = Math.max((d.value / maxValue) * plotH, 2);
                const isWinner = i === winnerIdx;
                const barColor = colors?.[i] ?? (isWinner ? accentColor : "#C9C5EC");
                return (
                  <div key={i} className="flex flex-col items-center justify-end" style={{ width: barWidth, margin: `0 ${barGap / 2}px`, height: "100%" }}>
                    <span className="mb-[4px] text-[11px] font-bold" style={{ color: isWinner ? accentColor : "#555", fontFamily: "Poppins, sans-serif", lineHeight: 1 }}>
                      {d.value}
                    </span>
                    <div
                      className="w-full rounded-t-[6px] transition-all duration-300"
                      style={{
                        height: barH,
                        background: barColor,
                        opacity: isWinner ? 1 : 0.45,
                        boxShadow: isWinner ? "0 4px 14px rgba(48,38,143,0.25)" : "none",
                      }}
                    />
                    <span className="mt-[6px] text-[10px] font-semibold text-center" style={{ color: isWinner ? accentColor : "#888", fontFamily: "Poppins, sans-serif", lineHeight: 1.2 }}>
                      {d.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default React.memo(ScoreBarsBase);
