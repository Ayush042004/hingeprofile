'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useInterviewStore } from '@/lib/store/interviewStore';
import ChatWindow from '@/components/interview/ChatWindow';
import InterviewInput from '@/components/interview/InterviewInput';
import ProgressBar from '@/components/interview/ProgressBar';

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

  // Auto-start on mount if idle
  useEffect(() => {
    if (status === 'idle') {
      startInterview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = (content: string) => {
    sendMessage(content);
  };

  const handleEndAndGenerate = async () => {
    await endInterview();
    router.push('/profile');
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* ── Sidebar: Progress ──────────────────────────── */}
      <aside className="hidden lg:flex w-80 flex-col gap-4 p-4 border-r-4 border-[#121212] bg-[#F0F0F0] bg-dot-pattern overflow-y-auto custom-scrollbar">
        <ProgressBar
          confidence={confidence}
          completedQuestions={completedQuestions}
          totalQuestions={totalQuestions}
        />

        {isComplete && (
          <div className="bg-white border-4 border-[#121212] p-4 text-center shadow-[4px_4px_0px_0px_#121212] rounded-none animate-scale-in">
            <p className="text-sm font-black text-[#D02020] uppercase tracking-wider mb-2">
              🎉 Interview Complete!
            </p>
            <p className="text-xs font-bold text-[#121212] mb-4">
              We have enough detail to write your high-rizz dating profile.
            </p>
            <button
              onClick={handleEndAndGenerate}
              disabled={status === 'ending'}
              className="btn-primary w-full bg-[#D02020]"
            >
              {status === 'ending' ? (
                <>
                  <svg className="animate-spin mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Analyzing...
                </>
              ) : (
                '✨ Generate My Profile'
              )}
            </button>
          </div>
        )}

        {!isComplete && messages.length > 6 && (
          <button
            onClick={handleEndAndGenerate}
            disabled={status === 'ending' || status === 'streaming'}
            className="btn-ghost text-xs border border-[#121212] bg-white shadow-[2px_2px_0px_0px_#121212]"
          >
            Skip & generate early →
          </button>
        )}

        {error && (
          <div className="bg-[#D02020] text-white border-4 border-[#121212] p-3 text-xs font-bold rounded-none shadow-[4px_4px_0px_0px_#121212]">
            {error}
          </div>
        )}
      </aside>

      {/* ── Main chat ──────────────────────────────────── */}
      <div className="flex-1 flex flex-col bg-[#F0F0F0] bg-dot-pattern">
        {/* Header */}
        <div className="px-6 py-4 border-b-4 border-[#121212] bg-white flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black uppercase tracking-tighter text-[#121212]">YOUR COACHING SESSION</h1>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              {isComplete
                ? 'All done! Generate your profile.'
                : 'Answer naturally — like chatting with a friend'}
            </p>
          </div>

          {/* Mobile progress */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="progress-track w-20 h-3">
              <div
                className="progress-fill h-full bg-[#D02020]"
                style={{ width: `${confidence.overall}%` }}
              />
            </div>
            <span className="text-xs font-black text-[#D02020]">
              {confidence.overall}%
            </span>
          </div>
        </div>

        {/* Loading state */}
        {status === 'starting' && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center animate-fade-in">
              <div className="text-4xl mb-4 animate-float">🎙️</div>
              <p className="text-sm font-medium">Setting up your interview...</p>
              <p className="text-xs text-muted mt-1">This only takes a moment</p>
            </div>
          </div>
        )}

        {/* Chat */}
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
                  ? 'Interview complete! Click "Generate My Profile"'
                  : 'Type your answer...'
              }
            />

            {/* Mobile CTA */}
            {isComplete && (
              <div className="lg:hidden p-4 border-t border-border">
                <button
                  onClick={handleEndAndGenerate}
                  disabled={status === 'ending'}
                  className="btn-primary w-full"
                >
                  ✨ Generate My Profile
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}