export const EXPERIENCE_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;

export type ExperienceLevelValue = (typeof EXPERIENCE_LEVELS)[number];

export const EXPERIENCE_LEVEL_LABELS: Record<ExperienceLevelValue, string> = {
  BEGINNER: "مبتدئ",
  INTERMEDIATE: "متوسط",
  ADVANCED: "متقدم"
};
