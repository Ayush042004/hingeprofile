
export type TraitEntry = {
  value: string | string[]; 
  score: number; 
};


export type PersonalityProfile = {
  id: string;
  userId: string;
  humor: TraitEntry;
  lifestyle: TraitEntry;
  hobbies: TraitEntry;          
  communicationStyle: TraitEntry;
  relationshipGoal: TraitEntry;
  values: TraitEntry;
  travel: TraitEntry;
  food: TraitEntry;
  career: TraitEntry;
  quirks: TraitEntry;
  updatedAt: Date;
};


export type TraitGap = {
  trait: keyof Omit<PersonalityProfile, 'id' | 'userId' | 'updatedAt'>;
  score: number;
};


export type PartialPersonalityProfile = Partial<
  Omit<PersonalityProfile, 'id' | 'userId' | 'updatedAt'>
>;
