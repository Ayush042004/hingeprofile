import {
  PERSONALITY_CATEGORIES,
  CONFIDENCE_THRESHOLD,
  type PersonalityCategory,
} from '@/lib/constants';
import type { ConfidenceScores } from '@/lib/types/interview';

/**
 * Picks the next interview topic by finding the category with the
 * lowest confidence that hasn't yet hit the threshold.
 *
 * Returns `null` when every category is above the threshold
 * (meaning the interview is complete).
 */
export function pickNextQuestionTopic(
  confidence: ConfidenceScores
): PersonalityCategory | null {
  let lowestCategory: PersonalityCategory | null = null;
  let lowestScore = Infinity;

  for (const category of PERSONALITY_CATEGORIES) {
    const score = confidence[category];
    if (score < CONFIDENCE_THRESHOLD && score < lowestScore) {
      lowestScore = score;
      lowestCategory = category;
    }
  }

  return lowestCategory;
}