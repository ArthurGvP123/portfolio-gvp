"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { AsciiLogo } from "@/components/common/AsciiLogo";
import { cn } from "@/lib/utils";

/**
 * 3-Phase mathematical curve for Cosmic Preloader counter acceleration.
 * Phase 1 (0 -> 0.40): Probing Event Horizon (0% to 60%) with power2.out
 * Phase 2 (0.40 -> 0.75): Decrypting Artifacts (60% to 88%) with power1.inOut
 * Phase 3 (0.75 -> 1.00): Singularity Collapse (88% to 100%) with power3.in
 */
export function calculatePreloaderProgress(t: number): number {
  if (isNaN(t) || t <= 0) return 0;
  if (t >= 1) return 100;

  if (t <= 0.4) {
    const p = t / 0.4;
    const ease = 1 - Math.pow(1 - p, 2);
    return Math.round(60 * ease);
  } else if (t <= 0.75) {
    const p = (t - 0.4) / 0.35;
    const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    return Math.round(60 + 28 * ease);
  } else {
    const p = (t - 0.75) / 0.25;
    const ease = Math.pow(p, 3);
    return Math.round(88 + 12 * ease);
  }
}

export interface RouteMeta {
  sectorTag: string;
  kernelTitle: string;
  displayTitle: string;
  subtitle: string;
  recordId: string;
  sectorBadge: string;
  targetBuffer: string;
  centerGlyph: string;
  signalLockedText: string;
  logs: [string, string, string, string, string];
}

export function getRouteMeta(path: string): RouteMeta {
  const cleanPath = (path || "/").replace(/\/+$/, "") || "/";

  if (cleanPath.startsWith("/work")) {
    return {
      sectorTag: "02_WORK",
      kernelTitle: "[ ⏣ ARTIFACT_ARCHIVE_V2.0 ] // SECTOR: 02_WORK",
      displayTitle: "ENGINEERING ARTIFACTS",
      subtitle: "SOFTWARE ENGINEERING, AI & PRODUCTION DOSSIERS",
      recordId: "RECORD // CATALOG: 8_AUTHENTIC_PROJECTS // DEEP_SPACE",
      sectorBadge: "SECTOR_02 // SYSTEM CASE STUDIES & DEPLOYMENTS",
      targetBuffer: "[ SECTOR_02 // WORK_CATALOG ]",
      centerGlyph: "◈",
      signalLockedText: "SIGNAL: ARTIFACTS_UNLOCKED",
      logs: [
        "> QUERYING DEEP SPACE ARTIFACT REPOSITORY... [OK]",
        "> DECRYPTING COMPUTER VISION & BACKEND METRICS... [OK]",
        "> VERIFYING PRODUCTION ARCHITECTURE PROOFS... [OK]",
        "> ARTIFACT DOSSIERS COMPILED. PREPARING WORK CATALOG... [99%]",
        "> ARCHIVE UNLOCKED. DISPATCHING PROJECT DOSSIERS.",
      ],
    };
  }

  if (cleanPath.startsWith("/contact")) {
    return {
      sectorTag: "03_CONTACT",
      kernelTitle: "[ ⏣ TRANSMISSION_BEACON_V2.0 ] // SECTOR: 03_CONTACT",
      displayTitle: "TRANSMISSION BEACON",
      subtitle: "DIRECT FREQUENCY CHANNELS // EMAIL & SECURE DISPATCH",
      recordId: "RECORD // FREQ: 1420.405_MHZ // 1-CLICK_CHANNELS",
      sectorBadge: "SECTOR_03 // DIRECT COMMUNICATION HUB & CONTACT FORM",
      targetBuffer: "[ SECTOR_03 // TRANSMISSION_HUB ]",
      centerGlyph: "⎔",
      signalLockedText: "SIGNAL: BEACON_FREQ_LOCKED",
      logs: [
        "> SCANNING CARRIER FREQUENCIES (HYDROGEN LINE)... [OK]",
        "> ESTABLISHING DIRECT DISPATCH ROUTES (EMAIL/WHATSAPP)... [OK]",
        "> INITIALIZING ENCRYPTED ZOD FORM VALIDATION MATRIX... [OK]",
        "> CARRIER FREQUENCY SYNCHRONIZED AT 1420.405 MHz... [99%]",
        "> BEACON OPEN. READY FOR TRANSMISSION.",
      ],
    };
  }

  // Default to Home (/)
  return {
    sectorTag: "01_HOME",
    kernelTitle: "[ ⏣ SINGULARITY_KERNEL_V2.0 ] // SECTOR: 01_HOME",
    displayTitle: "ARTHUR GREGORIUS PONGOH",
    subtitle: "SOFTWARE ENGINEER // SYSTEMS ARCHITECT & AI",
    recordId: "RECORD // ID: GVP-2026 // SECTOR: NEXUS",
    sectorBadge: "SECTOR_01 // SYSTEM OVERVIEW & ENGINEERING ARCHITECTURE",
    targetBuffer: "[ SECTOR_01 // HOME_NEXUS ]",
    centerGlyph: "⏣",
    signalLockedText: "SIGNAL: NEXUS_LOCKED",
    logs: [
      "> INITIALIZING CORE OBSERVATORY SYSTEMS... [OK]",
      "> SYNCHRONIZING FULLSTACK, ARCHITECTURE & AI ARRAYS... [OK]",
      "> PROBING SINGULARITY EVENT HORIZON... [OK]",
      "> GRAVITATIONAL MATRIX STABILIZED. PREPARING HOME VIEW... [99%]",
      "> NEXUS SYSTEM ONLINE. WELCOME.",
    ],
  };
}

