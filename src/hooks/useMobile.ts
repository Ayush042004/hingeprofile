'use client';

import { useSyncExternalStore } from 'react';

const MOBILE_BREAKPOINT = 768;

export function useMobile(
  breakpoint: number = MOBILE_BREAKPOINT
): boolean {
  const query = `(max-width: ${breakpoint - 1}px)`;

  const subscribe = (callback: () => void) => {
    const mql = window.matchMedia(query);

    mql.addEventListener('change', callback);

    return () => {
      mql.removeEventListener('change', callback);
    };
  };

  const getSnapshot = () => {
    return window.matchMedia(query).matches;
  };

  const getServerSnapshot = () => {
    return false;
  };

  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
}