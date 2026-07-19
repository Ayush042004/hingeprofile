'use client';

import type { InterviewMessage } from '@/lib/types/interview';

interface MessageBubbleProps {
  message: InterviewMessage;
  isLatest?: boolean;
}

export default function MessageBubble({ message, isLatest }: MessageBubbleProps) {
  const isAI = message.role === 'assistant';

  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
      <div className={isAI 
        ? 'bubble-ai bg-white text-[#121212] border-4 border-[#121212] shadow-[4px_4px_0px_0px_#121212] rounded-none' 
        : 'bubble-user bg-[#1040C0] text-white border-4 border-[#121212] shadow-[4px_4px_0px_0px_#121212] rounded-none'
      }>
        {isAI && (
          <div className="flex items-center gap-2 mb-2 pb-1 border-b border-neutral-200">
            <div className="w-3 h-3 rounded-full bg-[#D02020] border border-[#121212]" />
            <span className="text-[10px] font-black text-[#D02020] uppercase tracking-widest">
              DATING COACH
            </span>
          </div>
        )}
        {!isAI && (
          <div className="flex items-center gap-2 mb-2 pb-1 border-b border-[#121212]/30">
            <div className="w-3 h-3 bg-[#F0C020] border border-[#121212] rotate-12" />
            <span className="text-[10px] font-black text-[#F0C020] uppercase tracking-widest">
              YOU
            </span>
          </div>
        )}
        <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}