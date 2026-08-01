import React from "react";
import { Svg, Circle, Path, Line, G } from "@react-pdf/renderer";

type ChronoKey = "LARK" | "EAGLE" | "OWL";

function LarkIllustration() {
  return (
    <Svg width={110} height={88} viewBox="0 0 110 88">
      <G>
        <Circle cx={55} cy={42} r={22} fill="#FFEEDB" stroke="#ED8300" strokeWidth={1.4} />
        <Circle cx={46} cy={34} r={11} fill="#FFEEDB" stroke="#ED8300" strokeWidth={1.2} />
        <Circle cx={46} cy={34} r={2.6} fill="#ED8300" opacity={0.6} />
        <Line x1={55} y1={12} x2={55} y2={6} stroke="#ED8300" strokeWidth={1.4} strokeLinecap="round" opacity={0.7} />
        <Line x1={30} y1={24} x2={24} y2={18} stroke="#ED8300" strokeWidth={1.4} strokeLinecap="round" opacity={0.6} />
        <Line x1={80} y1={24} x2={86} y2={18} stroke="#ED8300" strokeWidth={1.4} strokeLinecap="round" opacity={0.6} />
        <Line x1={24} y1={42} x2={16} y2={42} stroke="#ED8300" strokeWidth={1.4} strokeLinecap="round" opacity={0.6} />
        <Line x1={86} y1={42} x2={94} y2={42} stroke="#ED8300" strokeWidth={1.4} strokeLinecap="round" opacity={0.6} />
        <Path d="M55 66 Q60 72 55 78 Q50 72 55 66 Z" fill="none" stroke="#ED8300" strokeWidth={1.2} opacity={0.5} />
      </G>
    </Svg>
  );
}

function OwlIllustration() {
  return (
    <Svg width={110} height={88} viewBox="0 0 110 88">
      <G>
        <Path d="M30 52 Q55 20 80 52" fill="#EDE9FE" stroke="#30268F" strokeWidth={1.4} />
        <Circle cx={42} cy={52} r={11} fill="#F4F2FF" stroke="#30268F" strokeWidth={1.1} />
        <Circle cx={68} cy={52} r={11} fill="#F4F2FF" stroke="#30268F" strokeWidth={1.1} />
        <Circle cx={42} cy={52} r={4} fill="#30268F" opacity={0.55} />
        <Circle cx={68} cy={52} r={4} fill="#30268F" opacity={0.55} />
        <Path d="M42 72 Q55 78 68 72" fill="none" stroke="#30268F" strokeWidth={1.1} strokeLinecap="round" />
        <Line x1={38} y1={36} x2={35} y2={26} stroke="#30268F" strokeWidth={1.1} strokeLinecap="round" opacity={0.6} />
        <Line x1={72} y1={36} x2={75} y2={26} stroke="#30268F" strokeWidth={1.1} strokeLinecap="round" opacity={0.6} />
        <Circle cx={22} cy={26} r={3.4} fill="none" stroke="#30268F" strokeWidth={0.9} opacity={0.5} />
        <Circle cx={88} cy={26} r={3.4} fill="none" stroke="#30268F" strokeWidth={0.9} opacity={0.5} />
      </G>
    </Svg>
  );
}

function EagleIllustration() {
  return (
    <Svg width={110} height={88} viewBox="0 0 110 88">
      <G>
        <Path d="M22 60 Q38 28 55 18 Q72 28 88 60" fill="#EDE9FE" stroke="#30268F" strokeWidth={1.4} />
        <Path d="M32 52 Q44 36 55 30 Q66 36 78 52" fill="none" stroke="#30268F" strokeWidth={1} opacity={0.5} />
        <Line x1={55} y1={18} x2={55} y2={70} stroke="#30268F" strokeWidth={0.9} opacity={0.25} />
        <Path d="M34 34 Q28 22 20 18 Q30 26 40 26" fill="#EDE9FE" stroke="#30268F" strokeWidth={1.2} strokeLinejoin="round" />
        <Path d="M76 34 Q82 22 90 18 Q80 26 70 26" fill="#EDE9FE" stroke="#30268F" strokeWidth={1.2} strokeLinejoin="round" />
        <Circle cx={55} cy={16} r={2.6} fill="#30268F" opacity={0.5} />
      </G>
    </Svg>
  );
}

export function ChronotypeIllustration({ type }: { type: string }) {
  const key = type.toUpperCase();
  if (key === "LARK") return <LarkIllustration />;
  if (key === "OWL") return <OwlIllustration />;
  return <EagleIllustration />;
}

export function BrandMark({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <G>
        <Path d="M12 2.5 L21 6.8 L21 12 c0 5.2 -3.8 8.4 -9 9.5 C6.8 20.4 3 17.2 3 12 L3 6.8 Z" fill="#30268F" />
        <Path d="M12 5.5 L8 14.5 L10.2 14.5 L11 12.5 L13 12.5 L13.8 14.5 L16 14.5 Z" fill="#FFFFFF" />
      </G>
    </Svg>
  );
}
