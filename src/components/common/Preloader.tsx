"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

/**
 * Pure 3-phase mathematical curve for preloader counter acceleration.
 * Phase 1 (0 -> 0.40): 0% to 65% with power2.out
 * Phase 2 (0.40 -> 0.75): 65% to 88% with power1.inOut (shader/asset parsing)
 * Phase 3 (0.75 -> 1.00): 88% to 100% with power3.in (snappy completion)
 */
export function calculatePreloaderProgress(t: number): number {
  if (isNaN(t) || t <= 0) return 0;
  if (t >= 1) return 100;

  if (t <= 0.4) {
    const p = t / 0.4;
    const ease = 1 - Math.pow(1 - p, 2); // power2.out
    return Math.round(65 * ease);
  } else if (t <= 0.75) {
    const p = (t - 0.4) / 0.35;
    const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; // power1.inOut
    return Math.round(65 + 23 * ease);
  } else {
    const p = (t - 0.75) / 0.25;
    const ease = Math.pow(p, 3); // power3.in
    return Math.round(88 + 12 * ease);
  }
}

export interface PreloaderProps {
  onComplete?: () => void;
  minDuration?: number; // total duration in seconds, default 1.5s
}

export function Preloader({ onComplete, minDuration = 1.5 }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("[INITIALIZING CORE ENGINE]");
  const [isUnmounted, setIsUnmounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const topCurtainRef = useRef<HTMLDivElement>(null);
  const bottomCurtainRef = useRef<HTMLDivElement>(null);
  const headlineCharsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const titleWords = ["ARTHUR", "GREGORIUS", "PONGOH"];
  const subtitle = "CREATIVE TECHNOLOGIST & SYSTEM ARCHITECT";

  const triggerExitSequence = useCallback(() => {
    setIsExiting(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsUnmounted(true);
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      },
    });

    // Dual horizontal curtain wipe exit
    if (topCurtainRef.current && bottomCurtainRef.current) {
      tl.to(
        topCurtainRef.current,
        {
          yPercent: -100,
          duration: 0.7,
          ease: "power4.inOut",
        },
        0.1
      );
      tl.to(
        bottomCurtainRef.current,
        {
          yPercent: 100,
          duration: 0.7,
          ease: "power4.inOut",
        },
        0.1
      );
    } else if (containerRef.current) {
      tl.to(containerRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
      });
    }
  }, []);

  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setProgress(100);
      setStatusText("[SYSTEM READY]");
      if (onCompleteRef.current) onCompleteRef.current();
      setIsUnmounted(true);
      return;
    }

    const duration = Math.max(0.5, minDuration);
    const startTime = performance.now();
    let animFrameId: number;

    const tick = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const t = Math.min(1, elapsed / duration);
      const currentVal = calculatePreloaderProgress(t);

      setProgress(currentVal);

      if (currentVal < 40) {
        setStatusText("[INITIALIZING CORE ENGINE]");
      } else if (currentVal < 70) {
        setStatusText("[PARSING SHADERS & TYPOGRAPHY]");
      } else if (currentVal < 95) {
        setStatusText("[HYDRATING 3D SPHERE GEOMETRY]");
      } else {
        setStatusText("[SYSTEM READY — ALL SYSTEMS GO]");
      }

      if (t < 1) {
        animFrameId = requestAnimationFrame(tick);
      } else {
        triggerExitSequence();
      }
    };

    animFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [minDuration, triggerExitSequence]);

  // Kinetic typography entrance when mounted
  useEffect(() => {
    const chars = headlineCharsRef.current.filter(Boolean);
    if (chars.length > 0) {
      gsap.fromTo(
        chars,
        {
          y: "115%",
          rotate: 6,
          opacity: 0,
        },
        {
          y: "0%",
          rotate: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.03,
          ease: "power4.out",
          delay: 0.1,
        }
      );
    }
  }, []);

  if (isUnmounted) {
    return null;
  }

  let charIndexCounter = 0;

  return (
    <div
      ref={containerRef}
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio experience"
      className={cn(
        "fixed inset-0 z-50 flex flex-col justify-between overflow-hidden select-none",
        isExiting ? "pointer-events-none" : "pointer-events-auto"
      )}
    >
      {/* Top Curtain Slab */}
      <div
        ref={topCurtainRef}
        className="absolute top-0 left-0 right-0 h-1/2 bg-background border-b border-border/40 z-10 flex flex-col justify-between p-6 md:p-12"
      >
        <div className="flex items-center justify-between text-xs font-mono text-foreground-secondary">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-foreground animate-ping" />
            <span className="tracking-widest uppercase">[BOOTLOADER: V26.4]</span>
          </div>
          <div className="hidden sm:block uppercase tracking-wider text-foreground-muted">
            SWISS MODERNISM &bull; 3D WEBGL ENGINE
          </div>
        </div>

        {/* Masked Kinetic Split-Text Typography Reveal */}
        <div className="split-line-h1-mask overflow-hidden py-2">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter text-foreground flex flex-wrap gap-x-4">
            {titleWords.map((word, wIdx) => (
              <span key={wIdx} className="inline-block whitespace-nowrap overflow-hidden">
                {word.split("").map((ch) => {
                  const currIdx = charIndexCounter++;
                  return (
                    <span
                      key={currIdx}
                      ref={(el) => {
                        headlineCharsRef.current[currIdx] = el;
                      }}
                      className="inline-block transition-transform"
                    >
                      {ch}
                    </span>
                  );
                })}
              </span>
            ))}
          </h1>
          <p className="font-mono text-xs sm:text-sm text-foreground-secondary tracking-widest uppercase mt-2">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Bottom Curtain Slab */}
      <div
        ref={bottomCurtainRef}
        className="absolute bottom-0 left-0 right-0 h-1/2 bg-background border-t border-border/40 z-10 flex flex-col justify-between p-6 md:p-12"
      >
        {/* Monospace status tracker and progress bar */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between font-mono text-xs text-foreground-secondary">
            <span className="tracking-wider">{statusText}</span>
            <span className="text-foreground-muted">LATENCY: &lt;16ms</span>
          </div>

          {/* Hairline Progress Bar */}
          <div className="w-full h-0.5 bg-background-tertiary overflow-hidden">
            <div
              className="h-full bg-foreground transition-all duration-75 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Giant Monospace Numeric Counter */}
        <div className="flex items-end justify-between">
          <div className="font-mono text-xs text-foreground-muted hidden sm:block">
            <span>LOC: JAKARTA, ID</span>
            <br />
            <span>PORTFOLIO SPEC: BLEIBTGLEICH CALIBER</span>
          </div>

          <div className="flex items-baseline font-mono text-6xl sm:text-8xl md:text-9xl font-bold tracking-tighter text-foreground">
            <span className="tabular-nums">{progress.toString().padStart(3, "0")}</span>
            <span className="text-2xl sm:text-4xl text-foreground-muted font-normal ml-1">%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
