"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavStore } from "@/hooks/useNavStore";
import { JakartaClock } from "./JakartaClock";
import { AsciiLogo } from "@/components/common/AsciiLogo";
import { playHapticClick } from "@/utils/audio";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLenis } from "@/components/common/SmoothScrollProvider";
import gsap from "gsap";

interface NavItem {
  id: string;
  num: string;
  label: string;
  href: string;
  sectorTag: string;
  glyph: string;
  description: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "home",
    num: "01",
    label: "HOME",
    href: "/",
    sectorTag: "SEC_01 // NEXUS",
    glyph: "⏣",
    description: "CORE OBSERVATORY & ARCHITECTURE",
  },
  {
    id: "work",
    num: "02",
    label: "WORK",
    href: "/work",
    sectorTag: "SEC_02 // ARTIFACTS",
    glyph: "◈",
    description: "ENGINEERING DOSSIERS & SYSTEMS",
  },
  {
    id: "contact",
    num: "03",
    label: "CONTACT",
    href: "/contact",
    sectorTag: "SEC_03 // UPLINK",
    glyph: "⎔",
    description: "DIRECT TRANSMISSION & FREQUENCIES",
  },
];

/**
 * KineticNavbarOverlay:
 * Cosmic Digital Brutalist Navigation Deck.
 * Features synchronized GSAP entrance animations (backdrop fade, monolith zoom-in, staggered cards)
 * and smooth exit animations when closed in-place without page navigation.
 */
