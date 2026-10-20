"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PRIMARY_EMAIL, CONTACT_CHANNELS } from "@/data/contacts";
import { ArrowUpRight, Copy, Check, Mail, MessageCircle } from "lucide-react";
import { playHapticClick } from "@/utils/audio";

export function HomeCTASection() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    playHapticClick(960);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(PRIMARY_EMAIL);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } else {
        window.location.href = `mailto:${PRIMARY_EMAIL}`;
      }
    } catch {
      window.location.href = `mailto:${PRIMARY_EMAIL}`;
    }
  };

  const getChannelIcon = (iconName: string) => {
    switch (iconName) {
      case "Linkedin":
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
          </svg>
        );
      case "Github":
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
        );
      case "MessageCircle":
        return <MessageCircle className="w-4 h-4" />;
      case "Instagram":
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        );
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  return (
    <section className="relative w-full py-20 md:py-32 bg-background border-b border-border overflow-hidden">
      {/* Precision Crosshairs in Corners */}
      <div className="absolute top-2 left-2 pointer-events-none text-foreground-muted text-[10px] font-mono leading-none select-none opacity-40">
        +
      </div>
      <div className="absolute top-2 right-2 pointer-events-none text-foreground-muted text-[10px] font-mono leading-none select-none opacity-40">
        +
      </div>
      <div className="absolute bottom-2 left-2 pointer-events-none text-foreground-muted text-[10px] font-mono leading-none select-none opacity-40">
        +
      </div>
      <div className="absolute bottom-2 right-2 pointer-events-none text-foreground-muted text-[10px] font-mono leading-none select-none opacity-40">
        +
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-border bg-background-secondary/60 rounded-sm p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          {/* Subtle Ambient Radial Lighting */}
          <div
            className="absolute top-0 right-0 w-[450px] h-[300px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-foreground-secondary">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>COMMUNICATION FREQUENCY OPEN</span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.05] uppercase">
              Ready to construct <br />
              the next breakthrough?
            </h2>

            <p className="text-sm sm:text-base text-foreground-secondary leading-relaxed">
              Available for fullstack systems engineering, deep learning vision models, high-performance web applications, and technical consulting.
            </p>

            {/* Action Row: 1-Click Email Copy & Transmission Link */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="group relative inline-flex items-center justify-between sm:justify-center gap-3 px-6 py-4 bg-foreground text-background font-mono text-xs uppercase tracking-widest font-bold border border-foreground hover:bg-background hover:text-foreground transition-all duration-300"
                aria-label="Copy primary email to clipboard"
              >
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{copied ? "EMAIL ADDRESS COPIED" : PRIMARY_EMAIL}</span>
                </span>
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4 text-background/60 group-hover:text-foreground" />
                )}
              </button>

              <Link
                href="/contact"
                onClick={() => playHapticClick(920)}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-background-tertiary border border-border hover:border-foreground/60 text-foreground font-mono text-xs uppercase tracking-widest font-semibold transition-colors rounded-xs"
              >
                <span>OPEN CONTACT HUB</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Transmission Channels Bar */}
            <div className="pt-8 border-t border-border/60">
              <span className="font-mono text-[10px] uppercase text-foreground-muted tracking-wider block mb-3">
                DIRECT TRANSMISSION CHANNELS:
              </span>

              <div className="flex flex-wrap items-center gap-3">
                {CONTACT_CHANNELS.map((ch) => (
                  <a
                    key={ch.platform}
                    href={ch.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playHapticClick(880)}
                    className="inline-flex items-center gap-2 px-3 py-2 border border-border/80 bg-background/50 hover:bg-background-tertiary hover:border-foreground/50 text-foreground-secondary hover:text-foreground font-mono text-xs rounded-xs transition-colors"
                  >
                    {getChannelIcon(ch.icon)}
                    <span>{ch.platform}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
