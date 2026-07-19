'use client';

import type { ConfidenceScores } from '@/lib/types/interview';
import { PERSONALITY_CATEGORIES } from '@/lib/constants';
import {
  Laugh,
  Brain,
  Home,
  Palette,
  MessageCircle,
  Heart,
  Briefcase,
  Plane,
  Utensils,
  BarChart2,
  Trophy,
  Sparkles,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ProgressBarProps {
  confidence: ConfidenceScores;
  completedQuestions: number;
  totalQuestions: number;
  isComplete?: boolean;
  status?: string;
  onGenerate?: () => void;
  error?: string | null;
  onRetry?: () => void;
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  humor: Laugh,
  personality: Brain,
  lifestyle: Home,
  hobbies: Palette,
  communication: MessageCircle,
  relationships: Heart,
  career: Briefcase,
  travel: Plane,
  food: Utensils,
};


export default function ProgressBar({
  confidence,
  completedQuestions,
  totalQuestions,
  isComplete,
  status,
  onGenerate,
  error,
  onRetry,
}: ProgressBarProps) {
  const overallPercent = confidence.overall;

  return (
    <div className="rounded-[1.75rem] border-4 border-ink bg-surface p-5 sm:p-6 shadow-[6px_6px_0px_#0c0b09] flex flex-col gap-5">
      {/* Overall progress indicator header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-paper px-3 py-1 font-display text-[11px] font-black uppercase tracking-wider text-ink shadow-[2px_2px_0px_#0c0b09]">
            <span className="h-2 w-2 rounded-full bg-[#C6FF4D] border border-ink animate-pulse" />
            <span>Coach Confidence</span>
          </div>
          <span className="rounded-lg border-2 border-ink bg-[#C6FF4D] px-2.5 py-0.5 font-display text-sm font-black text-ink shadow-[2px_2px_0px_#0c0b09]">
            {overallPercent}%
          </span>
        </div>

        {/* Outer bar box */}
        <div className="w-full h-5 rounded-xl border-3 border-ink bg-paper p-0.5 shadow-inner overflow-hidden">
          <div
            className="h-full rounded-lg bg-[#C6FF4D] border-r-2 border-ink transition-all duration-500 ease-out"
            style={{ width: `${Math.min(overallPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* Completion CTA Box if finished */}
      {isComplete && onGenerate && (
        <div className="rounded-2xl border-4 border-ink bg-[#C6FF4D] p-4 text-center shadow-[4px_4px_0px_#0c0b09] animate-scale-in">
          <div className="inline-flex items-center gap-1.5 rounded-lg border-2 border-ink bg-surface px-2.5 py-0.5 font-display text-[11px] font-black uppercase text-ink mb-2">
            <Trophy className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Target Reached!</span>
          </div>
          <p className="text-xs font-bold text-ink/90 mb-4 leading-relaxed">
            Your profile has enough depth to craft a top-1% Hinge profile.
          </p>
          <button
            onClick={onGenerate}
            disabled={status === 'ending'}
            className="w-full rounded-xl border-3 border-ink bg-ink px-4 py-3 font-display text-xs font-black uppercase tracking-wider text-[#C6FF4D] shadow-[4px_4px_0px_#0c0b09] transition-all hover:bg-surface hover:text-ink active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
          >
            {status === 'ending' ? (
              'Generating Profile...'
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 stroke-[2.5]" />
                <span>Generate Profile Now</span>
              </span>
            )}
          </button>
        </div>
      )}

      {/* Error / Retry Box */}
      {error && (
        <div className="rounded-2xl border-3 border-ink bg-[#FF4D4D] p-3 text-ink shadow-[4px_4px_0px_#0c0b09]">
          <div className="flex items-center gap-1.5 font-display text-xs font-black uppercase tracking-wide mb-1">
            <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
            <span>Connection Notice</span>
          </div>
          <p className="font-sans text-[11px] font-bold text-ink/90 mb-2 leading-snug">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full rounded-lg border-2 border-ink bg-surface px-3 py-1.5 font-display text-[11px] font-black uppercase text-ink shadow-[2px_2px_0px_#0c0b09] transition-all hover:bg-[#C6FF4D]"
            >
              <span className="flex items-center justify-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Retry Connection</span>
              </span>
            </button>
          )}
        </div>
      )}

      {/* Category breakdown Bento Pills */}
      <div className="pt-2 border-t-2 border-ink/20">
        <p className="font-display text-[11px] font-black uppercase tracking-widest text-ink/50 mb-3">
          Explored Traits
        </p>
        <div className="grid grid-cols-3 gap-2">
          {PERSONALITY_CATEGORIES.map((cat) => {
            const score = confidence[cat] || 0;
            const IconComponent = CATEGORY_ICONS[cat] || BarChart2;
            const isScored = score > 0;

            return (
              <div
                key={cat}
                className={`group flex flex-col items-center justify-between rounded-xl border-2 border-ink p-2 text-center transition-all ${
                  isScored
                    ? 'bg-[#C6FF4D] shadow-[2px_2px_0px_#0c0b09]'
                    : 'bg-paper shadow-brutal-sm opacity-75 hover:opacity-100'
                }`}
                title={`${cat.toUpperCase()}: ${score}%`}
              >
                <div className="flex items-center gap-1.5">
                  <IconComponent className="w-3.5 h-3.5 text-ink stroke-[2.5] flex-shrink-0" />
                  <span className="font-display text-[9px] font-black uppercase tracking-wider text-ink truncate max-w-[55px]">
                    {cat}
                  </span>
                </div>

                <div className="mt-1.5 w-full h-1.5 rounded-full border border-ink bg-surface overflow-hidden">
                  <div
                    className="h-full bg-ink transition-all duration-300"
                    style={{ width: `${Math.min(score, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center font-display font-black text-[11px] uppercase tracking-wider text-ink/70">
        <span className="rounded-md border border-ink bg-[#C6FF4D] px-1.5 py-0.5 text-ink mr-1.5">
          {completedQuestions}/{totalQuestions}
        </span>
        Topics Explored
      </div>
    </div>
  );
}