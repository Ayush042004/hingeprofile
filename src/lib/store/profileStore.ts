import { create } from 'zustand';
import type { GeneratedHingeProfile } from '@/lib/types/profile';

type ProfileStore = {
  generatedProfile: GeneratedHingeProfile | null;
  loading: boolean;
  error: string | null;

  // Actions
  generateProfile: () => Promise<void>;
  fetchProfile: (id: string) => Promise<void>;
  regenerateProfile: () => Promise<void>;
  clearProfile: () => void;
};

export const useProfileStore = create<ProfileStore>((set) => ({
  generatedProfile: null,
  loading: false,
  error: null,

  generateProfile: async () => {
    set({ loading: true, error: null });
    try {
      // First, try to fetch the latest existing active profile.
      // This prevents re-running the AI pipeline on page refreshes.
      const latestRes = await fetch('/api/profile/latest');
      if (latestRes.ok) {
        const latestData = await latestRes.json();
        set({ generatedProfile: latestData.profile, loading: false });
        return;
      }

      // No existing profile found (404) — generate the initial one.
      const res = await fetch('/api/profile/generate', { method: 'POST' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to generate profile');
      }
      const data = await res.json();
      set({ generatedProfile: data.profile, loading: false });
    } catch (err) {
      set({
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to generate',
      });
    }
  },

  fetchProfile: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/profile/${id}`);
      if (!res.ok) throw new Error('Failed to fetch profile');
      const data = await res.json();
      set({ generatedProfile: data.profile, loading: false });
    } catch (err) {
      set({
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch',
      });
    }
  },

  regenerateProfile: async () => {
    set({ loading: true, error: null });
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    try {
      const res = await fetch('/api/profile/regenerate', {
        method: 'POST',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || data.error || 'Failed to regenerate profile');
      }
      const data = await res.json();
      set({ generatedProfile: data.profile, loading: false });
    } catch (err) {
      clearTimeout(timeoutId);
      const isAbort = err instanceof Error && err.name === 'AbortError';
      set({
        loading: false,
        error: isAbort
          ? 'Regeneration timed out. Please try again.'
          : err instanceof Error
          ? err.message
          : 'Failed to regenerate',
      });
    }
  },

  clearProfile: () => {
    set({ generatedProfile: null, loading: false, error: null });
  },
}));