"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavStore } from "@/hooks/useNavStore";
import { JakartaClock } from "./JakartaClock";
import { playHapticClick } from "@/utils/audio";
import { X, ArrowUpRight, Copy, Check, Radio, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLenis } from "@/components/common/SmoothScrollProvider";

interface NavItem {
  id: string;
  num: string;
  label: string;
  href: string;
  desc: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "home",
    num: "01",
    label: "HOME",
    href: "/",
    desc: "Index & Architectural Foundation",
  },
  {
    id: "work",
    num: "02",
    label: "WORK",
    href: "/work",
    desc: "8+ Verified Projects & 3D WebGL Sphere",
  },
  {
    id: "contact",
    num: "03",
    label: "CONTACT",
    href: "/contact",
    desc: "Direct Transmission & 3D Obsidian Monolith",
  },
  {
    id: "maintenance",
    num: "04",
    label: "MAINTENANCE",
    href: "/maintenance",
    desc: "Standby Telemetry & System Diagnostics",
  },
];

const SOCIAL_LINKS = [
  { label: "GITHUB", url: "https://github.com/ArthurGvP123" },
  {
    label: "LINKEDIN",
    url: "https://www.linkedin.com/in/arthur-gregorius-pongoh-125322248",
  },
  { label: "WHATSAPP", url: "https://wa.me/62895325605798" },
  { label: "INSTAGRAM", url: "https://www.instagram.com/arthurgvp" },
];

/**
 * KineticNavbarOverlay: Fullscreen overlay navigation with numbered routes,
 * live Jakarta WIB clock, status beacon, 1-click email copy, focus trap, and Escape key handling.
 */
