'use client';

import type { InterviewMessage } from '@/lib/types/interview';
import { Bot } from 'lucide-react';

interface MessageBubbleProps {
  message: InterviewMessage;
  isLatest?: boolean;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isAI = message.role === 'assistant';

  return (
    <div className={`flex w-full ${isAI ? 'justify-start' : 'justify-end'} animate-fade-in`}>
      <div
        className={`max-w-[88%] sm:max-w-[78%] rounded-[1.5rem] border-3 border-ink px-5 py-4 text-sm leading-relaxed shadow-[4px_4px_0px_#0c0b09] transition-all ${
          isAI
            ? 'rounded-bl-sm bg-surface text-ink'
            : 'rounded-br-sm bg-[#C6FF4D] text-ink font-bold'
        }`}
      >
        {isAI ? (
          <div className="flex items-center gap-2 mb-2.5 pb-2 border-b-2 border-ink/15">
            <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-ink bg-[#C6FF4D]">
              <Bot className="w-3.5 h-3.5 text-ink stroke-[2.5]" />
            </div>
            <span className="font-display text-[11px] font-black uppercase tracking-widest text-ink">
              AI Interviewer
            </span>
            <span className="ml-auto inline-flex items-center gap-1 rounded-md border border-ink bg-paper px-1.5 py-0.5 text-[9px] font-bold uppercase text-ink/70">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C6FF4D] animate-pulse" />
              Live
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 mb-2 pb-1.5 border-b-2 border-ink/20">
            <div className="w-3.5 h-3.5 rounded-md bg-ink border border-ink rotate-45" />
            <span className="font-display text-[11px] font-black uppercase tracking-widest text-ink">
              YOU
            </span>
          </div>
        )}
        <p className="font-sans whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}