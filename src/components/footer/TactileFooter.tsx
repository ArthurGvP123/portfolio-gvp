"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { useLenis } from "@/components/common/SmoothScrollProvider";
import { ArrowUp, ArrowUpRight, Copy, Check, MessageSquare } from "lucide-react";
import { playHapticClick } from "@/utils/audio";

const SOCIAL_LINKS = [
  { label: "GITHUB", url: "https://github.com/ArthurGvP123" },
  {
    label: "LINKEDIN",
    url: "https://www.linkedin.com/in/arthur-gregorius-pongoh-125322248",
  },
  { label: "INSTAGRAM", url: "https://www.instagram.com/arthurgvp" },
];

export function TactileFooter() {
  const { scrollTo } = useLenis();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const email = "arthurgregorius333@gmail.com";

  const handleScrollToTop = () => {
    playHapticClick(640);
    scrollTo(0, { immediate: false, duration: 1.2 });
  };

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

  return (
    <footer className="w-full mt-24 border-t border-border pt-12 pb-16 font-mono select-none">
      {/* Clean Call-to-Action Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-border/60">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Left: Headline & Concise Subtitle */}
          <div className="max-w-xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-sans tracking-tight text-foreground uppercase">
              Let&apos;s build something together.
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-foreground-secondary leading-relaxed">
              Open for systems engineering, architectural advisory, and technical collaboration.
            </p>
          </div>

          {/* Right: Direct Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Direct Contact Page Link */}
            <Link
              href="/contact"
              onClick={() => playHapticClick(720)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background font-bold text-xs uppercase tracking-wider rounded-xs hover:opacity-90 transition-opacity"
            >
              <span>Get in Touch</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            {/* Direct WhatsApp CTA */}
            <a
              href="https://wa.me/62895325605798"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playHapticClick(720)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-background-secondary border border-border text-foreground font-semibold text-xs uppercase tracking-wider rounded-xs hover:border-foreground transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp</span>
            </a>

            {/* Quick 1-Click Copy Email */}
            <button
              type="button"
              onClick={handleCopyEmail}
              aria-label="Copy email address"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-background-secondary border border-border text-foreground text-xs rounded-xs hover:border-foreground transition-colors cursor-pointer"
            >
              {copiedEmail ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-foreground-muted" />
              )}
              <span className="font-semibold">{email}</span>
            </button>
          </div>
        </div>

        {/* Social channels */}
        <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-foreground-secondary">
          <span className="text-[10px] uppercase text-foreground-muted tracking-wider">Connect:</span>
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playHapticClick(640)}
              className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <span>{link.label}</span>
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </a>
          ))}
        </div>
      </div>

      {/* Lower Bar: Copyright & Scroll to Top */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex items-center justify-between text-xs text-foreground-secondary">
        <div>
          <span className="font-bold text-foreground">ARTHUR GREGORIUS PONGOH</span>
          <span className="mx-2 text-foreground-muted">&bull;</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>

        {/* Scroll to Top Trigger */}
        <button
          type="button"
          onClick={handleScrollToTop}
          aria-label="Scroll back to top of page"
          className="group flex items-center gap-2 px-3.5 py-1.5 border border-border bg-background-secondary rounded-xs hover:bg-foreground hover:text-background transition-all duration-200 cursor-pointer"
        >
          <span className="text-[11px] tracking-wider uppercase font-bold">TOP</span>
          <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </footer>
  );
}
