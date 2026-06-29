
export type InterviewMessage = {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  topicHint?: string; 
  createdAt: Date;
};


export type InterviewSession = {
  id: string;
  userId: string;
  status: 'active' | 'completed' | 'abandoned';
  turnCount: number;
  startedAt: Date;
  endedAt?: Date;
};


export type StartInterviewResponse = {
  sessionId: string;
};

export type SendMessageRequest = {
  sessionId: string;
  content: string;
};

export type EndInterviewRequest = {
  sessionId: string;
};
