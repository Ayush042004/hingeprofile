'use client';

interface PhotoSlotProps {
  order: number;
  photoType: string;
  title: string;
  description: string;
  reason: string;
  caption: string;
  required: boolean;
}

const TYPE_EMOJI: Record<string, string> = {
  Portrait: '🤳',
  Travel: '✈️',
  Hobby: '🎨',
  Friends: '👯',
  Pet: '🐕',
  Food: '🍽️',
  Sports: '⚽',
  Lifestyle: '🏡',
  Nature: '🌿',
  Other: '📷',
};

export default function PhotoSlot({
  order,
  photoType,
  title,
  description,
  reason,
  caption,
  required,
}: PhotoSlotProps) {
  return (
    <div className="relative bg-white border-4 border-[#121212] p-6 shadow-[6px_6px_0px_0px_#121212] flex flex-col justify-between min-h-[300px] rounded-none animate-fade-in-up group hover:-translate-y-1 transition-transform">
      {/* Bauhaus Number Badge */}
      <div className="absolute top-[-4px] left-[-4px] w-9 h-9 bg-[#F0C020] text-[#121212] border-r-4 border-b-4 border-[#121212] font-black text-sm flex items-center justify-center">
        {order}
      </div>

      <div className="pt-6 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xl ml-auto">{TYPE_EMOJI[photoType] || '📷'}</span>
        </div>

        <div className="space-y-1">
          <h4 className="font-black text-base uppercase tracking-tighter text-[#121212] leading-tight">{title}</h4>
          <span className="inline-block text-[9px] font-black uppercase px-2 py-0.5 border border-[#121212] bg-[#1040C0] text-white">
            {photoType}
          </span>
        </div>

        <p className="text-xs font-semibold text-[#121212] leading-relaxed">{description}</p>
      </div>

      <div className="w-full pt-4 mt-4 border-t-2 border-[#121212] space-y-2">
        <p className="text-[11px] font-bold text-neutral-500 leading-normal">
          <span className="font-black text-[#121212]">WHY: </span>
          {reason}
        </p>
        {caption && (
          <p className="text-[11px] font-black text-[#D02020] bg-[#F0F0F0] border border-[#121212] p-1.5 leading-snug">
            💬 &ldquo;{caption}&rdquo;
          </p>
        )}
        {required && (
          <span className="inline-block text-[9px] font-black bg-[#D02020] text-white border border-[#121212] px-2 py-0.5 uppercase tracking-wider">
            ★ Essential
          </span>
        )}
      </div>
    </div>
  );
}