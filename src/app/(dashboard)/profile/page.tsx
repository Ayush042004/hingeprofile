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
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-6 sm:py-12 min-w-0">
      {/* ── Inline Error Notification ───────────────── */}
      {error && (
        <div className="mb-6 flex items-center justify-between rounded-2xl border-3 border-ink bg-[#FF4D4D] p-4 text-ink shadow-[4px_4px_0px_#0c0b09] animate-scale-in">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 stroke-[2.5]" />
            <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-wide">
              {error}
            </span>
          </div>
          <button
            onClick={() => useProfileStore.setState({ error: null })}
            className="rounded-lg border-2 border-ink bg-surface px-2.5 py-1 font-display text-[10px] font-black uppercase text-ink hover:bg-paper"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── Header Bar ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-12 pb-6 border-b-4 border-ink animate-fade-in">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-[#C6FF4D] px-3 py-0.5 sm:px-3.5 sm:py-1 font-display text-[10px] sm:text-xs font-black uppercase tracking-widest text-ink shadow-brutal-sm mb-2 sm:mb-3">
            <span className="h-2 w-2 rounded-full bg-ink" />
            <span>Finished Output</span>
          </div>
          <h1 className="font-display text-2xl sm:text-5xl font-black uppercase tracking-tight text-ink leading-tight">
            YOUR <span className="inline-block -rotate-1 rounded-xl sm:rounded-2xl border-3 sm:border-4 border-ink bg-[#C6FF4D] px-2.5 sm:px-3.5 py-0.5 text-ink shadow-[3px_3px_0px_#0c0b09] sm:shadow-[4px_4px_0px_#0c0b09]">HINGE PROFILE</span>
          </h1>
          <p className="font-sans text-[11px] sm:text-sm font-bold text-ink/75 uppercase tracking-wider mt-2">
            Copy prompt answers right into Hinge. Regenerate any section anytime.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Link
            href="/interview"
            className="flex-1 sm:flex-none text-center rounded-xl border-3 border-ink bg-surface px-4 py-2.5 font-display text-xs font-black uppercase tracking-wider text-ink shadow-[3px_3px_0px_#0c0b09] sm:shadow-[4px_4px_0px_#0c0b09] transition-all hover:-translate-y-0.5 hover:bg-[#C6FF4D]"
          >
            🎙️ Re-interview
          </Link>
          <RegenerateBtn onClick={regenerateProfile} loading={loading} />
        </div>
      </div>

      {/* ── Profile Content Grid ────────────────────── */}
      <div className="grid lg:grid-cols-[430px_1fr] gap-8 sm:gap-12 items-start">
        {/* Hinge Card Preview Column */}
        <div className="lg:sticky lg:top-28 w-full flex flex-col items-center sm:items-start">
          <div className="inline-flex items-center gap-2 rounded-xl border-2 border-ink bg-ink px-3 py-1 sm:px-3.5 sm:py-1.5 font-display text-[11px] sm:text-xs font-black uppercase tracking-widest text-[#C6FF4D] mb-4 shadow-[3px_3px_0px_#0c0b09]">
            <span>📱 Profile Card Preview</span>
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
                shot={photo.shot}
                look={photo.look}
                setting={photo.setting}
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