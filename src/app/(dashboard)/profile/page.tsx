'use client';

import { useEffect } from 'react';
import { useProfileStore } from '@/lib/store/profileStore';
import HingeCard from '@/components/profile/HingeCard';
import PhotoSlot from '@/components/profile/PhotoSlot';
import RegenerateBtn from '@/components/profile/RegenerateBtn';
import Link from 'next/link';
import { Sparkles, AlertTriangle, Mic, RefreshCw, Smartphone, Camera } from 'lucide-react';

export default function ProfilePage() {
  const { generatedProfile, loading, error, generateProfile, regenerateProfile } =
    useProfileStore();

  useEffect(() => {
    if (!generatedProfile && !loading) {
      generateProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Loading state
  if (loading && !generatedProfile) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-6">
        <div className="text-center rounded-3xl border-4 border-ink bg-surface p-10 shadow-[10px_10px_0px_#0c0b09] max-w-md animate-scale-in">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-2xl border-4 border-ink bg-[#C6FF4D] shadow-[4px_4px_0px_#0c0b09] animate-bounce">
            <Sparkles className="w-8 h-8 text-ink stroke-[2.5]" />
          </div>
          <h2 className="font-display text-2xl font-black uppercase tracking-tight text-ink mb-2">
            Crafting Your Profile...
          </h2>
          <p className="font-sans text-xs sm:text-sm font-bold text-ink/75 leading-relaxed">
            Our AI is analyzing your conversation details to build a top-1% profile tailored to your personality.
          </p>
          <div className="mt-8 flex flex-col gap-2.5">
            {['Extracting personality hooks', 'Selecting optimal Hinge prompts', 'Writing high-conversion answers', 'Curating photo recommendations'].map(
              (step, i) => (
                <div
                  key={step}
                  className="flex items-center justify-between rounded-xl border-2 border-ink bg-paper px-4 py-2 font-display text-xs font-black uppercase text-ink shadow-brutal-sm"
                >
                  <span>{step}</span>
                  <span className="h-2 w-2 rounded-full bg-[#C6FF4D] animate-ping" style={{ animationDelay: `${i * 300}ms` }} />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !generatedProfile) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-6">
        <div className="text-center rounded-3xl border-4 border-ink bg-surface p-10 shadow-[10px_10px_0px_#0c0b09] max-w-md animate-scale-in">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-2xl border-4 border-ink bg-[#FF4D4D] shadow-[4px_4px_0px_#0c0b09]">
            <AlertTriangle className="w-8 h-8 text-ink stroke-[2.5]" />
          </div>
          <h2 className="font-display text-2xl font-black uppercase tracking-tight text-ink mb-2">
            Generation Notice
          </h2>
          <p className="font-sans text-xs sm:text-sm font-bold text-ink/75 mb-8 leading-relaxed">
            {error}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/interview"
              className="w-full sm:w-auto rounded-xl border-3 border-ink bg-surface px-5 py-3 font-display text-xs font-black uppercase tracking-wider text-ink shadow-[4px_4px_0px_#0c0b09] transition-all hover:bg-[#C6FF4D]"
            >
              <span className="flex items-center justify-center gap-2">
                <Mic className="w-4 h-4 stroke-[2.5]" />
                Return to Interview
              </span>
            </Link>
            <button
              onClick={() => generateProfile()}
              className="w-full sm:w-auto rounded-xl border-3 border-ink bg-ink px-5 py-3 font-display text-xs font-black uppercase tracking-wider text-[#C6FF4D] shadow-[4px_4px_0px_#0c0b09] transition-all hover:bg-[#C6FF4D] hover:text-ink"
            >
              <span className="flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 stroke-[2.5]" />
                Try Again
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!generatedProfile) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* ── Header Bar ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12 pb-6 border-b-4 border-ink animate-fade-in">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-[#C6FF4D] px-3.5 py-1 font-display text-xs font-black uppercase tracking-widest text-ink shadow-brutal-sm mb-3">
            <span className="h-2 w-2 rounded-full bg-ink" />
            <span>Finished Output</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-ink">
            YOUR <span className="inline-block -rotate-1 rounded-2xl border-4 border-ink bg-[#C6FF4D] px-3.5 py-0.5 text-ink shadow-[4px_4px_0px_#0c0b09]">HINGE PROFILE</span>
          </h1>
          <p className="font-sans text-xs sm:text-sm font-bold text-ink/75 uppercase tracking-wider mt-2">
            Copy prompt answers right into Hinge. Regenerate any section anytime.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/interview"
            className="rounded-xl border-3 border-ink bg-surface px-4 py-2.5 font-display text-xs font-black uppercase tracking-wider text-ink shadow-[4px_4px_0px_#0c0b09] transition-all hover:-translate-y-0.5 hover:bg-[#C6FF4D] hover:shadow-[6px_6px_0px_#0c0b09]"
          >
            <span className="flex items-center gap-2">
              <Mic className="w-4 h-4 stroke-[2.5]" />
              Re-interview
            </span>
          </Link>
          <RegenerateBtn onClick={regenerateProfile} loading={loading} />
        </div>
      </div>

      {/* ── Profile Content Grid ────────────────────── */}
      <div className="grid lg:grid-cols-[430px_1fr] gap-12 items-start">
        {/* Hinge Card Preview Column */}
        <div className="sticky top-28">
          <div className="inline-flex items-center gap-2 rounded-xl border-2 border-ink bg-ink px-3.5 py-1.5 font-display text-xs font-black uppercase tracking-widest text-[#C6FF4D] mb-4 shadow-[3px_3px_0px_#0c0b09]">
            <Smartphone className="w-4 h-4 stroke-[2.5] text-[#C6FF4D]" />
            <span>Profile Card Preview</span>
          </div>
          <HingeCard profile={generatedProfile} />
        </div>

        {/* Photo Suggestions Column */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-xl border-2 border-ink bg-[#C6FF4D] px-3.5 py-1.5 font-display text-xs font-black uppercase tracking-widest text-ink mb-4 shadow-[3px_3px_0px_#0c0b09]">
            <Camera className="w-4 h-4 stroke-[2.5] text-ink" />
            <span>Photo Compositions</span>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-2 gap-6">
            {generatedProfile.photoSuggestions.map((photo) => (
              <PhotoSlot
                key={photo.order}
                order={photo.order}
                photoType={photo.photoType}
                title={photo.title}
                description={photo.description}
                reason={photo.reason}
                caption={photo.caption}
                required={photo.required}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}