'use client';

import {
  User,
  Plane,
  Palette,
  Users,
  Dog,
  Utensils,
  Trophy,
  Home,
  Trees,
  Camera,
  Shirt,
  MapPin,
  MessageSquareQuote,
  Star,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { normalizePhotoSuggestion } from '@/lib/utils/photoNormalizer';

interface PhotoSlotProps {
  order: number;
  photoType: string;
  title: string;
  shot?: string;
  look?: string;
  setting?: string;
  description?: string;
  reason?: string;
  caption?: string;
  required?: boolean;
}

const TYPE_ICONS: Record<string, LucideIcon> = {
  Portrait: User,
  Travel: Plane,
  Hobby: Palette,
  Friends: Users,
  Pet: Dog,
  Food: Utensils,
  Sports: Trophy,
  Lifestyle: Home,
  Nature: Trees,
  Other: Camera,
};

export default function PhotoSlot({
  order,
  photoType,
  title,
  shot,
  look,
  setting,
  description,
  reason,
  caption,
  required,
}: PhotoSlotProps) {
  const normalized = normalizePhotoSuggestion({
    shot,
    look,
    setting,
    description,
    reason,
  });

  const IconComponent = TYPE_ICONS[photoType] || Camera;

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl border-4 border-ink bg-surface p-5 sm:p-6 shadow-[8px_8px_0px_#0c0b09] transition-all duration-200 hover:-translate-y-1 hover:shadow-[10px_10px_0px_#C6FF4D]">
      {/* Number Badge */}
      <div className="absolute -top-3 -left-3 flex h-10 w-10 items-center justify-center rounded-xl border-3 border-ink bg-[#C6FF4D] font-display text-sm font-black text-ink shadow-[3px_3px_0px_#0c0b09]">
        {order}
      </div>

      <div className="pt-2 space-y-3.5">
        {/* Header: Title, Category Badge, Icon */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0 pr-2">
            <h4 className="font-display text-base sm:text-lg font-black uppercase tracking-tight text-ink leading-tight">
              {title}
            </h4>
            <span className="inline-block rounded-md border-2 border-ink bg-paper px-2 py-0.5 font-display text-[10px] font-black uppercase tracking-wider text-ink shadow-brutal-sm">
              {photoType}
            </span>
          </div>
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border-3 border-ink bg-[#C6FF4D] shadow-[3px_3px_0px_#0c0b09]">
            <IconComponent className="w-5 h-5 text-ink stroke-[2.5]" />
          </div>
        </div>

        {/* Structured Information Rows */}
        <div className="space-y-3 pt-1">
          {normalized.shot && (
            <div className="flex items-start gap-2.5">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg border-2 border-ink bg-[#C6FF4D]/35 shadow-[2px_2px_0px_#0c0b09] mt-0.5">
                <Camera className="w-3.5 h-3.5 text-ink stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <span className="block font-display text-[10px] font-black uppercase tracking-wider text-ink/60 leading-none mb-1">
                  Shot
                </span>
                <p className="font-sans text-xs font-bold text-ink leading-snug">
                  {normalized.shot}
                </p>
              </div>
            </div>
          )}

          {normalized.look && (
            <div className="flex items-start gap-2.5">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg border-2 border-ink bg-[#C6FF4D]/35 shadow-[2px_2px_0px_#0c0b09] mt-0.5">
                <Shirt className="w-3.5 h-3.5 text-ink stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <span className="block font-display text-[10px] font-black uppercase tracking-wider text-ink/60 leading-none mb-1">
                  Look
                </span>
                <p className="font-sans text-xs font-bold text-ink leading-snug">
                  {normalized.look}
                </p>
              </div>
            </div>
          )}

          {normalized.setting && (
            <div className="flex items-start gap-2.5">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg border-2 border-ink bg-[#C6FF4D]/35 shadow-[2px_2px_0px_#0c0b09] mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-ink stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <span className="block font-display text-[10px] font-black uppercase tracking-wider text-ink/60 leading-none mb-1">
                  Setting
                </span>
                <p className="font-sans text-xs font-bold text-ink leading-snug">
                  {normalized.setting}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer: Caption & Essential Badge */}
      {(caption || required) && (
        <div className="mt-4 pt-3 border-t-2 border-ink/20 space-y-2.5">
          {caption && (
            <div className="flex items-start gap-2 rounded-xl border-2 border-ink bg-[#C6FF4D]/25 p-2.5 font-sans text-xs font-bold text-ink leading-snug">
              <MessageSquareQuote className="w-4 h-4 stroke-[2.5] text-ink flex-shrink-0 mt-0.5" />
              <span>&ldquo;{caption}&rdquo;</span>
            </div>
          )}
          {required && (
            <div>
              <span className="inline-flex items-center gap-1 rounded-md border border-ink bg-ink px-2.5 py-1 font-display text-[9px] font-black uppercase tracking-wider text-[#C6FF4D]">
                <Star className="w-3 h-3 stroke-[2.5] fill-[#C6FF4D]" />
                <span>Essential Shot</span>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}