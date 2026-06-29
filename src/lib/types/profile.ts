
export type PromptAnswer = {
  promptId: string;
  promptText: string;
  answer: string;
};


export type PhotoSlot = {
  type: 'headshot' | 'workout' | 'travel' | 'pet' | 'restaurant' | 'hobby' | 'cozy';
  caption: string;
  order: number; 
};


export type GeneratedHingeProfile = {
  id: string;
  userId: string;
  bio: string;
  tagline: string;
  prompts: PromptAnswer[];
  photoSuggestions: PhotoSlot[];
  version: number;
  createdAt: Date;
};


export type RegenerateSection = 'bio' | 'prompt' | 'photos';

export type RegenerateRequest = {
  section: RegenerateSection;
  promptId?: string; 
};
