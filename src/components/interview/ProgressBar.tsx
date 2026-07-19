'use client';

import type { ConfidenceScores } from '@/lib/types/interview';
import { PERSONALITY_CATEGORIES } from '@/lib/constants';

interface ProgressBarProps {
  confidence: ConfidenceScores;
  completedQuestions: number;
  totalQuestions: number;
}

const CATEGORY_EMOJI: Record<string, string> = {
  humor: '😂',
  personality: '🧠',
  lifestyle: '🏠',
  hobbies: '🎨',
  communication: '💬',
  relationships: '💕',
  career: '💼',
  travel: '✈️',
  food: '🍕',
};

export default function ProgressBar({
  confidence,
  completedQuestions,
  totalQuestions,
}: ProgressBarProps) {
  const overallPercent = confidence.overall;

  return (
    <div className="bg-white border-4 border-[#121212] p-6 shadow-[6px_6px_0px_0px_#121212] flex flex-col gap-4">
      {/* Overall progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#121212]">
            Coach Confidence
          </span>
          <span className="text-sm font-black text-[#D02020]">
            {overallPercent}%
          </span>
        </div>

        <div className="w-full h-5 bg-[#F0F0F0] border-2 border-[#121212] p-0.5">
          <div
            className="h-full bg-[#D02020] border-r border-[#121212] transition-all duration-300"
            style={{ width: `${Math.min(overallPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* Category breakdown */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t-2 border-[#121212]">
        {PERSONALITY_CATEGORIES.map((cat) => {
          const score = confidence[cat];
          const emoji = CATEGORY_EMOJI[cat] || '📊';
          return (
            <div
              key={cat}
              className="flex flex-col items-center gap-1 p-1 bg-[#F0F0F0] border-2 border-[#121212] text-center"
              title={`${cat}: ${score}%`}
            >
              <span className="text-lg">{emoji}</span>
              <span className="text-[10px] font-black uppercase text-[#121212] truncate max-w-full">
                {cat}
              </span>
              <div className="w-full h-2 bg-white border border-[#121212] p-0.5">
                <div
                  className="h-full bg-[#1040C0]"
                  style={{ width: `${Math.min(score, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center font-bold text-[11px] text-[#121212] uppercase tracking-wider mt-2">
        {completedQuestions} of {totalQuestions} Topics Explored
      </div>
    </div>
  );
}