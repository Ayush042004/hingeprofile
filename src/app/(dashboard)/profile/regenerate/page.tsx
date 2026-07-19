'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProfileStore } from '@/lib/store/profileStore';
import { RefreshCw } from 'lucide-react';

export default function RegenerateProfilePage() {
  const router = useRouter();
  const { regenerateProfile, loading, generatedProfile } = useProfileStore();

  useEffect(() => {
    regenerateProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loading && generatedProfile) {
      router.push('/profile');
    }
  }, [loading, generatedProfile, router]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-2xl border-4 border-ink bg-[#C6FF4D] shadow-[4px_4px_0px_#0c0b09]">
          <RefreshCw className="w-8 h-8 text-ink stroke-[2.5] animate-spin" />
        </div>
        <h2 className="text-xl font-bold mb-2">Regenerating your profile...</h2>
        <p className="text-sm text-muted max-w-sm">
          Creating a fresh version with new prompt answers, bio, and photo suggestions.
        </p>
      </div>
    </div>
  );
}