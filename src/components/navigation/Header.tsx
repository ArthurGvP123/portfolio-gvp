"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavStore } from "@/hooks/useNavStore";
import { playHapticClick } from "@/utils/audio";
import { AsciiLogo } from "@/components/common/AsciiLogo";
import { cn } from "@/lib/utils";
import gsap from "gsap";

export interface HeaderProps {
  className?: string;
}

/**
 * Seamless Floating Header:
 * Floating transparent header without background or border.
 * Features 3D rotating ASCII Logo anchor on the left and minimalist "MENU / CLOSE" action on the right.
 * Implements "Instant Starlight Bloom" entrance animation:
 * Starts in dormant dark-grey state -> blooms into hyper-bright starlight with ethereal outer glow -> settles gracefully to baseline.
 */
export function Header({ className }: HeaderProps) {
  const { isNavOpen, toggleNav } = useNavStore();
  const pathname = usePathname();
  const prevPathnameRef = useRef<string | null>(null);

  const [displayText, setDisplayText] = useState<string>("MENU");
  const [isBloomDone, setIsBloomDone] = useState<boolean>(false);
  const [isLogoSpinning, setIsLogoSpinning] = useState<boolean>(false);

  const leftAnchorRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Instant Starlight Bloom Animation:
  // Starts dormant grey & stationary -> awakens to crisp white FIRST -> ignites into starlight bloom & outer glow -> settles -> logo begins 3D spin
  const triggerStarlightBloomAnimation = useCallback(() => {
    const left = leftAnchorRef.current;
    const button = menuButtonRef.current;
    if (!left || !button) return;

    const pres = left.querySelectorAll("pre");

    gsap.killTweensOf([left, button, ...Array.from(pres)]);

    // Ensure deterministic baseline dormant state before running timeline
    gsap.set(left, {
      opacity: 0.35,
      filter: "brightness(0.6) contrast(0.85) grayscale(1)",
    });
    gsap.set(button, {
      opacity: 0.35,
      filter: "brightness(0.6) contrast(0.85) grayscale(1)",
      boxShadow: "0 0 0px 0px rgba(0, 0, 0, 0)",
      borderColor: "rgba(255, 255, 255, 0.35)",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
    });
    if (pres.length > 0) {
      gsap.set(pres, {
        textShadow: "0 0 0px rgba(0,0,0,0)",
        filter: "brightness(1) contrast(1) drop-shadow(0 0 0px rgba(0,0,0,0)) drop-shadow(0 0 0px rgba(0,0,0,0)) drop-shadow(0 0 0px rgba(0,0,0,0))",
      });
    }

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
    });

    // =========================================================================
    // Phase 1: Awaken to Solid Crisp White FIRST (0.00s – 0.32s, NO outer glow yet)
    // The stationary ASCII logo and menu button awaken from dim grey into pure solid white.
    // =========================================================================
    tl.to(
      left,
      {
        opacity: 1,
        filter: "brightness(1) contrast(1) grayscale(0)",
        duration: 0.32,
        ease: "power2.out",
      },
      0
    );

    tl.to(
      button,
      {
        opacity: 1,
        filter: "brightness(1) contrast(1) grayscale(0)",
        duration: 0.32,
        ease: "power2.out",
      },
      0
    );

    // =========================================================================
    // Phase 2: Ignite / Menyala (0.34s – 0.58s)
    // Hyper-bright Starlight Bloom + Radiant Outer Glow on BOTH components!
    // Starts strictly AFTER the elements have turned solid white (at t = 0.34s).
    // - ASCII glyphs flare into dense outline glow hugging their exact silhouette.
    // - Menu button flares into luminous rectangular box-shadow glow + crisp white border!
    // =========================================================================
    if (pres.length > 0) {
      tl.to(
        pres,
        {
          textShadow:
            "0 0 4px #ffffff, 0 0 10px rgba(255,255,255,0.95), 0 0 18px rgba(255,255,255,0.85), 0 0 28px rgba(255,255,255,0.6)",
          filter:
            "brightness(2.4) contrast(1.15) drop-shadow(0 0 4px #ffffff) drop-shadow(0 0 10px rgba(255,255,255,0.9)) drop-shadow(0 0 18px rgba(255,255,255,0.5))",
          duration: 0.24,
          ease: "power2.inOut",
        },
        0.34
      );
    }

    tl.to(
      button,
      {
        filter: "brightness(2.2) contrast(1.15)",
        borderColor: "rgba(255, 255, 255, 1)",
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        boxShadow:
          "0 0 6px 2px rgba(255, 255, 255, 0.95), 0 0 14px 4px rgba(255, 255, 255, 0.70), 0 0 26px 6px rgba(255, 255, 255, 0.40)",
        duration: 0.24,
        ease: "power2.inOut",
      },
      0.34
    );

    // =========================================================================
    // Phase 3: Settle Gracefully back to Baseline Crisp White (0.58s – 1.04s)
    // The intense bloom and outer glow recede smoothly back into the white elements.
    // =========================================================================
    if (pres.length > 0) {
      tl.to(
        pres,
        {
          textShadow:
            "0 0 0px rgba(0,0,0,0), 0 0 0px rgba(0,0,0,0), 0 0 0px rgba(0,0,0,0), 0 0 0px rgba(0,0,0,0)",
          filter:
            "brightness(1) contrast(1) drop-shadow(0 0 0px rgba(0,0,0,0)) drop-shadow(0 0 0px rgba(0,0,0,0)) drop-shadow(0 0 0px rgba(0,0,0,0))",
          duration: 0.46,
          ease: "power3.out",
          onComplete: () => {
            gsap.set(pres, { clearProps: "textShadow,filter" });
            gsap.set(left, { clearProps: "filter,opacity" });
            setIsBloomDone(true);
            setIsLogoSpinning(true); // Phase 4: Begin 3D horizontal rotation!
          },
        },
        0.58
      );
    } else {
      tl.to(
        left,
        {
          opacity: 1,
          duration: 0.46,
          ease: "power3.out",
          onComplete: () => {
            gsap.set(left, { clearProps: "filter,opacity" });
            setIsBloomDone(true);
            setIsLogoSpinning(true);
          },
        },
        0.58
      );
    }

    tl.to(
      button,
      {
        filter: "brightness(1) contrast(1)",
        borderColor: "rgba(255, 255, 255, 0.35)",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        boxShadow: "0 0 0px 0px rgba(0, 0, 0, 0)",
        duration: 0.46,
        ease: "power3.out",
        onComplete: () => {
          gsap.set(button, {
            clearProps: "boxShadow,filter,opacity,borderColor,backgroundColor",
          });
        },
      },
      0.58
    );
  }, []);

  // Synchronize route transitions & bloom animation with Preloader curtain reveal
  useEffect(() => {
    // If route changed after initial mount, reset elements to dormant dim grey state
    if (prevPathnameRef.current !== null && prevPathnameRef.current !== pathname) {
      setIsBloomDone(false);
      setIsLogoSpinning(false);
      if (leftAnchorRef.current) {
        gsap.set(leftAnchorRef.current, {
          opacity: 0.35,
          filter: "brightness(0.6) contrast(0.85) grayscale(1)",
        });
        const pres = leftAnchorRef.current.querySelectorAll("pre");
        if (pres.length > 0) {
          gsap.set(pres, {
            textShadow: "0 0 0px rgba(0,0,0,0)",
            filter: "brightness(1) contrast(1) drop-shadow(0 0 0px rgba(0,0,0,0))",
          });
        }
      }
      if (menuButtonRef.current) {
        gsap.set(menuButtonRef.current, {
          opacity: 0.35,
          filter: "brightness(0.6) contrast(0.85) grayscale(1)",
          boxShadow: "0 0 0px 0px rgba(0, 0, 0, 0)",
          borderColor: "rgba(255, 255, 255, 0.35)",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
        });
      }
    }
    const isFirstVisit = prevPathnameRef.current === null;
    prevPathnameRef.current = pathname;

    let triggeredForThisRoute = false;

    const handleReveal = () => {
      if (!triggeredForThisRoute) {
        triggeredForThisRoute = true;
        triggerStarlightBloomAnimation();
      }
    };

    window.addEventListener("preloader:reveal", handleReveal);

    // Fallback timer: only triggers if preloader:reveal was never dispatched
    // 2.8s for initial load, 2.0s for subsequent route transitions
    const fallbackDelay = isFirstVisit ? 2800 : 2000;
    const fallbackTimer = setTimeout(() => {
      if (!triggeredForThisRoute) {
        triggeredForThisRoute = true;
        triggerStarlightBloomAnimation();
      }
    }, fallbackDelay);

    return () => {
      window.removeEventListener("preloader:reveal", handleReveal);
      clearTimeout(fallbackTimer);
    };
  }, [pathname, triggerStarlightBloomAnimation]);

  // Synchronize button text whenever isNavOpen changes
  useEffect(() => {
    setDisplayText(isNavOpen ? "CLOSE" : "MENU");
  }, [isNavOpen]);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    playHapticClick(720);
    toggleNav();
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 w-full bg-transparent border-none transition-colors duration-200 pointer-events-none",
        className
      )}
    >
      <div className="w-full px-4 sm:px-6 md:px-8 py-3 sm:py-4 flex items-center justify-between pointer-events-none">
        {/* Brand Anchor: 3D Rotating ASCII Art Emblem */}
        <Link
          href="/"
          className="pointer-events-auto group inline-flex items-center justify-center select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-white transition-transform active:scale-95 will-change-transform"
          aria-label="Arthur Gregorius Pongoh — Home"
          title="Arthur Gregorius Pongoh — Home"
          onClick={() => playHapticClick(520)}
        >
          <div
            ref={leftAnchorRef}
            style={
              isBloomDone
                ? undefined
                : {
                    opacity: 0.35,
                    filter: "brightness(0.6) contrast(0.85) grayscale(1)",
                  }
            }
            className="inline-flex items-center justify-center will-change-transform"
          >
            <AsciiLogo variant="header" animate3D={true} isSpinning={isLogoSpinning} />
          </div>
          {/* Machine-readable accessibility & contract moniker */}
          <span className="sr-only">ARTHUR GvP // SYS.ARCH</span>
        </Link>

        {/* Single Menu Action Trigger: Pure Text Button */}
        <div className="flex items-center gap-3 pointer-events-auto will-change-transform">
          <button
            ref={menuButtonRef}
            type="button"
            id="main-nav-trigger"
            style={
              isBloomDone
                ? undefined
                : {
                    opacity: 0.35,
                    filter: "brightness(0.6) contrast(0.85) grayscale(1)",
                    boxShadow: "0 0 0px 0px rgba(0, 0, 0, 0)",
                  }
            }
            onClick={handleMenuClick}
            aria-expanded={isNavOpen}
            aria-controls="kinetic-navbar-overlay"
            aria-label={isNavOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
            className={cn(
              "group relative inline-flex items-center justify-center px-3.5 py-1.5 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-widest min-w-[72px]",
              "border rounded-none transition-colors duration-200 cursor-pointer select-none",
              isNavOpen
                ? "bg-white text-black border-white shadow-[0_0_16px_rgba(252,252,252,0.3)]"
                : "bg-black/60 backdrop-blur-md border-white/35 text-white hover:bg-white hover:text-black hover:border-white shadow-[0_0_12px_rgba(0,0,0,0.5)]"
            )}
          >
            <span className="transition-transform group-hover:translate-x-0.5 tabular-nums">
              {displayText}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
