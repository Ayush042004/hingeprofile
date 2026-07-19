'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  label?: string;
}

export default function CopyButton({ text, label = 'Copy' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 rounded-xl border-2 border-ink px-3 py-1 font-display text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#0c0b09] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
        copied ? 'bg-[#C6FF4D] text-ink' : 'bg-surface text-ink hover:bg-[#C6FF4D]'
      }`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 stroke-[3] text-ink" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}