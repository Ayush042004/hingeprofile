import { create } from 'zustand';
import type { InterviewMessage, ConfidenceScores, InterviewProgress } from '@/lib/types/interview';

type InterviewStatus = 'idle' | 'starting' | 'active' | 'streaming' | 'ending' | 'completed' | 'error';

type InterviewStore = {
  messages: InterviewMessage[];
  sessionId: string | null;
  status: InterviewStatus;
  currentTopic: string;
  confidence: ConfidenceScores;
  completedQuestions: number;
  totalQuestions: number;
  isComplete: boolean;
  error: string | null;

  // Actions
  startInterview: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  endInterview: () => Promise<void>;
  reset: () => void;
};

const defaultConfidence: ConfidenceScores = {
  humor: 0, personality: 0, lifestyle: 0, hobbies: 0,
  communication: 0, relationships: 0, career: 0, travel: 0,
  food: 0, overall: 0,
};

export const useInterviewStore = create<InterviewStore>((set, get) => ({
  messages: [],
  sessionId: null,
  status: 'idle',
  currentTopic: 'introduction',
  confidence: { ...defaultConfidence },
  completedQuestions: 0,
  totalQuestions: 20,
  isComplete: false,
  error: null,

  startInterview: async () => {
    set({ status: 'starting', error: null });
    try {
      const res = await fetch('/api/interview/start', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to start interview');
      const data = await res.json();

      set({
        sessionId: data.sessionId,
        status: 'active',
        messages: [{ role: 'assistant', content: data.message }],
        currentTopic: data.topic,
        confidence: data.progress.confidence,
        completedQuestions: data.progress.completedQuestions,
        totalQuestions: data.progress.totalQuestions,
        isComplete: false,
      });
    } catch (err) {
      set({
        status: 'error',
        error: err instanceof Error ? err.message : 'Failed to start',
      });
    }
  },

  sendMessage: async (content: string) => {
    const { sessionId, messages } = get();
    if (!sessionId) return;

    const userMsg: InterviewMessage = { role: 'user', content };
    set({
      messages: [...messages, userMsg],
      status: 'streaming',
      error: null,
    });

    try {
      const res = await fetch('/api/interview/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: content }),
      });

      if (!res.ok) throw new Error('Failed to send message');

      // Read the streaming response
      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let aiResponse = '';
      let metadata: { topic?: string; progress?: InterviewProgress } | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(Boolean);

        for (const line of lines) {
          // Metadata line (sent at the end of the stream)
          if (line.startsWith('data: {')) {
            try {
              metadata = JSON.parse(line.slice(6));
            } catch { /* ignore */ }
          }
          // Text chunk
          else if (line.startsWith('0:')) {
            try {
              const text = JSON.parse(line.slice(2));
              if (typeof text === 'string') {
                aiResponse += text;
                // Update UI with partial response
                set((s) => {
                  const msgs = [...s.messages];
                  const lastMsg = msgs[msgs.length - 1];
                  if (lastMsg?.role === 'assistant') {
                    msgs[msgs.length - 1] = { ...lastMsg, content: aiResponse };
                  } else {
                    msgs.push({ role: 'assistant', content: aiResponse });
                  }
                  return { messages: msgs };
                });
              }
            } catch {
              // plain text fallback
              aiResponse += line.slice(2);
            }
          }
        }
      }

      // Ensure final message is set
      set((s) => {
        const msgs = [...s.messages];
        const lastMsg = msgs[msgs.length - 1];
        if (lastMsg?.role === 'assistant') {
          msgs[msgs.length - 1] = { ...lastMsg, content: aiResponse };
        } else {
          msgs.push({ role: 'assistant', content: aiResponse });
        }
        return {
          messages: msgs,
          status: metadata?.progress?.isComplete ? 'completed' : 'active',
          currentTopic: metadata?.topic || s.currentTopic,
          confidence: metadata?.progress?.confidence || s.confidence,
          completedQuestions: metadata?.progress?.completedQuestions ?? s.completedQuestions,
          isComplete: metadata?.progress?.isComplete ?? false,
        };
      });
    } catch (err) {
      set({
        status: 'error',
        error: err instanceof Error ? err.message : 'Failed to send',
      });
    }
  },

  endInterview: async () => {
    const { sessionId } = get();
    if (!sessionId) return;

    set({ status: 'ending', error: null });
    try {
      const res = await fetch('/api/interview/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      if (!res.ok) throw new Error('Failed to end interview');

      set({ status: 'completed', isComplete: true });
    } catch (err) {
      set({
        status: 'error',
        error: err instanceof Error ? err.message : 'Failed to end',
      });
    }
  },

  reset: () => {
    set({
      messages: [],
      sessionId: null,
      status: 'idle',
      currentTopic: 'introduction',
      confidence: { ...defaultConfidence },
      completedQuestions: 0,
      totalQuestions: 20,
      isComplete: false,
      error: null,
    });
  },
}));