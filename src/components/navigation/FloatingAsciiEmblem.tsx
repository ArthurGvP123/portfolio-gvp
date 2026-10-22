"use client";

import React from "react";
import { AsciiLogo } from "@/components/common/AsciiLogo";
import { useLenis } from "@/components/common/SmoothScrollProvider";
import { playHapticClick } from "@/utils/audio";
import { cn } from "@/lib/utils";

export interface FloatingAsciiEmblemProps {
  className?: string;
}

/**
 * FloatingAsciiEmblem:
 * Pure floating 3D rotating ASCII Art emblem at the bottom-right corner of the page.
 * Completely borderless, boxless, and textless — just the naked rotating ASCII emblem.
 * Smoothly scrolls to top on click.
 */
export function FloatingAsciiEmblem({ className }: FloatingAsciiEmblemProps) {
  const { scrollTo } = useLenis();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    playHapticClick(720);
    scrollTo(0, { duration: 1.2 });
  };

  return (
    <aside
      className={cn(
        "fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-40 pointer-events-auto",
        className
      )}
      aria-label="Arthur GvP Floating Emblem"
    >
      <button
        type="button"
        onClick={handleClick}
        aria-label="Arthur GvP Core Emblem — Return to top"
        title="Arthur GvP // Return to top"
        className={cn(
          "group relative flex items-center justify-center p-0 m-0 bg-transparent border-none outline-none",
          "cursor-pointer select-none focus:outline-none transition-transform active:scale-95",
          "filter drop-shadow-[0_0_12px_rgba(252,252,252,0.2)] hover:drop-shadow-[0_0_22px_rgba(252,252,252,0.5)]"
        )}
      >
        <AsciiLogo variant="floating" animate3D={true} />
      </button>
    </aside>
  );
}
