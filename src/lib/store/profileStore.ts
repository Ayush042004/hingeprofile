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
    try {
      const res = await fetch('/api/profile/regenerate', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to regenerate profile');
      const data = await res.json();
      set({ generatedProfile: data.profile, loading: false });
    } catch (err) {
      set({
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to regenerate',
      });
    }
  },

  clearProfile: () => {
    set({ generatedProfile: null, loading: false, error: null });
  },
}));