export const PERSONALITY_CATEGORIES = [
  'humor',
  'personality',
  'lifestyle',
  'hobbies',
  'communication',
  'relationships',
  'career',
  'travel',
  'food',
] as const;

export type PersonalityCategory = (typeof PERSONALITY_CATEGORIES)[number];

/** Minimum category confidence (0–100) before the topic is considered "covered". */
export const CONFIDENCE_THRESHOLD = 70;

/** If all categories hit this, the interview ends automatically. */
export const OVERALL_CONFIDENCE_THRESHOLD = 75;

/** Maximum messages (user turns) before forcing the interview to wrap up. */
export const MAX_INTERVIEW_TURNS = 20;