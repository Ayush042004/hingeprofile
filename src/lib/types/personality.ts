import type { ExtractedPersonality } from '@/lib/ai/agents/PersonalityExtractor';

export type { ExtractedPersonality };

export type PersonalityTrait<T = string> = {
  value: T;
  confidence: number;
};

export type PersonalityConfidence = {
  overall: number;
  personality: number;
  lifestyle: number;
  interests: number;
  travel: number;
  relationship: number;
  career: number;
};