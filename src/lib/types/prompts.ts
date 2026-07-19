export type PromptItem = {
  _id: string;
  prompt: string;
  category: string;
  requiredTraits: string[];
  tags: string[];
  priority: number;
  tone: 'playful' | 'sarcastic' | 'chaotic' | 'emotional' | 'thoughtful';
  active: boolean;
};