import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";

interface EnergyChartProps {
  data: number[];
  labels?: string[];
  color?: string;
  height?: number;
  accentColor?: string;
}

interface Point {
  x: number;
  y: number;
}

function buildSmoothPath(points: Point[]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

function EnergyChartBase({ data, labels, color = "#F59A00", height = 170, accentColor = "#30268F" }: EnergyChartProps) {
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

  const {
    padTop, padBottom, padLeft, padRight,
    gridLines, points, linePath, areaPath, peakIdx, peak, plotLeft, plotRight,
  } = useMemo(() => {
    // Plot geometry in REAL pixels — no viewBox scaling, no distortion.
    const padTop = 16;
    const padBottom = 22;
    const padLeft = 12;
    const padRight = 40;

    const plotW = Math.max(containerWidth - padLeft - padRight, 100);
    const plotH = Math.max(height - padTop - padBottom, 40);

    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min || 1;

    const pts: Point[] = data.map((v, i) => ({
      x: padLeft + (i / (data.length - 1)) * plotW,
      y: padTop + plotH - ((v - min) / range) * plotH,
    }));

    const linePath = buildSmoothPath(pts);
    const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${padTop + plotH} L ${pts[0].x} ${padTop + plotH} Z`;

    let peakIdx = 0;
    let peak = data[0];
    data.forEach((v, i) => { if (v > peak) { peak = v; peakIdx = i; } });

    const gridLines = [0, 0.25, 0.5, 0.75, 1].map((f) => ({
      y: padTop + plotH - f * plotH,
      value: Math.round(min + range * f),
    }));

    return {
      padTop, padBottom, padLeft, padRight,
      gridLines, points: pts, linePath, areaPath, peakIdx, peak,
      plotLeft: padLeft, plotRight: padLeft + plotW,
    };
  }, [data, height, containerWidth]);

  const gradId = `energy-grad-${color.replace("#", "")}`;
  const peakPt = points[peakIdx];

  return (
    <div className="w-full">
      <div ref={containerRef} className="relative w-full" style={{ height }}>
        {containerWidth > 0 && (
          <svg
            width="100%"
            height={height}
            viewBox={`0 0 ${containerWidth} ${height}`}
            role="img"
            aria-label="Energy level throughout the day"
            style={{ display: "block", overflow: "visible" }}
          >
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.28" />
                <stop offset="100%" stopColor={color} stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Gridlines */}
            {gridLines.map((g, i) => (
              <line key={i} x1={plotLeft} y1={g.y} x2={plotRight} y2={g.y} stroke="#EEEEF2" strokeWidth="1" />
            ))}

            {/* Area fill */}
            <path d={areaPath} fill={`url(#${gradId})`} />

            {/* Line */}
            <path
              d={linePath}
              fill="none"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Peak dot */}
            {peakPt && (
              <circle cx={peakPt.x} cy={peakPt.y} r="5" fill={color} stroke="#FFFFFF" strokeWidth="2" />
            )}
          </svg>
        )}

        {/* Y-axis values — HTML overlay, exactly on gridlines */}
        {containerWidth > 0 && gridLines.map((g, i) => (
          <span
            key={`v-${i}`}
            style={{
              position: "absolute",
              right: 0,
              top: g.y,
              transform: "translateY(-50%)",
              fontSize: 9,
              color: "#B0B0BE",
              fontFamily: "Poppins, sans-serif",
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            {g.value}
          </span>
        ))}

        {/* Peak value label */}
        {peakPt && (
          <span
            style={{
              position: "absolute",
              left: peakPt.x,
              top: peakPt.y,
              transform: "translate(-50%, -160%)",
              fontSize: 10,
              fontWeight: 700,
              color: accentColor,
              fontFamily: "Poppins, sans-serif",
              lineHeight: 1,
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            {peak}
          </span>
        )}
      </div>

      {/* X-axis labels — HTML, exactly under data points */}
      <div className="relative w-full" style={{ height: 16, marginTop: 6, paddingRight: padRight }}>
        {containerWidth > 0 && labels?.map((l, i) => {
          const px = points[i] ? points[i].x : 0;
          const isFirst = i === 0;
          const isLast = labels.length - 1 === i;
          return (
            <span
              key={i}
              style={{
                position: "absolute",
                left: px,
                top: 0,
                transform: isFirst ? "translateX(0)" : isLast ? "translateX(-100%)" : "translateX(-50%)",
                fontSize: 9,
                color: i === peakIdx ? accentColor : "#AAA",
                fontFamily: "Poppins, sans-serif",
                fontWeight: i === peakIdx ? 700 : 400,
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              {l}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default React.memo(EnergyChartBase);
