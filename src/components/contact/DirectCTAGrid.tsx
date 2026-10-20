"use client";

import React, { useState, useRef, useCallback } from "react";
import { PRIMARY_EMAIL, CONTACT_CHANNELS } from "@/data/contacts";
import { playHapticClick } from "@/utils/audio";
import {
  Copy,
  Check,
  Mail,
  ArrowUpRight,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface DirectCTAGridProps {
  className?: string;
}

export function DirectCTAGrid({ className }: DirectCTAGridProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 3-Tier Resilient Clipboard Copy Protocol
  const handleCopyEmail = useCallback(async () => {
    playHapticClick(960);

    let copySuccessful = false;

    // Tier 1: Modern Async Clipboard API
    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      navigator.clipboard.writeText
    ) {
      try {
        await navigator.clipboard.writeText(PRIMARY_EMAIL);
        copySuccessful = true;
      } catch {
        copySuccessful = false;
      }
    }

    // Tier 2: Hidden textarea execCommand fallback
    if (!copySuccessful && typeof document !== "undefined") {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = PRIMARY_EMAIL;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        copySuccessful = document.execCommand("copy");
        document.body.removeChild(textArea);
      } catch {
        copySuccessful = false;
      }
    }

    // Tier 3: Direct mailto link fallback if all copying fails
    if (!copySuccessful) {
      window.location.href = `mailto:${PRIMARY_EMAIL}`;
      return;
    }

    // Visual State Transition: "COPIED TO CLIPBOARD // READY TO DISPATCH"
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }

    setCopied(true);
    copyTimeoutRef.current = setTimeout(() => {
      setCopied(false);
    }, 2500);
  }, []);

  // Icon mapping for outbound channels
  const renderChannelIcon = (platform: string) => {
    switch (platform) {
      case "WhatsApp":
        return <MessageCircle className="w-4 h-4 text-emerald-400" />;
      case "LinkedIn":
        return (
          <svg
            className="w-4 h-4 text-[#0a66c2]"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
          </svg>
        );
      case "GitHub":
        return (
          <svg
            className="w-4 h-4 text-foreground"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
        );
      case "Instagram":
        return (
          <svg
            className="w-4 h-4 text-[#e1306c]"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        );
      default:
        return <ExternalLink className="w-4 h-4 text-foreground-secondary" />;
    }
  };

  // Filter outbound non-email channels from CONTACT_CHANNELS
  const outboundChannels = CONTACT_CHANNELS.filter(
    (ch) => ch.platform.toLowerCase() !== "email"
  );

  return (
    <div className={cn("space-y-6 select-none font-mono", className)}>
      {/* 1. Primary Direct Email Command Card */}
      <div
        className={cn(
          "relative p-6 sm:p-8 bg-background-secondary/70 border rounded-xs transition-all duration-300 overflow-hidden",
          copied
            ? "border-emerald-500/80 bg-emerald-950/20 shadow-[0_0_24px_rgba(16,185,129,0.12)]"
            : "border-border hover:border-foreground/60"
        )}
      >
        {/* Precision Crosshairs in Corners */}
        <span className="absolute top-2 left-2 text-[10px] text-foreground-muted pointer-events-none select-none opacity-40">
          +
        </span>
        <span className="absolute top-2 right-2 text-[10px] text-foreground-muted pointer-events-none select-none opacity-40">
          +
        </span>

        <div className="space-y-5">
          {/* Card Header Status */}
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "w-2 h-2 rounded-full",
                  copied
                    ? "bg-emerald-400 animate-ping"
                    : "bg-emerald-500 animate-pulse"
                )}
              />
              <span className="text-[11px] font-semibold tracking-widest text-foreground uppercase">
                PRIMARY TRANSMISSION CHANNEL // 01
              </span>
            </div>
            <span className="text-[10px] text-foreground-muted uppercase tracking-wider">
              PRIORITY: DIRECT
            </span>
          </div>

          {/* Email Address & Headline */}
          <div>
            <span className="text-[10px] text-foreground-muted uppercase tracking-wider block mb-1">
              DESTINATION INBOX
            </span>
            <div className="text-xl sm:text-2xl md:text-3xl font-black text-foreground tracking-tight break-all font-sans">
              {PRIMARY_EMAIL}
            </div>
          </div>

          {/* Action Row: 1-Click Copy Button & Direct Mailto Link */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            {/* 1-Click Copy Button */}
            <button
              type="button"
              onClick={handleCopyEmail}
              aria-label={`Copy email address ${PRIMARY_EMAIL} to clipboard`}
              className={cn(
                "group flex-1 inline-flex items-center justify-between gap-3 px-5 py-3.5 border font-mono text-xs uppercase tracking-wider font-bold transition-all duration-200 cursor-pointer rounded-xs",
                copied
                  ? "bg-emerald-500 text-black border-emerald-400"
                  : "bg-foreground text-background border-foreground hover:bg-background hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-2.5">
                {copied ? (
                  <Check className="w-4 h-4 text-black animate-in zoom-in-50 duration-200" />
                ) : (
                  <Copy className="w-4 h-4 text-background/70 group-hover:text-foreground transition-colors" />
                )}
                <span>
                  {copied
                    ? "COPIED TO CLIPBOARD // READY TO DISPATCH"
                    : "1-CLICK COPY EMAIL"}
                </span>
              </div>
              <span className="text-[10px] font-normal opacity-70">
                {copied ? "[DISPATCH READY]" : "[COPY]"}
              </span>
            </button>

            {/* Direct Mail Client Trigger */}
            <a
              href={`mailto:${PRIMARY_EMAIL}`}
              onClick={() => playHapticClick(840)}
              aria-label={`Launch email client for ${PRIMARY_EMAIL}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-background-tertiary border border-border hover:border-foreground text-foreground-secondary hover:text-foreground text-xs uppercase tracking-wider font-semibold transition-colors rounded-xs"
            >
              <Mail className="w-4 h-4" />
              <span>LAUNCH CLIENT</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
            </a>
          </div>
        </div>
      </div>

      {/* 2. Outbound Channels Grid (WhatsApp, LinkedIn, GitHub, Instagram) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] text-foreground-muted uppercase tracking-widest">
            DIRECT OUTBOUND CHANNELS // OWASP VERIFIED
          </span>
          <span className="text-[10px] text-foreground-muted uppercase tracking-wider">
            REL: NOOPENER NOREFERRER
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {outboundChannels.map((channel) => (
            <a
              key={channel.platform}
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playHapticClick(840)}
              aria-label={`Connect via ${channel.platform}: ${channel.label} (opens in a new tab)`}
              className="group relative flex flex-col justify-between p-4 sm:p-5 bg-background-secondary/50 border border-border/80 hover:border-foreground/70 hover:bg-background-tertiary/70 rounded-xs transition-all duration-200"
            >
              {/* Header with Icon and Outbound Arrow */}
              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-background border border-border/60 rounded-xs">
                    {renderChannelIcon(channel.platform)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
                      {channel.platform}
                    </span>
                    <span className="text-[9px] text-foreground-muted uppercase tracking-wider">
                      {channel.actionText || "OUTBOUND LINK"}
                    </span>
                  </div>
                </div>

                <ArrowUpRight className="w-4 h-4 text-foreground-muted group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
              </div>

              {/* Channel Handle & Status */}
              <div className="pt-3 flex items-center justify-between text-xs">
                <span className="text-foreground-secondary group-hover:text-foreground font-semibold truncate max-w-[200px]">
                  {channel.handle || channel.label}
                </span>
                <span className="text-[10px] text-foreground-muted tracking-wider group-hover:text-foreground-secondary transition-colors">
                  [CONNECT]
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
