export type Chronotype = "LARK" | "EAGLE" | "OWL";

export const CHRONOTYPE_LABELS: Record<Chronotype, string> = {
  LARK: "Lark (Morning Type)",
  EAGLE: "Eagle (Intermediate Type)",
  OWL: "Owl (Evening Type)",
};

export const CHRONOTYPE_DESCRIPTIONS: Record<Chronotype, { tagline: string; description: string }> = {
  LARK: {
    tagline: "Early to bed, early to rise — you own the morning.",
    description: "Larks naturally wake early and peak in the morning. You're most productive before noon and tend to wind down in the evening. Schedule important tasks early and use afternoons for lighter work.",
  },
  EAGLE: {
    tagline: "Balanced and adaptable — you thrive at any hour.",
    description: "Eagles have a flexible rhythm that adapts well to most schedules. Your energy peaks midday, making you ideal for standard 9-to-5 routines. You can handle both morning meetings and evening social events with ease.",
  },
  OWL: {
    tagline: "The night is your kingdom — you come alive after dark.",
    description: "Owls naturally peak in the evening and prefer later schedules. Your creativity and focus surge at night. You thrive with flexible schedules that allow you to sleep in and work when you're most alert.",
  },
};

export const CHRONOTYPE_PEAK_TIMES: Record<Chronotype, { focus: string; creative: string; sleep: string }> = {
  LARK: { focus: "6:00 – 9:00 AM", creative: "4:00 – 6:00 PM", sleep: "9:30 PM" },
  EAGLE: { focus: "9:00 – 11:00 AM", creative: "5:00 – 7:00 PM", sleep: "10:45 PM" },
  OWL: { focus: "2:00 – 5:00 PM", creative: "10:00 PM – 1:00 AM", sleep: "12:30 AM" },
};

export const CHRONOTYPE_BLUEPRINT: Record<Chronotype, { window: string; need: string; cycle: string }> = {
  LARK: { window: "9:30 PM – 5:30 AM", need: "7h 30m", cycle: "~90 min" },
  EAGLE: { window: "10:45 PM – 6:30 AM", need: "7h 45m", cycle: "~96 min" },
  OWL: { window: "12:30 AM – 8:30 AM", need: "8h 00m", cycle: "~100 min" },
};

// Base 24h energy templates per archetype.
// 12 points aligned to ENERGY_LABELS: 6a, 8a, 10a, 12p, 2p, 4p, 6p, 8p, 10p, 12a, 2a, 4a
export const ENERGY_TEMPLATES: Record<Chronotype, number[]> = {
  // Lark: peaks in the morning (6–9 AM focus), second wind 4–6 PM, asleep by ~9:30 PM
  LARK: [70, 92, 96, 68, 48, 56, 72, 46, 18, 8, 5, 12],
  // Eagle: peaks 9–11 AM, steady midday, dip 2–4 PM, second wind 5–7 PM
  EAGLE: [40, 66, 88, 84, 62, 52, 74, 54, 28, 10, 6, 10],
  // Owl: low in the morning, rising through afternoon, peak late evening 10 PM–1 AM
  OWL: [10, 18, 30, 46, 72, 88, 82, 74, 88, 96, 72, 38],
};

export function generateEnergyCurve(chronotype: Chronotype): number[] {
  return ENERGY_TEMPLATES[chronotype] ?? ENERGY_TEMPLATES.EAGLE;
}

export function normalizeCurve(values: number[], targetMax = 95): number[] {
  const max = Math.max(...values, 1);
  if (max <= 0) return values;
  return values.map((v) => Math.round((v / max) * targetMax));
}

/**
 * Build a personalised 24h energy curve from the member's actual result scores.
 *
 * The curve is a weighted blend of the three archetype templates, weighted by the
 * member's real lark/eagle/owl scores. Confidence then pulls the shape toward the
 * winning archetype: low confidence produces a flatter, mixed profile; high
 * confidence produces a shape close to the pure archetype.
 */
