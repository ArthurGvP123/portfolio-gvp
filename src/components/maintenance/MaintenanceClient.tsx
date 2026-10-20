"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { JakartaClock } from "@/components/navigation/JakartaClock";
import { playHapticClick } from "@/utils/audio";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Copy,
  Mail,
  MessageCircle,
  Radio,
  Terminal,
  ShieldCheck,
  Cpu,
} from "lucide-react";

interface MaintenanceClientProps {
  email: string;
  whatsappUrl: string;
  whatsappNumber: string;
}

export function MaintenanceClient({
  email,
  whatsappUrl,
  whatsappNumber,
}: MaintenanceClientProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = useCallback(() => {
    playHapticClick(840);
    if (navigator?.clipboard?.writeText) {
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
    } else {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2400);
    }
  }, [email]);

  return (
    <div className="space-y-8">
      {/* Diagnostics Telemetry Box */}
      <div className="p-5 sm:p-6 bg-background-secondary/80 border border-border font-mono text-xs rounded-xs space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-border text-foreground-secondary">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-foreground" />
            <span className="font-bold text-foreground tracking-wider uppercase">
              MAINTENANCE TELEMETRY MONITOR
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="text-[11px] text-amber-400 font-semibold tracking-wider uppercase">
              STANDBY // CALIBRATING
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-foreground-muted pt-1">
          <div className="flex justify-between border-b sm:border-b-0 border-border/40 pb-1 sm:pb-0">
            <span className="text-foreground-secondary">TARGET PLATFORM:</span>
            <span className="text-foreground font-semibold">NEXT.JS 15 // REACT 19</span>
          </div>
          <div className="flex justify-between border-b sm:border-b-0 border-border/40 pb-1 sm:pb-0">
            <span className="text-foreground-secondary">SYSTEM TIME (WIB):</span>
            <JakartaClock showSeconds={true} showLabel={false} />
          </div>
          <div className="flex justify-between border-b sm:border-b-0 border-border/40 pb-1 sm:pb-0">
            <span className="text-foreground-secondary">DEPLOYMENT PHASE:</span>
            <span className="text-foreground font-semibold">STAGE 5 // FINAL VERIFICATION</span>
          </div>
          <div className="flex justify-between border-b sm:border-b-0 border-border/40 pb-1 sm:pb-0">
            <span className="text-foreground-secondary">ESTIMATED RESTORATION:</span>
            <span className="text-emerald-400 font-semibold">Q2/Q3 2026 // ON-SCHEDULE</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground-secondary">SECURITY PROTOCOL:</span>
            <span className="text-foreground flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              OWASP ENFORCED
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground-secondary">BYPASS FREQUENCY:</span>
            <span className="text-emerald-400 font-semibold">ACTIVE // 100% DISPATCH</span>
          </div>
        </div>
      </div>

      {/* Direct Transmission Bypass Hub */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-foreground-muted">
          <Cpu className="w-3.5 h-3.5 text-foreground" />
          <span>DIRECT TRANSMISSION BYPASS FREQUENCIES:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 1-Click Copy Email Button */}
          <button
            type="button"
            onClick={handleCopyEmail}
            aria-label="Copy email address to clipboard"
            className="group relative flex items-center justify-between p-4 bg-background-tertiary border border-border hover:border-foreground transition-all duration-200 text-left cursor-pointer rounded-xs"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-background border border-border rounded-xs group-hover:border-foreground/60 transition-colors">
                <Mail className="w-4 h-4 text-foreground" />
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase text-foreground-muted tracking-wider">
                  PRIMARY EMAIL
                </div>
                <div className="font-mono text-xs font-semibold text-foreground">
                  {email}
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-1 font-mono text-[11px] text-foreground-secondary group-hover:text-foreground">
              {copiedEmail ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">[COPIED!]</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>[COPY]</span>
                </>
              )}
            </div>
          </button>

          {/* WhatsApp Direct Frequency */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playHapticClick(720)}
            aria-label={`Open direct WhatsApp conversation with Arthur GvP at ${whatsappNumber}`}
            className="group flex items-center justify-between p-4 bg-background-tertiary border border-border hover:border-emerald-500/80 transition-all duration-200 text-left rounded-xs"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-background border border-border rounded-xs group-hover:border-emerald-500/60 transition-colors">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase text-foreground-muted tracking-wider">
                  WHATSAPP FREQUENCY
                </div>
                <div className="font-mono text-xs font-semibold text-foreground">
                  {whatsappNumber}
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-1 font-mono text-[11px] text-foreground-secondary group-hover:text-emerald-400">
              <span>[DISPATCH]</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </a>
        </div>
      </div>

      {/* Navigation Return Controls */}
      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">
        <Link
          href="/"
          onClick={() => playHapticClick(640)}
          className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-foreground text-background font-mono text-xs uppercase tracking-widest font-bold border border-foreground hover:bg-background hover:text-foreground transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.12)] hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] rounded-xs"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>RETURN TO BASE // HOME</span>
        </Link>

        <Link
          href="/work"
          onClick={() => playHapticClick(640)}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-background-secondary border border-border hover:border-foreground/60 text-foreground font-mono text-xs uppercase tracking-widest font-semibold transition-colors rounded-xs"
        >
          <span>EXPLORE ARCHIVES // WORK</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>

        <Link
          href="/contact"
          onClick={() => playHapticClick(640)}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-background-secondary border border-border hover:border-foreground/60 text-foreground font-mono text-xs uppercase tracking-widest font-semibold transition-colors rounded-xs"
        >
          <span>CONTACT HUB // 3D MONOLITH</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
