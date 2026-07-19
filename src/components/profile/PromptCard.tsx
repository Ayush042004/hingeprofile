'use client';

import CopyButton from './CopyButton';

interface PromptCardProps {
  prompt: string;
  answer: string;
  category: string;
}

export default function PromptCard({ prompt, answer, category }: PromptCardProps) {
  return (
    <div className="p-6 bg-white animate-fade-in">
      <div className="flex items-start justify-between gap-4 mb-3">
        <p className="text-xs font-black uppercase tracking-wider text-[#121212] leading-tight">
          {prompt}
        </p>
        <span className="text-[9px] font-black uppercase px-2 py-0.5 border border-[#121212] bg-[#F0C020] text-[#121212]">
          {category}
        </span>
      </div>
      <p className="text-lg font-bold leading-snug text-[#121212] tracking-tight">
        {answer}
      </p>
      <div className="mt-4 flex justify-end">
        <CopyButton text={answer} />
      </div>
    </div>
  );
}