import type { PhotoSuggestion } from '@/lib/ai/agents/PhotoAdvisor';

export type PromptAnswerView = {
  promptId: string;
  prompt: string;
  category: string;
  answer: string;
  copied?: boolean;
};

export type GeneratedHingeProfile = {
  _id: string;
  userId: string;
  personalityProfileId: string;
  bio: string;
  tagline: string;
  promptAnswers: PromptAnswerView[];
  photoSuggestions: PhotoSuggestion[];
  overallScore: number;
  style: 'Funny' | 'Romantic' | 'Witty' | 'Adventurous' | 'Professional' | 'Balanced';
  version: number;
  status: 'active' | 'archived';
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
};