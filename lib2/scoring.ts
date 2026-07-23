export type Chronotype = "LARK" | "EAGLE" | "OWL";

export interface ScoredOption {
  option_id: string;
  lark_score: number;
  eagle_score: number;
  owl_score: number;
}

export interface ScoreResult {
  chronotype: Chronotype;
  total_score: number;
  confidence_score: number;
  lark_score: number;
  eagle_score: number;
  owl_score: number;
}

export function calculateChronotype(options: ScoredOption[]): ScoreResult {
  const lark = options.reduce((s, o) => s + o.lark_score, 0);
  const eagle = options.reduce((s, o) => s + o.eagle_score, 0);
  const owl = options.reduce((s, o) => s + o.owl_score, 0);
  const total = lark + eagle + owl;

  const max = Math.max(lark, eagle, owl);
  let chronotype: Chronotype;
  if (max === lark) chronotype = "LARK";
  else if (max === eagle) chronotype = "EAGLE";
  else chronotype = "OWL";

  const second = [lark, eagle, owl].sort((a, b) => b - a)[1];
  const confidence_score = Math.round(
    total > 0 ? ((max - second) / total) * 100 + 50 : 50
  );

  return {
    chronotype,
    total_score: max,
    confidence_score: Math.min(confidence_score, 99),
    lark_score: lark,
    eagle_score: eagle,
    owl_score: owl,
  };
}
