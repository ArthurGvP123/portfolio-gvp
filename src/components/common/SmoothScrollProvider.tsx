"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";

interface SmoothScrollContextValue {
  lenis: Lenis | null;
  scrollTo: (target: number | string | HTMLElement, options?: { offset?: number; immediate?: boolean; duration?: number }) => void;
  stop: () => void;
  start: () => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  lenis: null,
  scrollTo: () => {},
  stop: () => {},
  start: () => {},
});

export function useLenis() {
  return useContext(SmoothScrollContext);
}

export interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

/**
 * Global SmoothScrollProvider configuring Lenis 1.1.20.
 * Synchronizes Lenis animation loop directly to GSAP ticker:
 *   gsap.ticker.add((time) => lenis.raf(time * 1000));
 *   gsap.ticker.lagSmoothing(0);
 * Ensures deterministic teardown on component unmount and SSR safety.
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    // Initialize Lenis with Swiss brutalist exponential deceleration
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1.8,
      wheelMultiplier: 1.0,
      autoResize: true,
    });

    lenisRef.current = lenis;
    setLenisInstance(lenis);

    // Direct GSAP Ticker synchronization: convert seconds to milliseconds
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Cleanup on unmount
    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
      setLenisInstance(null);
    };
  }, []);

  // Deterministic scroll reset on route change
  useEffect(() => {
    if (lenisRef.current) {
      if (typeof window !== "undefined" && window.location.hash) {
        const targetEl = document.querySelector(window.location.hash);
        if (targetEl) {
          lenisRef.current.scrollTo(targetEl as HTMLElement, { immediate: true });
          return;
        }
      }
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  const scrollTo = useCallback((
    target: number | string | HTMLElement,
    options?: { offset?: number; immediate?: boolean; duration?: number }
  ) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, options);
    } else if (typeof window !== "undefined") {
      if (typeof target === "number") {
        window.scrollTo({ top: target, behavior: options?.immediate ? "auto" : "smooth" });
      } else if (typeof target === "string") {
        const el = document.querySelector(target);
        el?.scrollIntoView({ behavior: options?.immediate ? "auto" : "smooth" });
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: options?.immediate ? "auto" : "smooth" });
      }
    }
  }, []);

  const stop = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.stop();
    }
  }, []);

  const start = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.start();
    }
  }, []);

  const value = useMemo(
    () => ({ lenis: lenisInstance, scrollTo, stop, start }),
    [lenisInstance, scrollTo, stop, start]
  );

  return (
    <SmoothScrollContext.Provider value={value}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
