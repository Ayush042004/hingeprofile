export type InterviewMessage = {
  role: 'assistant' | 'user';
  content: string;
  createdAt?: Date;
};

export type ConfidenceScores = {
  humor: number;
  personality: number;
  lifestyle: number;
  hobbies: number;
  communication: number;
  relationships: number;
  career: number;
  travel: number;
  food: number;
  overall: number;
};

export type InterviewStatus = 'active' | 'completed' | 'abandoned';

export type InterviewProgress = {
  completedQuestions: number;
  totalQuestions: number;
  currentTopic: string;
  confidence: ConfidenceScores;
  isComplete: boolean;
};

export type StartInterviewResponse = {
  sessionId: string;
  message: string;
  topic: string;
  progress: InterviewProgress;
};

export type SendMessageResponse = {
  message: string;
  topic: string;
  progress: InterviewProgress;
};