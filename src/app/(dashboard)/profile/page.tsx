'use client';

import { useEffect } from 'react';
import { useProfileStore } from '@/lib/store/profileStore';
import HingeCard from '@/components/profile/HingeCard';
import PhotoSlot from '@/components/profile/PhotoSlot';
import RegenerateBtn from '@/components/profile/RegenerateBtn';
import Link from 'next/link';

export default function ProfilePage() {
  const { generatedProfile, loading, error, generateProfile, regenerateProfile } =
    useProfileStore();

  // Auto-generate on mount if no profile
  useEffect(() => {
    if (!generatedProfile && !loading) {
      generateProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Loading state
  if (loading && !generatedProfile) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="text-5xl mb-6 animate-float">✨</div>
          <h2 className="text-xl font-bold mb-2">Crafting your profile...</h2>
          <p className="text-sm text-muted max-w-sm">
            Our AI is analyzing your personality and writing a profile that
            sounds authentically like you. This takes about 30 seconds.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2">
            {['Extracting personality', 'Selecting prompts', 'Writing answers', 'Suggesting photos'].map(
              (step, i) => (
                <span
                  key={step}
                  className="shimmer h-2 rounded-full"
                  style={{
                    width: `${60 + i * 10}px`,
                    animationDelay: `${i * 0.3}s`,
                  }}
                />
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
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center animate-fade-in max-w-md">
          <div className="text-4xl mb-4">😔</div>
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-sm text-muted mb-6">{error}</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/interview" className="btn-secondary">
              🎙️ Start Interview
            </Link>
            <button onClick={() => generateProfile()} className="btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!generatedProfile) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* ── Header ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12 pb-6 border-b-4 border-[#121212] animate-fade-in">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-[#121212]">
            YOUR <span className="text-[#D02020]">HINGE PROFILE</span>
          </h1>
          <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider mt-1">
            Preview, copy, and use on Hinge. Regenerate anytime.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/interview" className="btn-ghost border border-[#121212] bg-white shadow-[3px_3px_0px_0px_#121212] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-xs">
            🎙️ Re-interview
          </Link>
          <RegenerateBtn
            onClick={regenerateProfile}
            loading={loading}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-[400px_1fr] gap-12">
        {/* ── Hinge Card Preview ──────────────────────── */}
        <div>
          <div className="inline-block px-3 py-1 bg-[#1040C0] text-white border-2 border-[#121212] font-black text-xs uppercase tracking-widest mb-4 shadow-[2px_2px_0px_0px_#121212]">
            📱 Profile Preview
          </div>
          <HingeCard profile={generatedProfile} />
        </div>

        {/* ── Photo Suggestions ──────────────────────── */}
        <div>
          <div className="inline-block px-3 py-1 bg-[#F0C020] text-[#121212] border-2 border-[#121212] font-black text-xs uppercase tracking-widest mb-4 shadow-[2px_2px_0px_0px_#121212]">
            📸 Photo Suggestions
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
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