export function generatePersonalizedEnergyCurve(
  chronotype: Chronotype,
  larkScore: number,
  eagleScore: number,
  owlScore: number,
  confidenceScore: number
): number[] {
  const total = larkScore + eagleScore + owlScore;
  if (total <= 0) return generateEnergyCurve(chronotype);

  const weights = { LARK: larkScore, EAGLE: eagleScore, OWL: owlScore };
  const len = ENERGY_LABELS.length;

  // 1. Weighted blend of the three archetypes using the member's actual scores.
  const blended = Array.from({ length: len }, (_, i) =>
    (ENERGY_TEMPLATES.LARK[i] * weights.LARK +
      ENERGY_TEMPLATES.EAGLE[i] * weights.EAGLE +
      ENERGY_TEMPLATES.OWL[i] * weights.OWL) /
    total
  );

  // 2. Pull toward the winning archetype proportional to confidence.
  const confidence = Math.max(0, Math.min(100, confidenceScore || 0));
  const winner = ENERGY_TEMPLATES[chronotype];
  // At 0 confidence keep the blended profile; at 100 confidence go ~80% toward the archetype.
  const boost = 0.25 + (confidence / 100) * 0.55;
  const shaped = blended.map((v, i) => v * (1 - boost) + winner[i] * boost);

  return normalizeCurve(shaped, 95);
}

export const ENERGY_LABELS = ["6a", "8a", "10a", "12p", "2p", "4p", "6p", "8p", "10p", "12a", "2a", "4a"];

export function generateEnergyCards(chronotype: Chronotype): { title: string; time: string; desc: string }[] {
  const peak = CHRONOTYPE_PEAK_TIMES[chronotype];
  const cards: Record<Chronotype, { title: string; time: string; desc: string }[]> = {
    LARK: [
      { title: "Focus Peak", time: "6:00 – 9:00 AM", desc: "Deep work and complex problem-solving" },
      { title: "Afternoon Dip", time: "1:00 – 3:00 PM", desc: "Low energy — ideal for breaks and light tasks" },
      { title: "Creative Surge", time: "4:00 – 6:00 PM", desc: "Second wind for creative thinking" },
      { title: "Sleep Prep", time: "8:00 – 9:30 PM", desc: "Wind down — avoid screens and stimulants" },
    ],
    EAGLE: [
      { title: "Focus Peak", time: "9:00 – 11:00 AM", desc: "Most alert for analytical work" },
      { title: "Afternoon Dip", time: "2:00 – 4:00 PM", desc: "Energy lull — perfect for collaborative work" },
      { title: "Creative Surge", time: "5:00 – 7:00 PM", desc: "Evening creativity window" },
      { title: "Sleep Prep", time: "9:30 – 10:45 PM", desc: "Begin winding down for sleep" },
    ],
    OWL: [
      { title: "Focus Peak", time: "2:00 – 5:00 PM", desc: "Sharpest focus for deep work" },
      { title: "Afternoon Dip", time: "12:00 – 2:00 PM", desc: "Post-lunch energy slump" },
      { title: "Creative Surge", time: "10:00 PM – 1:00 AM", desc: "Peak creativity and brainstorming" },
      { title: "Sleep Prep", time: "12:00 – 12:30 AM", desc: "Prepare for rest — dim lights, relax" },
    ],
  };
  return cards[chronotype] ?? cards.EAGLE;
}

export function computeBlueprint(chronotype: Chronotype | null, assessmentCount: number) {
  if (!chronotype) return null;
  const bp = CHRONOTYPE_BLUEPRINT[chronotype];
  return {
    chronotype: CHRONOTYPE_LABELS[chronotype],
    optimalWindow: bp.window,
    sleepNeed: bp.need,
    cycleLength: bp.cycle,
    completeness: Math.min(100, assessmentCount * 25),
  };
}
