import { generateObject, type ModelMessage } from 'ai';
import { z } from 'zod';

import { chatModel } from './client';
import {
  PERSONALITY_CATEGORIES,
  type PersonalityCategory,
} from '@/lib/constants';
import type { ConfidenceScores } from '@/lib/types/interview';

const ConfidenceSchema = z.object({
  humor: z.number().min(0).max(100),
  personality: z.number().min(0).max(100),
  lifestyle: z.number().min(0).max(100),
  hobbies: z.number().min(0).max(100),
  communication: z.number().min(0).max(100),
  relationships: z.number().min(0).max(100),
  career: z.number().min(0).max(100),
  travel: z.number().min(0).max(100),
  food: z.number().min(0).max(100),
});

/**
 * Analyzes the interview transcript so far and returns a confidence
 * score (0–100) for each personality category, indicating how well
 * the system understands the candidate in that area.
 */
export async function scoreConfidence(
  messages: ModelMessage[]
): Promise<ConfidenceScores> {
  const transcript = messages
    .filter(
      (m): m is ModelMessage & { content: string } =>
        typeof m.content === 'string'
    )
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join('\n\n');

  const { object } = await generateObject({
    model: chatModel,
    schema: ConfidenceSchema,
    system: `You are an interview analyst. Read the conversation transcript and rate how confidently you understand the candidate in each personality category.

Score each category 0–100:
- 0 = not discussed at all
- 30 = briefly mentioned
- 60 = discussed with some detail
- 80 = well understood
- 100 = thoroughly explored with specific examples

Categories: ${PERSONALITY_CATEGORIES.join(', ')}

Return ONLY valid JSON.`,
    prompt: `Interview Transcript:\n\n${transcript}`,
    temperature: 0,
    maxOutputTokens: 4000,
  });

  const scores = object as Record<PersonalityCategory, number>;
  const values = PERSONALITY_CATEGORIES.map((c) => scores[c]);
  const overall = Math.round(
    values.reduce((sum, v) => sum + v, 0) / values.length
  );

  return { ...scores, overall };
}