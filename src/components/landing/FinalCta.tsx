'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Zap } from 'lucide-react';

export function FinalCta() {
  return (
    <section className="relative overflow-hidden px-6 py-24 sm:px-10 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 85 }}
          className="relative overflow-hidden rounded-[3rem] border-4 border-ink bg-[#C6FF4D] p-8 text-ink shadow-[16px_16px_0px_#0c0b09] sm:p-14 md:p-20"
        >
          {/* Decorative architectural grid overlay */}
          <div className="dotted-bg pointer-events-none absolute inset-0 opacity-25" />

          {/* Top Row: Sticker Tag + Floating Badge */}
          <div className="relative z-10 mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-surface px-4 py-1.5 font-display text-xs font-black uppercase tracking-widest text-ink shadow-[3px_3px_0px_#0c0b09]">
              <span className="h-2.5 w-2.5 rounded-full bg-ink animate-pulse" />
              Ready to stand out?
            </div>

            <div className="hidden sm:inline-flex items-center gap-1.5 -rotate-2 rounded-2xl border-4 border-ink bg-surface px-4 py-1.5 font-display text-xs font-black uppercase tracking-wider text-ink shadow-[4px_4px_0px_#0c0b09]">
              <Zap className="w-3.5 h-3.5 stroke-[2.5] fill-[#C6FF4D] text-ink" />
              <span>No Forms Allowed</span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="relative z-10 max-w-4xl">
            <h2 className="font-display text-4xl font-black uppercase leading-[1.05] tracking-tight text-ink sm:text-6xl md:text-7xl">
              Bored of a profile that sounds like{' '}
              <span className="inline-block rotate-1 rounded-2xl border-4 border-ink bg-surface px-5 py-1 text-ink shadow-[6px_6px_0px_#0c0b09]">
                everyone else&apos;s?
              </span>
            </h2>
            <p className="mt-6 max-w-2xl font-sans text-lg font-bold text-ink/80 sm:text-2xl">
              Ten minutes of chatting with an AI interviewer. A top-1% finished profile grounded strictly in what you actually said.
            </p>
          </div>

          {/* CTA Action & Trust Checklist */}
          <div className="relative z-10 mt-12 flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <Link href="/sign-up" className="w-full sm:w-auto">
              <Button
                size="xl"
                className="w-full border-4 border-ink bg-ink px-10 py-7 font-display text-lg font-black uppercase tracking-wider text-[#C6FF4D] shadow-[8px_8px_0px_#0c0b09] transition-all duration-200 hover:-translate-y-1 hover:translate-x-1 hover:bg-surface hover:text-ink hover:shadow-[12px_12px_0px_#0c0b09] sm:w-auto sm:text-xl"
              >
                Start your interview →
              </Button>
            </Link>

            {/* Quick Stats Checklist */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-display text-xs sm:text-sm font-black uppercase tracking-wider text-ink/90">
              <div className="flex items-center gap-2 rounded-xl border-2 border-ink bg-surface/80 px-3.5 py-1.5 shadow-[2px_2px_0px_#0c0b09]">
                <span>✓</span> 10 Min Average
              </div>
              <div className="flex items-center gap-2 rounded-xl border-2 border-ink bg-surface/80 px-3.5 py-1.5 shadow-[2px_2px_0px_#0c0b09]">
                <span>✓</span> 92% Target Score
              </div>
              <div className="flex items-center gap-2 rounded-xl border-2 border-ink bg-surface/80 px-3.5 py-1.5 shadow-[2px_2px_0px_#0c0b09]">
                <span>✓</span> 0 Templates
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
