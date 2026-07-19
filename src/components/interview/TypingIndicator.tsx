'use client';

import { Bot } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="rounded-[1.5rem] rounded-bl-sm border-3 border-ink bg-surface px-5 py-4 shadow-[4px_4px_0px_#0c0b09]">
        <div className="flex items-center gap-2 mb-2 pb-1.5 border-b-2 border-ink/15">
          <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-ink bg-[#C6FF4D]">
            <Bot className="w-3.5 h-3.5 text-ink stroke-[2.5]" />
          </div>
          <span className="font-display text-[11px] font-black uppercase tracking-widest text-ink">
            AI Interviewer
          </span>
          <span className="rounded-md border border-ink bg-[#C6FF4D] px-1.5 py-0.5 text-[9px] font-black text-ink animate-pulse">
            Thinking...
          </span>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <div className="h-2.5 w-2.5 rounded-full border border-ink bg-[#C6FF4D] animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="h-2.5 w-2.5 rounded-full border border-ink bg-ink animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="h-2.5 w-2.5 rounded-full border border-ink bg-[#C6FF4D] animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}