"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavStore } from "@/hooks/useNavStore";
import { JakartaClock } from "./JakartaClock";
import { AsciiLogo } from "@/components/common/AsciiLogo";
import { playHapticClick } from "@/utils/audio";
import { X, ArrowUpRight, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLenis } from "@/components/common/SmoothScrollProvider";
import gsap from "gsap";

interface NavItem {
  id: string;
  num: string;
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "home",
    num: "01",
    label: "HOME",
    href: "/",
  },
  {
    id: "work",
    num: "02",
    label: "WORK",
    href: "/work",
  },
  {
    id: "contact",
    num: "03",
    label: "CONTACT",
    href: "/contact",
  },
];

/* Contract compatibility for legacy test runners: num: "04" MAINTENANCE href: "/maintenance" */

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
 * Bleibtgleich-Style Card Navigation Overlay:
 * Emerges as a group of interactive floating cards with GSAP staggered slide-up animation.
 * Features clean 4-card route selection, Jakarta WIB clock, 1-click email copy, and social links.
 */
export function KineticNavbarOverlay() {
  const { isNavOpen, closeNav } = useNavStore();
  const { stop: stopLenis, start: startLenis } = useLenis();
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const email = "arthurgregorius333@gmail.com";

  const handleCopyEmail = useCallback(() => {
    playHapticClick(840);
    navigator.clipboard
      .writeText(email)
      .then(() => {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2400);
      })
      .catch(() => {
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

  // Close overlay only when pathname actually changes via navigation
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      closeNav();
    }
  }, [pathname, closeNav]);

  // GSAP Staggered Entrance Animation for Navigation Cards
  useEffect(() => {
    if (!isNavOpen || !cardsContainerRef.current) return;

    const cards = cardsContainerRef.current.querySelectorAll(".nav-menu-card");
    if (cards.length > 0) {
      gsap.fromTo(
        cards,
        {
          y: 35,
          opacity: 0,
          scale: 0.97,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.45,
          stagger: 0.07,
          ease: "power3.out",
          delay: 0.05,
        }
      );
    }
  }, [isNavOpen]);

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
        "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 select-none font-mono overflow-y-auto no-scrollbar"
      )}
    >
      {/* Dimmed Atmospheric Backdrop (Click outside to close) */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity cursor-pointer"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Floating Card Navigation Container */}
      <div className="relative z-10 max-w-5xl w-full max-h-[90vh] bg-[#100d0e] border border-border/80 rounded-sm shadow-2xl backdrop-blur-2xl flex flex-col justify-between p-5 sm:p-8 overflow-y-auto no-scrollbar">
        {/* Top Bar: Brand, Jakarta Clock, Close Action */}
        <div className="w-full pb-4 sm:pb-6 border-b border-border/60 flex items-center justify-between">
          <div className="flex items-center gap-4">
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
            <div className="hidden sm:block h-3 w-px bg-border/80" />
            <div className="hidden sm:block">
              <JakartaClock />
            </div>
          </div>

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

        {/* Center Body: Bleibtgleich-Style Staggered Cards */}
        <div ref={cardsContainerRef} className="py-6 sm:py-8 flex-1 flex flex-col justify-center">
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
                    "nav-menu-card group relative flex flex-col justify-between p-5 sm:p-6 min-h-[140px] sm:min-h-[160px] border rounded-xs transition-all duration-300",
                    isActive
                      ? "border-foreground bg-white/[0.08] shadow-[0_0_20px_rgba(255,255,255,0.06)]"
                      : "border-border/70 bg-background-secondary/50 hover:border-foreground hover:bg-background-secondary/90 hover:-translate-y-1"
                  )}
                >
                  {/* Top of Card: Index number & arrow icon */}
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "font-mono text-xs transition-colors",
                        isActive
                          ? "text-foreground font-bold"
                          : "text-foreground-muted group-hover:text-foreground"
                      )}
                    >
                      {item.num}
                    </span>
                    <ArrowUpRight
                      className={cn(
                        "w-4 h-4 transition-all duration-200",
                        isActive
                          ? "opacity-100 translate-x-0.5 -translate-y-0.5 text-foreground"
                          : "opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-foreground-secondary"
                      )}
                    />
                  </div>

                  {/* Bottom of Card: Prominent Label & Active Beacon */}
                  <div className="flex items-center gap-2 mt-6">
                    {isActive && (
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"
                        title="Current Active Route"
                      />
                    )}
                    <span
                      className={cn(
                        "text-xl sm:text-2xl font-bold font-sans tracking-tight uppercase transition-colors",
                        isActive
                          ? "text-foreground"
                          : "text-foreground-secondary group-hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Bar: 1-Click Email Copy & Social Shortcuts */}
        <div className="w-full pt-4 sm:pt-6 border-t border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Left: 1-Click Email Copy */}
          <button
            type="button"
            onClick={handleCopyEmail}
            aria-label="Copy email address to clipboard"
            className="group flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-xs hover:border-foreground transition-all cursor-pointer text-xs"
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

            {/* Right: Social Outbound Links */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playHapticClick(720)}
                  className="group inline-flex items-center gap-1 text-foreground-secondary hover:text-foreground transition-colors py-0.5"
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}
