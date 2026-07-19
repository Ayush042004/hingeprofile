'use client';

import type { GeneratedHingeProfile } from '@/lib/types/profile';
import PromptCard from './PromptCard';
import CopyButton from './CopyButton';

interface HingeCardProps {
  profile: GeneratedHingeProfile;
}

export default function HingeCard({ profile }: HingeCardProps) {
  return (
    <div className="bg-white border-4 border-[#121212] shadow-[8px_8px_0px_0px_#121212] rounded-none overflow-hidden max-w-[400px] w-full animate-scale-in">
      {/* ── Bio Section ──────────────────────────────── */}
      <div className="p-6 border-b-4 border-[#121212]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-[#D02020] border border-[#121212]" />
            <h3 className="text-xs font-black uppercase tracking-wider text-[#121212]">
              Your Bio
            </h3>
          </div>
          <CopyButton text={profile.bio} />
        </div>
        <p className="text-xl font-bold leading-tight text-[#121212] tracking-tight">
          {profile.bio}
        </p>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-[9px] font-black uppercase px-2 py-0.5 border border-[#121212] bg-[#1040C0] text-white">
            {profile.style}
          </span>
          <span className="text-[9px] font-bold text-neutral-500">
            V{profile.version}
          </span>
        </div>
      </div>

      {/* ── Prompt Answers ────────────────────────────── */}
      <div className="divide-y-4 divide-[#121212]">
        {profile.promptAnswers.map((pa, i) => (
          <PromptCard
            key={`${pa.promptId}-${i}`}
            prompt={pa.prompt}
            answer={pa.answer}
            category={pa.category}
          />
        ))}
      </div>
    </div>
  );
}