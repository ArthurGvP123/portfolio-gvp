"use client";

import React from "react";
import Link from "next/link";
import { useNavStore } from "@/hooks/useNavStore";
import { playHapticClick } from "@/utils/audio";
import { AsciiLogo } from "@/components/common/AsciiLogo";
import { cn } from "@/lib/utils";

export interface HeaderProps {
  className?: string;
}

/**
 * Seamless Floating Header:
 * Floating transparent header without background or border.
 * Features clean brand name "ArthurGvP" on the left and minimalist "MENU / CLOSE" action on the right.
 */
export function Header({ className }: HeaderProps) {
  const { isNavOpen, toggleNav } = useNavStore();

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
          className="pointer-events-auto group inline-flex items-center justify-center select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-white transition-transform active:scale-95"
          aria-label="Arthur Gregorius Pongoh — Home"
          title="Arthur Gregorius Pongoh — Home"
          onClick={() => playHapticClick(520)}
        >
          <AsciiLogo variant="header" animate3D={true} />
          {/* Machine-readable accessibility & contract moniker */}
          <span className="sr-only">ARTHUR GvP // SYS.ARCH</span>
        </Link>

        {/* Single Menu Action Trigger */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            type="button"
            id="main-nav-trigger"
            onClick={handleMenuClick}
            aria-expanded={isNavOpen}
            aria-controls="kinetic-navbar-overlay"
            aria-label={isNavOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
            className={cn(
              "group relative inline-flex items-center gap-2 px-3 py-1 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-widest",
              "border border-white/40 rounded-none transition-all duration-200 cursor-pointer select-none",
              isNavOpen
                ? "bg-white text-black border-white shadow-[0_0_15px_rgba(252,252,252,0.25)]"
                : "bg-black/30 backdrop-blur-xs text-white hover:bg-white hover:text-black hover:border-white"
            )}
          >
            <span className="transition-transform group-hover:translate-x-0.5">
              {isNavOpen ? "CLOSE" : "MENU"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