export function KineticNavbarOverlay() {
  const { isNavOpen, closeNav } = useNavStore();
  const { stop: stopLenis, start: startLenis } = useLenis();
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);

  // Keep component mounted during GSAP exit animation
  const [isRendered, setIsRendered] = useState(isNavOpen);
  const isClosingRef = useRef(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const deckContainerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  // Exit Animation function (plays when closing on same page)
  const triggerExitAnimation = useCallback(
    (onComplete?: () => void) => {
      if (isClosingRef.current) return;
      isClosingRef.current = true;

      const backdrop = backdropRef.current;
      const deck = deckContainerRef.current;
      const cards = cardsContainerRef.current?.querySelectorAll(".nav-menu-card");

      if (!backdrop || !deck) {
        setIsRendered(false);
        isClosingRef.current = false;
        closeNav();
        onComplete?.();
        return;
      }

      gsap.killTweensOf([backdrop, deck, ...(cards || [])]);

      const tl = gsap.timeline({
        onComplete: () => {
          setIsRendered(false);
          isClosingRef.current = false;
          closeNav();
          onComplete?.();
        },
      });

      if (cards && cards.length > 0) {
        tl.to(cards, {
          opacity: 0,
          y: 18,
          scale: 0.98,
          duration: 0.2,
          stagger: 0.03,
          ease: "power2.in",
        });
      }

      tl.to(
        deck,
        {
          opacity: 0,
          y: 28,
          scale: 0.96,
          duration: 0.28,
          ease: "power3.inOut",
        },
        cards && cards.length > 0 ? "-=0.12" : 0
      ).to(
        backdrop,
        {
          opacity: 0,
          duration: 0.24,
          ease: "power2.in",
        },
        "-=0.18"
      );
    },
    [closeNav]
  );

  // Close handler for manual dismiss (ESC button, ESC key, or backdrop click)
  const handleClose = useCallback(() => {
    playHapticClick(480);
    triggerExitAnimation();
  }, [triggerExitAnimation]);

  // Click on a route item: immediate fast-close so Preloader curtain takes over seamlessly
  const handleLinkClick = useCallback(() => {
    playHapticClick(640);
    isClosingRef.current = true;
    setIsRendered(false);
    closeNav();
  }, [closeNav]);

  // Synchronize state when isNavOpen changes
  useEffect(() => {
    if (isNavOpen) {
      setIsRendered(true);
      isClosingRef.current = false;
    } else if (!isClosingRef.current && isRendered) {
      // If toggled off from external trigger (e.g. Header button), execute smooth exit
      triggerExitAnimation();
    }
  }, [isNavOpen, isRendered, triggerExitAnimation]);

  // Pathname change listener (auto-close without exit animation so preloader takes over)
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      setIsRendered(false);
      isClosingRef.current = false;
      closeNav();
    }
  }, [pathname, closeNav]);

  // GSAP Entrance Animation when overlay mounts
  useEffect(() => {
    if (!isRendered || isClosingRef.current) return;

    const backdrop = backdropRef.current;
    const deck = deckContainerRef.current;
    const cards = cardsContainerRef.current?.querySelectorAll(".nav-menu-card");

    if (!backdrop || !deck) return;

    gsap.killTweensOf([backdrop, deck, ...(cards || [])]);

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
    });

    tl.fromTo(
      backdrop,
      { opacity: 0 },
      { opacity: 1, duration: 0.35, ease: "power2.out" }
    ).fromTo(
      deck,
      { opacity: 0, y: 35, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.45 },
      "-=0.22"
    );

    if (cards && cards.length > 0) {
      tl.fromTo(
        cards,
        { opacity: 0, y: 24, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.07 },
        "-=0.28"
      );
    }
  }, [isRendered]);

  // Focus management, Escape key listener & Body scroll lock
  useEffect(() => {
    if (!isRendered) return;

    // Save invoking element for focus restoration upon exit
    triggerElementRef.current =
      (document.activeElement as HTMLElement) ||
      document.getElementById("main-nav-trigger");

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.code === "Escape") {
        e.preventDefault();
        handleClose();
        return;
      }

      // Focus trap logic
      if (e.key === "Tab" && overlayRef.current) {
        const focusableElements = overlayRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Lock body scroll & freeze background Lenis scroll loop
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    stopLenis();

    // Set initial focus to close button
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      startLenis();
      clearTimeout(timer);

      // Restore focus to invoking trigger button
      const trigger =
        triggerElementRef.current || document.getElementById("main-nav-trigger");
      trigger?.focus();
    };
  }, [isRendered, handleClose, stopLenis, startLenis]);

  if (!isRendered) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      id="kinetic-navbar-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu Deck"
      tabIndex={-1}
      data-lenis-prevent
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 select-none font-mono overflow-y-auto no-scrollbar"
      )}
    >
      {/* Dimmed Atmospheric Backdrop (Click outside to close with exit animation) */}
      <div
        ref={backdropRef}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity cursor-pointer"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Floating Monolith Navigation Deck Container */}
      <div
        ref={deckContainerRef}
        className="relative z-10 max-w-5xl w-full max-h-[92vh] bg-[#100d0e] border border-white/20 rounded-none shadow-[0_0_60px_rgba(0,0,0,0.95)] flex flex-col justify-between p-5 sm:p-8 overflow-y-auto no-scrollbar relative"
      >
        {/* Corner Reticle Brackets (Alien Monolith Deck) */}
        <span className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t-2 border-l-2 border-white/70 pointer-events-none" />
        <span className="absolute -top-[1px] -right-[1px] w-3 h-3 border-t-2 border-r-2 border-white/70 pointer-events-none" />
        <span className="absolute -bottom-[1px] -left-[1px] w-3 h-3 border-b-2 border-l-2 border-white/70 pointer-events-none" />
        <span className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b-2 border-r-2 border-white/70 pointer-events-none" />

        {/* Dithered Nebula Atmospheric Noise */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_20%,rgba(255,255,255,0.04),transparent_70%)]" />
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:16px_16px] opacity-70" />
        <div className="pointer-events-none absolute inset-0 z-0 opacity-20 mix-blend-screen bg-[radial-gradient(rgba(255,255,255,0.18)_1px,transparent_1px)] bg-[size:4px_4px]" />

        {/* Top Bar: Brand ASCII Anchor, Jakarta Clock & Brutalist Close Button */}
        <div className="w-full pb-4 sm:pb-6 border-b border-white/15 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              onClick={handleLinkClick}
              className="group inline-flex items-center justify-center select-none focus:outline-none"
              aria-label="Arthur Gregorius Pongoh — Home"
              title="Arthur Gregorius Pongoh — Home"
            >
              <AsciiLogo variant="header" animate3D={true} />
              <span className="sr-only">{"ARTHUR GvP // SYS.NAV"}</span>
            </Link>

            <div className="h-3 w-px bg-white/20" />

            {/* Live Clock & Sector Header */}
            <div className="flex items-center gap-2 text-[10px] sm:text-xs text-zinc-400 font-mono tracking-wider">
              <span className="text-zinc-500 hidden md:inline">[SECTOR_NAV]</span>
              <JakartaClock showSeconds={true} />
            </div>
          </div>

          {/* Brutalist Close Action Trigger */}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            aria-label="Close navigation overlay (Escape)"
            className="group relative flex items-center gap-2 px-3 py-1.5 bg-[#100d0e] border border-white/35 rounded-none hover:bg-white hover:text-black transition-all cursor-pointer text-xs uppercase font-bold tracking-widest"
          >
            {/* Micro Reticles */}
            <span className="absolute -top-[1px] -left-[1px] w-1 h-1 border-t border-l border-white/60 group-hover:border-black transition-colors" />
            <span className="absolute -top-[1px] -right-[1px] w-1 h-1 border-t border-r border-white/60 group-hover:border-black transition-colors" />
            <span className="absolute -bottom-[1px] -left-[1px] w-1 h-1 border-b border-l border-white/60 group-hover:border-black transition-colors" />
            <span className="absolute -bottom-[1px] -right-[1px] w-1 h-1 border-b border-r border-white/60 group-hover:border-black transition-colors" />

            <span className="text-[10px] tracking-widest font-mono">ESC</span>
            <span className="text-sm leading-none font-bold">✕</span>
          </button>
        </div>

        {/* Center Body: Alien Artifact Monolith Route Cards */}
        <div ref={cardsContainerRef} className="pt-6 sm:pt-8 pb-0 flex-1 flex flex-col justify-center relative z-10">
          <nav
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
            aria-label="Main Navigation"
          >
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" &&
                  Boolean(pathname && pathname.startsWith(item.href + "/")));

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={handleLinkClick}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "nav-menu-card group relative flex flex-col justify-between p-5 sm:p-6 min-h-[170px] sm:min-h-[190px]",
                    "border rounded-none transition-all duration-300 relative overflow-hidden select-none",
                    isActive
                      ? "border-white bg-white/[0.08] shadow-[0_0_24px_rgba(252,252,252,0.12)]"
                      : "border-white/20 bg-black/40 hover:border-white hover:bg-white/[0.04] hover:-translate-y-1"
                  )}
                >
                  {/* Corner Reticle Brackets on Card */}
                  <span className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t border-l border-white/40 group-hover:border-white transition-colors" />
                  <span className="absolute -top-[1px] -right-[1px] w-2 h-2 border-t border-r border-white/40 group-hover:border-white transition-colors" />
                  <span className="absolute -bottom-[1px] -left-[1px] w-2 h-2 border-b border-l border-white/40 group-hover:border-white transition-colors" />
                  <span className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b border-r border-white/40 group-hover:border-white transition-colors" />

                  {/* Giant Ambient Cosmic Object Glyph */}
                  <span className="absolute -bottom-4 -right-2 text-7xl sm:text-8xl font-mono text-white opacity-[0.03] group-hover:opacity-[0.10] transition-opacity select-none pointer-events-none">
                    {item.glyph}
                  </span>

                  {/* Top of Card: Sector Code + Glyph & Arrow */}
                  <div className="flex items-center justify-between relative z-10">
                    <span className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase">
                      {item.sectorTag}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs text-white opacity-60 group-hover:opacity-100 transition-opacity">
                        {item.glyph}
                      </span>
                      <ArrowUpRight
                        className={cn(
                          "w-3.5 h-3.5 transition-all duration-200",
                          isActive
                            ? "text-white filter drop-shadow-[0_0_6px_rgba(252,252,252,0.8)]"
                            : "text-zinc-500 group-hover:text-white group-hover:filter group-hover:drop-shadow-[0_0_8px_rgba(252,252,252,0.85)]"
                        )}
                      />
                    </div>
                  </div>

                  {/* Bottom of Card: Major Label & Telemetry Subtitle */}
                  <div className="flex flex-col gap-1 mt-6 relative z-10">
                    <div className="flex items-center gap-2">
                      {isActive && (
                        <span
                          className="w-1.5 h-1.5 rounded-none bg-white animate-pulse shadow-[0_0_8px_rgba(252,252,252,0.8)]"
                          title="Active Sector"
                        />
                      )}
                      <span
                        className={cn(
                          "text-2xl sm:text-3xl font-bold font-mono tracking-tight uppercase transition-colors",
                          isActive ? "text-white" : "text-zinc-200 group-hover:text-white"
                        )}
                      >
                        {item.label}
                      </span>
                    </div>
                    <p className="font-mono text-[9px] sm:text-[10px] tracking-wider text-zinc-500 uppercase mt-0.5 group-hover:text-zinc-400 transition-colors">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
