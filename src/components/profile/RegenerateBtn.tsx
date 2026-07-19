'use client';

import { RefreshCw } from 'lucide-react';

interface RegenerateBtnProps {
  onClick: () => void;
  loading?: boolean;
}

export default function RegenerateBtn({ onClick, loading }: RegenerateBtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center justify-center gap-2 rounded-xl border-3 border-ink bg-[#C6FF4D] px-5 py-2.5 font-display text-xs font-black uppercase tracking-wider text-ink shadow-[4px_4px_0px_#0c0b09] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#0c0b09] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
          <span>Regenerating...</span>
        </>
      ) : (
        <>
          <RefreshCw className="w-4 h-4 stroke-[2.5] transition-transform duration-500 group-hover:rotate-180" />
          <span>Regenerate Profile</span>
        </>
      )}
    </button>
  );
}