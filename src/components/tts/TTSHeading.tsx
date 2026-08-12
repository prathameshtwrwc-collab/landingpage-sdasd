"use client";

import type { ReactNode } from "react";
import SectionTTSButton from "./SectionTTSButton";

/**
 * Wraps a landing-section heading with a manual TTS speaker button.
 * Usage: <TTSHeading className="...">…heading content…</TTSHeading>
 * The button sits to the right of the heading text (flex, centered).
 */
export default function TTSHeading({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-[10px] ${className}`}>
      <span>{children}</span>
      <span className="inline-flex items-center justify-center">
        <SectionTTSButton />
      </span>
    </span>
  );
}
