'use client';

interface RegenerateBtnProps {
  onClick: () => void;
  loading?: boolean;
}

export default function RegenerateBtn({ onClick, loading }: RegenerateBtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#F0C020] text-[#121212] border-4 border-[#121212] shadow-[4px_4px_0px_0px_#121212] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all font-black text-xs uppercase tracking-wider rounded-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-[4px_4px_0px_0px_#121212]"
    >
      {loading ? (
        <>
          <svg
            className="animate-spin"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Regenerating...
        </>
      ) : (
        <>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
          </svg>
          Regenerate Profile
        </>
      )}
    </button>
  );
}