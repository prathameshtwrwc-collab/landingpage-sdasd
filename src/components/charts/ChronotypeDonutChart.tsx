"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useThemeDark } from "@/lib/use-theme-dark";

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface ChronotypeDonutChartProps {
  segments: DonutSegment[];
  dominantIndex: number;
  centerTitle: string;
  centerSubtitle: string;
}

const GAP_DEG = 3;
const THICKNESS = 36;
const MAX_SIZE = 340;

export default function ChronotypeDonutChart({
  segments,
  dominantIndex,
  centerTitle,
  centerSubtitle,
}: ChronotypeDonutChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [animated, setAnimated] = useState(false);
  const dark = useThemeDark();

  const measure = useCallback(() => {
    if (containerRef.current) {
      const w = containerRef.current.clientWidth;
      if (w > 0) setWidth(w);
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

  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setAnimated(true)));
    return () => cancelAnimationFrame(raf);
  }, []);

  const total = segments.reduce((s, x) => s + x.value, 0);
  const size = Math.min(Math.max(width, 220), MAX_SIZE);

  const { cx, cy, arcs } = useMemo(() => {
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - THICKNESS / 2 - 8;
    let acc = 0;
    const arcs = segments.map((seg, i) => {
      const frac = total > 0 ? seg.value / total : 0;
      const startDeg = acc * 360;
      acc += frac;
      const sweepDeg = Math.max(frac * 360 - GAP_DEG, 0);
      const pct = Math.round(frac * 100);
      const exploded = i === dominantIndex;
      const segR = exploded ? r + 7 : r;
      const midDeg = startDeg + (frac * 360) / 2;
      const midRad = ((midDeg - 90) * Math.PI) / 180;
      const labelR = segR - THICKNESS / 2 - 5;
      return {
        ...seg,
        frac,
        pct,
        startDeg,
        sweepDeg,
        r: segR,
        segC: 2 * Math.PI * segR,
        labelX: cx + labelR * Math.cos(midRad),
        labelY: cy + labelR * Math.sin(midRad),
      };
    });
    return { cx, cy, arcs };
  }, [segments, total, size, dominantIndex]);

  const trackColor = dark ? "rgba(255,255,255,0.07)" : "rgba(23,23,23,0.06)";
  const labelStroke = dark ? "rgba(15,15,35,0.4)" : "rgba(23,23,23,0.4)";

  return (
    <div ref={containerRef} className="flex justify-center w-full" style={{ minWidth: 220 }}>
      {width > 0 && (
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block", overflow: "visible" }}>
            <defs>
              <filter id="donut-glow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="9" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <circle cx={cx} cy={cy} r={arcs[0]?.r ?? 0} fill="none" stroke={trackColor} strokeWidth={THICKNESS} />

            {arcs.map((arc, i) => {
              const isDominant = i === dominantIndex;
              const finalDash = `${arc.sweepDeg <= 0 ? 0 : (arc.sweepDeg / 360) * arc.segC} ${arc.segC}`;
              return (
                <g key={arc.label} transform={`rotate(${arc.startDeg - 90} ${cx} ${cy})`}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={arc.r}
                    fill="none"
                    stroke={arc.color}
                    strokeWidth={THICKNESS}
                    strokeLinecap="round"
                    opacity={isDominant ? 1 : dark ? 0.5 : 0.42}
                    filter={isDominant ? "url(#donut-glow)" : undefined}
                    style={{
                      strokeDasharray: animated ? finalDash : `0 ${arc.segC}`,
                      transition: `stroke-dasharray 1.1s cubic-bezier(0.32, 0.72, 0.25, 1) ${i * 0.16}s, opacity 0.3s ease`,
                    }}
                  />
                </g>
              );
            })}

            {arcs.map((arc) =>
              arc.pct < 6 ? null : (
                <text
                  key={`${arc.label}-pct`}
                  x={arc.labelX}
                  y={arc.labelY}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={13}
                  fontWeight={700}
                  fill="#FFFFFF"
                  stroke={labelStroke}
                  strokeWidth={2}
                  paintOrder="stroke"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {arc.pct}%
                </text>
              )
            )}
          </svg>

          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
            style={{ pointerEvents: "none", padding: `0 ${THICKNESS}px` }}
          >
            <span
              className="text-[22px] font-bold leading-[1.2]"
              style={{ fontFamily: "Poppins, sans-serif", color: dark ? "#E0E0E0" : "#19164F" }}
            >
              {centerTitle}
            </span>
            <span
              className="text-[11px] font-medium mt-[2px]"
              style={{ fontFamily: "Poppins, sans-serif", color: dark ? "#8B8BA6" : "#667085" }}
            >
              {centerSubtitle}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
