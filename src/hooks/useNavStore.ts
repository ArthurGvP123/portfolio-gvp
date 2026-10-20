"use client";

import { useSyncExternalStore, useCallback } from "react";

export interface NavStoreState {
  isOpen: boolean;
  isNavOpen: boolean;
  openNav: () => void;
  closeNav: () => void;
  toggleNav: () => void;
}

let navOpen = false;
const listeners = new Set<() => void>();

function emitChange(): void {
  for (const listener of listeners) {
    listener();
  }
}

export const navStore = {
  getSnapshot: (): boolean => navOpen,
  getServerSnapshot: (): boolean => false,
  subscribe: (listener: () => void): (() => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  openNav: (): void => {
    if (!navOpen) {
      navOpen = true;
      emitChange();
    }
  },
  closeNav: (): void => {
    if (navOpen) {
      navOpen = false;
      emitChange();
    }
  },
  toggleNav: (): void => {
    navOpen = !navOpen;
    emitChange();
  },
};

/**
 * Clean client state hook for opening/closing the fullscreen overlay navigation menu.
 * Provides both `isOpen` and `isNavOpen` for contract compatibility.
 */
export function useNavStore(): NavStoreState {
  const isOpen = useSyncExternalStore(
    navStore.subscribe,
    navStore.getSnapshot,
    navStore.getServerSnapshot
  );

  const openNav = useCallback(() => {
    navStore.openNav();
  }, []);

  const closeNav = useCallback(() => {
    navStore.closeNav();
  }, []);

  const toggleNav = useCallback(() => {
    navStore.toggleNav();
  }, []);

  return {
    isOpen,
    isNavOpen: isOpen,
    openNav,
    closeNav,
    toggleNav,
  };
}