export function KineticNavbarOverlay() {
  const { isNavOpen, closeNav } = useNavStore();
  const { stop: stopLenis, start: startLenis } = useLenis();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const email = "arthurgregorius333@gmail.com";

  const handleCopyEmail = useCallback(() => {
    playHapticClick(840);
    navigator.clipboard.writeText(email).then(() => {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2400);
    }).catch(() => {
      // Fallback
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2400);
    });
  }, [email]);

  const handleLinkClick = useCallback(() => {
    playHapticClick(640);
    closeNav();
  }, [closeNav]);

  const handleClose = useCallback(() => {
    playHapticClick(480);
    closeNav();
  }, [closeNav]);

  // Close overlay on route changes (e.g. browser back/forward navigation)
  useEffect(() => {
    if (isNavOpen) {
      closeNav();
    }
  }, [pathname, isNavOpen, closeNav]);

  // Focus management, Escape key listener & Body scroll lock
  useEffect(() => {
    if (!isNavOpen) return;

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
  }, [isNavOpen, handleClose, stopLenis, startLenis]);

  if (!isNavOpen) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      id="kinetic-navbar-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
      tabIndex={-1}
      data-lenis-prevent
      className={cn(
        "fixed inset-0 z-50 flex flex-col justify-between",
        "bg-[#050505]/95 backdrop-blur-2xl text-foreground font-mono select-none",
        "transition-all duration-300 overflow-y-auto no-scrollbar"
      )}
    >
      {/* Top Bar: Brand, Jakarta Clock, Close Action */}
      <div className="w-full border-b border-border px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/"
            onClick={handleLinkClick}
            className="flex items-center gap-2 group text-xs sm:text-sm font-bold uppercase tracking-wider"
          >
            <span className="w-2 h-2 rounded-full bg-white group-hover:scale-125 transition-transform" />
            <span>ARTHUR GvP</span>
            <span className="text-foreground-muted text-[10px] sm:text-xs">
              {"// SYS.NAV"}
            </span>
          </Link>

          <div className="hidden md:block h-3 w-px bg-border" />

          {/* Real-time Asia/Jakarta Clock */}
          <div className="hidden sm:block">
            <JakartaClock />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-background-secondary border border-border rounded-xs text-[10px] tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-foreground-secondary">AVAILABLE Q2/Q3 &apos;26</span>
          </div>

          {/* Close Button */}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            aria-label="Close navigation overlay (Escape)"
            className="group flex items-center gap-2 px-3 py-1.5 bg-background-secondary border border-border rounded-xs hover:bg-foreground hover:text-background transition-colors cursor-pointer text-xs uppercase font-bold"
          >
            <span className="text-[11px] tracking-widest font-mono">ESC</span>
            <X className="w-4 h-4 transition-transform group-hover:rotate-90" />
          </button>
        </div>
      </div>

      {/* Center Body: Massive Numbered Route Links */}
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12 flex-1 flex flex-col justify-center">
        <nav className="flex flex-col gap-3 sm:gap-4" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && Boolean(pathname && pathname.startsWith(item.href + "/")));

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={handleLinkClick}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group relative flex flex-col sm:flex-row sm:items-baseline justify-between py-3 sm:py-5 border-b transition-all duration-200",
                  isActive
                    ? "border-foreground/80 bg-white/[0.02]"
                    : "border-border/60 hover:border-foreground/80"
                )}
              >
                <div className="flex items-baseline gap-4 sm:gap-8">
                  {/* Index Numeral */}
                  <span
                    className={cn(
                      "font-mono text-xs sm:text-sm transition-colors",
                      isActive
                        ? "text-foreground font-bold"
                        : "text-foreground-muted group-hover:text-foreground"
                    )}
                  >
                    {item.num}
                  </span>

                  {/* Massive Kinetic Label */}
                  <span
                    className={cn(
                      "text-3xl sm:text-5xl lg:text-6xl font-bold font-sans tracking-tighter uppercase transition-transform duration-200",
                      isActive
                        ? "text-foreground translate-x-2"
                        : "text-foreground group-hover:translate-x-2"
                    )}
                  >
                    {item.label}
                  </span>
                </div>

                {/* Descriptor & Outbound Indicator */}
                <div className="flex items-center gap-3 mt-1 sm:mt-0 text-foreground-secondary group-hover:text-foreground">
                  {isActive && (
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"
                      title="Current Active Route"
                    />
                  )}
                  <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider">
                    {item.desc}
                  </span>
                  <ArrowUpRight
                    className={cn(
                      "w-4 h-4 sm:w-5 sm:h-5 transition-all",
                      isActive
                        ? "opacity-100 translate-x-0.5 -translate-y-0.5 text-foreground"
                        : "opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    )}
                  />
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Bar: Quick Copy Email, Coordinates, Social Shortcuts */}
      <div className="w-full border-t border-border px-4 sm:px-8 py-6 bg-background-secondary/40">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left: 1-Click Email Copy Trigger */}
          <div className="md:col-span-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              type="button"
              onClick={handleCopyEmail}
              aria-label="Copy email address to clipboard"
              className="group flex items-center gap-2.5 px-3 py-2 bg-background border border-border rounded-xs hover:border-foreground transition-all cursor-pointer text-xs"
            >
              {copiedEmail ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-foreground-muted group-hover:text-foreground transition-colors" />
              )}
              <span className="font-mono text-foreground font-semibold">
                {email}
              </span>
              <span className="text-[10px] text-foreground-muted uppercase tracking-wider ml-1">
                {copiedEmail ? "[COPIED!]" : "[COPY]"}
              </span>
            </button>
          </div>

          {/* Middle: Live Jakarta Telemetry (Mobile Fallback) */}
          <div className="md:col-span-3 flex items-center gap-2 text-[10px] text-foreground-muted sm:hidden">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <JakartaClock />
          </div>

          {/* Right: Social & Code Outbound Links */}
          <div className="md:col-span-7 flex flex-wrap items-center justify-start md:justify-end gap-4 text-xs font-mono">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playHapticClick(720)}
                className="group inline-flex items-center gap-1 text-foreground-secondary hover:text-foreground transition-colors py-1"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