export interface PreloaderProps {
  onComplete?: () => void;
  minDuration?: number;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const pathname = usePathname();
  const prevPathnameRef = useRef<string | null>(null);

  const [currentRouteMeta, setCurrentRouteMeta] = useState<RouteMeta>(() =>
    getRouteMeta(pathname || "/")
  );
  const [progress, setProgress] = useState(0);
  const [isUnmounted, setIsUnmounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [scrambledTitle, setScrambledTitle] = useState(currentRouteMeta.displayTitle);

  const containerRef = useRef<HTMLDivElement>(null);
  const topCurtainRef = useRef<HTMLDivElement>(null);
  const bottomCurtainRef = useRef<HTMLDivElement>(null);
  const photonRingRef = useRef<SVGSVGElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const glyphChars = useMemo(() => "!<>-_\\/[]{}—=+*^?#________01", []);

  // Dynamic telemetry log stream based on progress thresholds
  const currentTelemetryLog = useMemo(() => {
    const logs = currentRouteMeta.logs;
    if (progress < 25) return logs[0];
    if (progress < 50) return logs[1];
    if (progress < 75) return logs[2];
    if (progress < 100) return logs[3];
    return logs[4];
  }, [progress, currentRouteMeta]);

  // Monospace block visualizer (20 blocks)
  const blockVisualizer = useMemo(() => {
    const totalBlocks = 20;
    const filledCount = Math.floor((progress / 100) * totalBlocks);
    const filled = "█".repeat(filledCount);
    const empty = "░".repeat(Math.max(0, totalBlocks - filledCount));
    return `[${filled}${empty}]`;
  }, [progress]);

  // Trigger curtain wipe exit
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

    if (topCurtainRef.current && bottomCurtainRef.current) {
      tl.to(
        topCurtainRef.current,
        {
          yPercent: -100,
          duration: 0.7,
          ease: "power4.inOut",
        },
        0.05
      );
      tl.to(
        bottomCurtainRef.current,
        {
          yPercent: 100,
          duration: 0.7,
          ease: "power4.inOut",
        },
        0.05
      );

      // Dispatch event as curtains have fully split open to expose header bloom to the user
      tl.call(
        () => {
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("preloader:reveal"));
          }
        },
        [],
        0.65
      );
    } else if (containerRef.current) {
      tl.to(containerRef.current, {
        opacity: 0,
        duration: 0.45,
        ease: "power2.inOut",
      });
      tl.call(
        () => {
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("preloader:reveal"));
          }
        },
        [],
        0.2
      );
    }
  }, []);

  // Trigger kinetic text scramble
  const runScrambleAnimation = useCallback(
    (target: string) => {
      let iteration = 0;
      const interval = setInterval(() => {
        setScrambledTitle(
          target
            .split("")
            .map((letter, index) => {
              if (letter === " ") return " ";
              if (index < iteration) {
                return target[index];
              }
              return glyphChars[Math.floor(Math.random() * glyphChars.length)];
            })
            .join("")
        );

        if (iteration >= target.length) {
          clearInterval(interval);
        }
        iteration += 1 / 2;
      }, 25);

      return () => clearInterval(interval);
    },
    [glyphChars]
  );

  // Main animation runner triggered when pathname is initialized or changes to Home, Work, or Contact
  useEffect(() => {
    const cleanPath = (pathname || "/").replace(/\/+$/, "") || "/";
    const isSupportedRoute =
      cleanPath === "/" || cleanPath.startsWith("/work") || cleanPath.startsWith("/contact");

    // If already initialized and pathname hasn't changed or is unsupported, skip
    if (!isSupportedRoute) {
      setIsUnmounted(true);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("preloader:reveal"));
      }
      return;
    }

    if (prevPathnameRef.current === cleanPath) {
      return;
    }

    const isFirstLoad = prevPathnameRef.current === null;
    prevPathnameRef.current = cleanPath;

    // Check user preference for reduced motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setProgress(100);
      if (onCompleteRef.current) onCompleteRef.current();
      setIsUnmounted(true);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("preloader:reveal"));
      }
      return;
    }

    // Update metadata to target route
    const meta = getRouteMeta(cleanPath);
    setCurrentRouteMeta(meta);

    // Reset curtains to closed state
    setIsExiting(false);
    setIsUnmounted(false);
    setProgress(0);

    if (topCurtainRef.current && bottomCurtainRef.current) {
      gsap.set(topCurtainRef.current, { yPercent: 0 });
      gsap.set(bottomCurtainRef.current, { yPercent: 0 });
    }

    // Trigger text scramble for target title
    const stopScramble = runScrambleAnimation(meta.displayTitle);

    // Duration: 1.25s for initial visit, 0.9s for subsequent route switches for snappy navigation
    const duration = isFirstLoad ? 1.25 : 0.9;
    const startTime = performance.now();
    let animFrameId: number;

    const tick = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const t = Math.min(1, elapsed / duration);
      const currentVal = calculatePreloaderProgress(t);

      setProgress(currentVal);

      if (t < 1) {
        animFrameId = requestAnimationFrame(tick);
      } else {
        triggerExitSequence();
      }
    };

    animFrameId = requestAnimationFrame(tick);

    return () => {
      stopScramble();
      cancelAnimationFrame(animFrameId);
    };
  }, [pathname, runScrambleAnimation, triggerExitSequence]);

  // Infinite slow rotation for photon ring
  useEffect(() => {
    if (!photonRingRef.current) return;
    const tween = gsap.to(photonRingRef.current, {
      rotation: 360,
      duration: 12,
      ease: "none",
      repeat: -1,
    });
    return () => {
      tween.kill();
    };
  }, []);

  // Ensure curtains are always at closed baseline (yPercent: 0) whenever unmounted status resets to false
  useEffect(() => {
    if (!isUnmounted && topCurtainRef.current && bottomCurtainRef.current) {
      gsap.set(topCurtainRef.current, { yPercent: 0 });
      gsap.set(bottomCurtainRef.current, { yPercent: 0 });
    }
  }, [isUnmounted]);

  if (isUnmounted) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      role="status"
      aria-live="polite"
      aria-label={`Initializing ${currentRouteMeta.displayTitle} sector`}
      className={cn(
        "fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden select-none bg-black font-mono",
        isExiting ? "pointer-events-none" : "pointer-events-auto"
      )}
    >
      {/* Top Curtain Slab (Cosmic Void Header & Telemetry) */}
      <div
        ref={topCurtainRef}
        className="absolute top-0 left-0 right-0 h-1/2 bg-black border-b border-zinc-800/80 z-10 flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden"
      >
        {/* Dithered Nebula Atmospheric Layers */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_70%,rgba(255,255,255,0.06),transparent_75%)]" />
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:18px_18px] opacity-70" />
        <div className="pointer-events-none absolute inset-0 z-0 opacity-20 mix-blend-screen bg-[radial-gradient(rgba(255,255,255,0.18)_1px,transparent_1px)] bg-[size:4px_4px]" />

        {/* Top Telemetry Status Bar */}
        <div className="relative z-10 flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-900 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-white font-bold tracking-widest uppercase text-[11px] sm:text-xs">
              {currentRouteMeta.kernelTitle}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-[10px] tracking-widest uppercase text-zinc-500">
            <span>FREQ: 1420.405 MHz</span>
            <span>NOISE: DITHER_STIPPLE</span>
            <span className="text-zinc-300">ANOMALY: 0x7F</span>
          </div>
        </div>

        {/* Centerpiece: Decrypted Route Identity & Photon Ring Motif */}
        <div className="relative z-10 my-auto flex flex-col sm:flex-row items-center gap-6 sm:gap-8 pt-4">
          {/* Black Hole Photon Ring Emblem */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 flex items-center justify-center">
            {/* Ambient Nebula Glow Behind Singularity */}
            <div className="absolute inset-[-12px] rounded-full bg-white/5 blur-md pointer-events-none" />

            <svg
              ref={photonRingRef}
              viewBox="0 0 100 100"
              className="w-full h-full text-zinc-500 relative z-10"
            >
              {/* Outer Dashed Orbit */}
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeDasharray="4 6"
              />
              {/* Event Horizon Photon Line */}
              <circle
                cx="50"
                cy="50"
                r="34"
                fill="none"
                stroke="rgba(255, 255, 255, 0.85)"
                strokeWidth="1.5"
              />
              {/* Singularity Core */}
              <circle cx="50" cy="50" r="22" fill="#100d0e" stroke="#27272a" strokeWidth="1" />
            </svg>
            <span className="absolute z-20 text-xs text-white font-bold tracking-tighter">
              {currentRouteMeta.centerGlyph}
            </span>
          </div>

          {/* Scrambled Route Name & Sector Subtitle */}
          <div className="flex flex-col text-center sm:text-left relative z-10">
            <div className="text-[10px] tracking-widest text-zinc-500 uppercase mb-1">
              {currentRouteMeta.recordId}
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase font-mono">
              {scrambledTitle}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 tracking-[0.2em] uppercase mt-1 font-mono">
              {currentRouteMeta.subtitle}
            </p>
          </div>
        </div>

        {/* Telemetry Log Stream */}
        <div className="relative z-10 text-[11px] text-zinc-400 tracking-wider truncate py-1">
          <span className="text-white font-bold">{currentTelemetryLog}</span>
        </div>
      </div>

      {/* Bottom Curtain Slab (Counter & Progress Matrix) */}
      <div
        ref={bottomCurtainRef}
        className="absolute bottom-0 left-0 right-0 h-1/2 bg-black border-t border-zinc-800/80 z-10 flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden"
      >
        {/* Dithered Nebula Atmospheric Layers */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_30%,rgba(255,255,255,0.06),transparent_75%)]" />
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:18px_18px] opacity-70" />
        <div className="pointer-events-none absolute inset-0 z-0 opacity-20 mix-blend-screen bg-[radial-gradient(rgba(255,255,255,0.18)_1px,transparent_1px)] bg-[size:4px_4px]" />

        {/* Progress Bar & Block Visualizer */}
        <div className="relative z-10 flex flex-col gap-3 pt-4">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="tracking-widest uppercase text-zinc-500">
              BUFFER: {blockVisualizer}
            </span>
            <span className="tracking-widest text-zinc-300">
              {progress < 100
                ? "CALIBRATING SECTOR..."
                : currentRouteMeta.signalLockedText}
            </span>
          </div>

          {/* Hairline Starlight Progress Track */}
          <div className="w-full h-[2px] bg-zinc-900 overflow-hidden relative">
            <div
              className="h-full bg-white transition-all duration-75 ease-out shadow-[0_0_12px_rgba(255,255,255,0.6)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Massive Space Mono Numeric Readout & Mobile ASCII Emblem */}
        <div className="relative z-10 flex items-end justify-between mt-auto">
          {/* Desktop Left: Telemetry & ASCII Art */}
          <div className="hidden sm:flex flex-col gap-2.5">
            {/* Arthur GvP Personal Emblem ASCII Art */}
            <div className="flex items-center gap-3">
              <AsciiLogo
                variant="preloader"
                className="text-zinc-500 opacity-85"
              />
              <div className="hidden md:flex flex-col text-[8.5px] font-mono text-zinc-600 tracking-wider">
                <span className="text-zinc-400 font-bold">[EMBLEM: GVP_CORE]</span>
                <span>STATUS: CALIBRATED</span>
                <span>TELEMETRY: ASCII_MATRIX</span>
              </div>
            </div>

            <div className="flex flex-col text-[10px] text-zinc-600 tracking-widest uppercase">
              <span>DEEP SPACE TELEMETRY</span>
              <span>SYSTEM: {currentRouteMeta.sectorBadge}</span>
              <span>BUFFER: {currentRouteMeta.targetBuffer}</span>
            </div>
          </div>

          {/* Left on Mobile / Right on Desktop: Percentage Counter */}
          <div className="flex items-baseline font-mono text-7xl sm:text-9xl md:text-[10rem] font-bold tracking-tighter text-white select-none">
            <span className="tabular-nums">{progress.toString().padStart(3, "0")}</span>
            <span className="text-2xl sm:text-4xl text-zinc-600 font-normal ml-2">%</span>
          </div>

          {/* Mobile Right: Pure ASCII Art Logo (no extra text) */}
          <div className="sm:hidden flex items-end justify-end shrink-0 pb-1.5" aria-hidden="true">
            <AsciiLogo
              variant="preloader"
              className="text-zinc-400 opacity-90"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
