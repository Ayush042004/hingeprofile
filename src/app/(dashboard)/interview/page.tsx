'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useInterviewStore } from '@/lib/store/interviewStore';
import ChatWindow from '@/components/interview/ChatWindow';
import InterviewInput from '@/components/interview/InterviewInput';
import ProgressBar from '@/components/interview/ProgressBar';
import { Zap, Clock, Trophy, Mic, Sparkles } from 'lucide-react';

const ONBOARDING_STEPS = [
  {
    step: '01',
    title: 'Casual 10-Min Chat',
    desc: 'No forms or robotic questionnaires. Talk to our AI interviewer naturally like messaging a friend.',
    badge: 'Zero Forms',
  },
  {
    step: '02',
    title: 'Live Confidence Scoring',
    desc: 'As you chat, the engine builds confidence across 6 core traits: Humor, Lifestyle, Hobbies, Communication, Relationships & Career.',
    badge: 'Dynamic AI',
  },
  {
    step: '03',
    title: 'Top-1% Profile Generation',
    desc: 'Once target confidence is reached, your bio, 3 custom Hinge prompt answers, and photo recommendations write themselves.',
    badge: 'Authentic Output',
  },
];

export default function InterviewPage() {
  const router = useRouter();
  const {
    messages,
    status,
    confidence,
    completedQuestions,
    totalQuestions,
    isComplete,
    error,
    startInterview,
    sendMessage,
    endInterview,
  } = useInterviewStore();

  const handleSend = (content: string) => {
    sendMessage(content);
  };

  const handleEndAndGenerate = async () => {
    await endInterview();
    router.push('/profile');
  };

  const handleStartSession = () => {
    startInterview();
  };

  // ── 1. INTRO & STEPS ONBOARDING SCREEN (when idle or not started yet) ──────
  if (status === 'idle' && messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-10 sm:px-8 sm:py-16 bg-paper bg-dot-pattern flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 90 }}
          className="max-w-4xl w-full mx-auto"
        >
          {/* Main Hero Card */}
          <div className="relative overflow-hidden rounded-[2.5rem] border-4 border-ink bg-surface p-6 sm:p-12 shadow-[12px_12px_0px_#0c0b09]">
            {/* Electric Lime backdrop badge */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-[#C6FF4D] px-4 py-1.5 font-display text-xs font-black uppercase tracking-widest text-ink shadow-[3px_3px_0px_#0c0b09]">
                <span className="h-2.5 w-2.5 rounded-full bg-ink animate-pulse" />
                <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 stroke-[2.5] fill-ink text-[#C6FF4D]" />3-Step Profile Engine</span>
              </div>
              <span className="flex items-center gap-1.5 rounded-xl border-2 border-ink bg-paper px-3 py-1 font-display text-xs font-black text-ink shadow-[2px_2px_0px_#0c0b09]">
                <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Avg 10 Mins</span>
              </span>
            </div>

            {/* Title & Subtitle */}
            <h1 className="font-display text-3xl font-black uppercase tracking-tight text-ink sm:text-5xl leading-tight">
              Before we chat, here’s how your{' '}
              <span className="inline-block -rotate-1 rounded-2xl border-4 border-ink bg-[#C6FF4D] px-3.5 py-0.5 text-ink shadow-[4px_4px_0px_#0c0b09]">
                Profile writes itself.
              </span>
            </h1>
            <p className="mt-4 max-w-2xl font-sans text-sm sm:text-base font-bold text-ink/80 leading-relaxed">
              We ditched rigid templates for an adaptive conversational engine. You answer naturally, and we extract the exact personality hooks that make dating apps work.
            </p>

            {/* 3 Steps Bento Grid */}
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {ONBOARDING_STEPS.map((s, idx) => (
                <div
                  key={s.step}
                  className="group flex flex-col justify-between rounded-2xl border-3 border-ink bg-paper p-5 shadow-[6px_6px_0px_#0c0b09] transition-all hover:-translate-y-1 hover:bg-[#C6FF4D] hover:shadow-[8px_8px_0px_#0c0b09]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-display text-3xl font-black text-ink/30 group-hover:text-ink transition-colors">
                        {s.step}
                      </span>
                      <span className="rounded-full border border-ink bg-surface px-2.5 py-0.5 font-display text-[10px] font-black uppercase tracking-wider text-ink">
                        {s.badge}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-black uppercase text-ink leading-snug">
                      {s.title}
                    </h3>
                    <p className="mt-2 font-sans text-xs font-medium text-ink/75 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button Box */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 border-t-3 border-ink/20 pt-8">
              <div className="flex items-center gap-3 font-display text-xs font-bold uppercase tracking-wider text-ink/70">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-ink bg-[#C6FF4D] text-ink font-black">✓</span>
                <span>Ready whenever you are</span>
              </div>

              <button
                onClick={handleStartSession}
                className="w-full sm:w-auto rounded-2xl border-4 border-ink bg-ink px-8 py-5 font-display text-base sm:text-lg font-black uppercase tracking-wider text-[#C6FF4D] shadow-[8px_8px_0px_#0c0b09] transition-all hover:-translate-y-1 hover:bg-[#C6FF4D] hover:text-ink hover:shadow-[12px_12px_0px_#0c0b09] active:translate-x-1 active:translate-y-1"
              >
                Start AI Interview →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── 2. ACTIVE INTERVIEW CHAT & SIDEBAR EXPERIENCE ─────────────────────────
  return (
    <div className="flex h-[calc(100vh-5rem)] overflow-hidden bg-paper bg-dot-pattern">
      {/* ── Desktop Sidebar: Progress & Trait Breakdown ── */}
      <aside className="hidden lg:flex w-88 flex-col gap-6 p-6 border-r-4 border-ink bg-surface overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-2 pb-3 border-b-3 border-ink/20">
          <span className="rounded-lg border-2 border-ink bg-[#C6FF4D] px-2 py-0.5 font-display text-xs font-black uppercase">
            Live Coach
          </span>
          <h2 className="font-display text-sm font-black uppercase tracking-wider text-ink">
            Session Monitor
          </h2>
        </div>

        <ProgressBar
          confidence={confidence}
          completedQuestions={completedQuestions}
          totalQuestions={totalQuestions}
          isComplete={isComplete}
          status={status}
          onGenerate={handleEndAndGenerate}
          error={error}
          onRetry={handleStartSession}
        />

        {!isComplete && messages.length > 6 && (
          <button
            onClick={handleEndAndGenerate}
            disabled={status === 'ending' || status === 'streaming'}
            className="w-full rounded-xl border-3 border-ink bg-paper py-3 font-display text-xs font-black uppercase tracking-wider text-ink shadow-[3px_3px_0px_#0c0b09] transition-all hover:bg-[#C6FF4D] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-40"
          >
            Skip & Generate Early →
          </button>
        )}
      </aside>

      {/* ── Main Chat Area ──────────────────────────────── */}
      <div className="flex-1 flex flex-col bg-paper">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b-4 border-ink bg-surface flex items-center justify-between shadow-[0px_4px_0px_#0c0b09] z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#C6FF4D] border border-ink animate-pulse" />
              <h1 className="font-display text-lg sm:text-xl font-black uppercase tracking-tight text-ink">
                YOUR AI COACHING SESSION
              </h1>
            </div>
            <div className="font-sans text-xs font-bold text-ink/70 mt-0.5">
              {isComplete ? (
                <span className="flex items-center gap-1.5 text-ink font-extrabold">
                  <Trophy className="w-4 h-4 stroke-[2.5] text-[#C6FF4D] fill-ink" />
                  Target confidence met! Ready to generate.
                </span>
              ) : (
                'Answer naturally — just talk like you would to a friend'
              )}
            </div>
          </div>

          {/* Mobile progress badge */}
          <div className="lg:hidden flex items-center gap-2.5 rounded-xl border-2 border-ink bg-paper px-3 py-1.5 shadow-[2px_2px_0px_#0c0b09]">
            <div className="w-16 h-2 rounded-full border border-ink bg-surface overflow-hidden">
              <div
                className="h-full bg-[#C6FF4D] transition-all duration-300"
                style={{ width: `${confidence.overall}%` }}
              />
            </div>
            <span className="font-display text-xs font-black text-ink">
              {confidence.overall}%
            </span>
          </div>
        </div>

        {/* Starting / Loading State */}
        {status === 'starting' && (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center rounded-2xl border-4 border-ink bg-surface p-8 shadow-[8px_8px_0px_#0c0b09] max-w-sm animate-scale-in">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-2xl border-3 border-ink bg-[#C6FF4D] shadow-[4px_4px_0px_#0c0b09] mb-4 animate-bounce">
                <Mic className="w-7 h-7 text-ink stroke-[2.5]" />
              </div>
              <h3 className="font-display text-lg font-black uppercase tracking-tight text-ink">
                Starting Interview...
              </h3>
              <p className="font-sans text-xs font-bold text-ink/70 mt-1">
                Connecting to your AI dating coach.
              </p>
            </div>
          </div>
        )}

        {/* Active Chat Windows */}
        {status !== 'starting' && (
          <>
            <ChatWindow
              messages={messages}
              isStreaming={status === 'streaming'}
            />

            <InterviewInput
              onSend={handleSend}
              disabled={status === 'streaming' || status === 'ending' || isComplete}
              placeholder={
                isComplete
                  ? 'Interview complete! Click "Generate Profile Now"'
                  : 'Type your answer naturally...'
              }
            />

            {/* Mobile CTA when complete */}
            {isComplete && (
              <div className="lg:hidden p-4 border-t-3 border-ink bg-surface">
                <button
                  onClick={handleEndAndGenerate}
                  disabled={status === 'ending'}
                  className="w-full rounded-xl border-3 border-ink bg-ink py-4 font-display text-sm font-black uppercase tracking-wider text-[#C6FF4D] shadow-[4px_4px_0px_#0c0b09] transition-all hover:bg-[#C6FF4D] hover:text-ink"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 stroke-[2.5]" />
                    <span>Generate My Profile Now</span>
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}