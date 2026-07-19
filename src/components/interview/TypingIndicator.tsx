'use client';

export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bubble-ai">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-xs">🤖</span>
          <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
            Coach
          </span>
        </div>
        <div className="typing-indicator">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
      </div>
    </div>
  );
}