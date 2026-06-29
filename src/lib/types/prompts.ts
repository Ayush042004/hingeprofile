
export type HingePrompt = {
  id: string;
  text: string;                  
  requiredTraits: string[];      
  category: 'humor' | 'values' | 'lifestyle' | 'relationship' | 'fun';
  difficulty: 'easy' | 'medium' | 'hard';
  active: boolean;
};


export type ScoredPrompt = HingePrompt & {
  matchScore: number;
};
