"use client";

import React from "react";
import Link from "next/link";
import { useNavStore } from "@/hooks/useNavStore";
import { playHapticClick } from "@/utils/audio";
import { cn } from "@/lib/utils";

export interface HeaderProps {
  className?: string;
}

/**
 * Sticky minimal 1-button header with brand mark ("ARTHUR GvP // SYS.ARCH")
 * and single menu button ("MENU +") that triggers the navbar overlay.
 */
export function Header({ className }: HeaderProps) {
  const { isNavOpen, toggleNav } = useNavStore();

  const handleMenuClick = () => {
    playHapticClick(720);
    toggleNav();
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 w-full",
        "bg-background/80 backdrop-blur-md border-b border-border transition-colors duration-200",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand Monogram Mark */}
        <Link
          href="/"
          className="group inline-flex items-center gap-2 select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
          aria-label="Arthur Gregorius Pongoh — Home"
          onClick={() => playHapticClick(520)}
        >
          <span className="w-2 h-2 rounded-full bg-foreground transition-transform group-hover:scale-125" />
          <span className="font-mono font-bold text-xs sm:text-sm tracking-tight text-foreground uppercase">
            ARTHUR GvP
          </span>
          <span className="font-mono text-[10px] sm:text-xs text-foreground-muted tracking-wider">
            {"// SYS.ARCH"}
          </span>
          <span
            className="hidden md:inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1"
            title="Systems Online"
          />
        </Link>

        {/* Single Menu Action Trigger */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            id="main-nav-trigger"
            onClick={handleMenuClick}
            aria-expanded={isNavOpen}
            aria-controls="kinetic-navbar-overlay"
            aria-label={isNavOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
            className={cn(
              "group relative inline-flex items-center gap-2 px-3.5 py-1.5 font-mono text-xs font-bold uppercase tracking-wider",
              "border border-border rounded-xs transition-all duration-200 cursor-pointer select-none",
              isNavOpen
                ? "bg-foreground text-background border-foreground shadow-[0_0_15px_rgba(255,255,255,0.25)]"
                : "bg-background-secondary/80 text-foreground hover:bg-foreground hover:text-background hover:border-foreground"
            )}
          >
            <span className="transition-transform group-hover:translate-x-0.5">
              {isNavOpen ? "CLOSE ×" : "MENU +"}
            </span>
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-colors",
                isNavOpen ? "bg-background" : "bg-emerald-400 group-hover:bg-background"
              )}
            />
          </button>
        </div>
      </div>
    </header>
  );
}
