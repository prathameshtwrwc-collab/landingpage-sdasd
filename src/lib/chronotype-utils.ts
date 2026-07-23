export type Chronotype = "LARK" | "EAGLE" | "OWL";

export const CHRONOTYPE_LABELS: Record<Chronotype, string> = {
  LARK: "Lion (Morning Type)",
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

export function generateEnergyCurve(chronotype: Chronotype): number[] {
  const curves: Record<Chronotype, number[]> = {
    LARK: [25, 45, 65, 85, 90, 80, 70, 60, 50, 35, 20, 15],
    EAGLE: [30, 45, 65, 80, 88, 85, 78, 70, 72, 60, 42, 28],
    OWL: [15, 20, 25, 35, 50, 65, 75, 85, 88, 80, 60, 40],
  };
  return curves[chronotype] ?? curves.EAGLE;
}

export const ENERGY_LABELS = ["6a", "8a", "10a", "12p", "2p", "4p", "6p", "8p", "10p", "12a", "2a", "4a"];

export function generateEnergyCards(chronotype: Chronotype): { title: string; time: string; desc: string }[] {
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
