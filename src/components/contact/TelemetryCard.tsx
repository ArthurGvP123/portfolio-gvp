"use client";

import React, { useState, useEffect } from "react";
import { Radio, Clock, MapPin, Shield, Zap, Server } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TelemetryCardProps {
  className?: string;
}

export function TelemetryCard({ className }: TelemetryCardProps) {
  const [wibTime, setWibTime] = useState<string>("");
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);

    const updateClock = () => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Jakarta",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
        setWibTime(`${formatter.format(now)} WIB`);
      } catch {
        // Deterministic UTC+7 fallback
        const now = new Date();
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const jkt = new Date(utc + 3600000 * 7);
        const hh = String(jkt.getHours()).padStart(2, "0");
        const mm = String(jkt.getMinutes()).padStart(2, "0");
        const ss = String(jkt.getSeconds()).padStart(2, "0");
        setWibTime(`${hh}:${mm}:${ss} WIB`);
      }
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={cn(
        "relative p-6 sm:p-8 bg-background-secondary/50 border border-border rounded-xs font-mono select-none overflow-hidden space-y-6",
        className
      )}
      role="region"
      aria-label="System Telemetry & Operational Status"
    >
      {/* Precision Corner Reticles */}
      <span className="absolute top-2 left-2 text-[10px] text-foreground-muted pointer-events-none select-none opacity-40">
        +
      </span>
      <span className="absolute top-2 right-2 text-[10px] text-foreground-muted pointer-events-none select-none opacity-40">
        +
      </span>

      {/* Header Matrix */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border/50 gap-2">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-bold tracking-widest text-foreground uppercase">
            TELEMETRY & DISPATCH MATRIX // 02
          </span>
        </div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-background border border-border/60 rounded-xs text-[10px] text-foreground-secondary">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>CARRIER ACTIVE (100%)</span>
        </div>
      </div>

      {/* Primary Status Banner: Availability */}
      <div className="p-4 bg-background-tertiary/60 border border-border/70 rounded-xs space-y-1">
        <div className="flex items-center gap-2 text-[10px] text-foreground-muted uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 text-foreground-secondary" />
          <span>CURRENT ENGAGEMENT CAPACITY</span>
        </div>
        <div className="text-xs sm:text-sm font-bold text-foreground tracking-wide uppercase">
          AVAILABLE FOR ARCHITECTURAL CONTRACTS & RESEARCH COLLABORATION
        </div>
      </div>

      {/* Telemetry Metrics 4-Box Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1: Jakarta WIB Clock */}
        <div className="p-3.5 bg-background border border-border/60 rounded-xs flex flex-col justify-between gap-1">
          <div className="flex items-center gap-1.5 text-[9px] text-foreground-muted uppercase tracking-wider">
            <Clock className="w-3 h-3 text-emerald-400" />
            <span>JAKARTA TIME (WIB)</span>
          </div>
          <div className="text-sm font-bold text-foreground tabular-nums tracking-wider">
            {mounted ? wibTime : "--:--:-- WIB"}
          </div>
          <span className="text-[9px] text-foreground-muted">
            UTC+07:00 (ASIA/JAKARTA)
          </span>
        </div>

        {/* Metric 2: Coordinates */}
        <div className="p-3.5 bg-background border border-border/60 rounded-xs flex flex-col justify-between gap-1">
          <div className="flex items-center gap-1.5 text-[9px] text-foreground-muted uppercase tracking-wider">
            <MapPin className="w-3 h-3 text-foreground-secondary" />
            <span>COORDINATES</span>
          </div>
          <div className="text-xs font-bold text-foreground font-mono">
            6°12&apos;S 106°49&apos;E
          </div>
          <span className="text-[9px] text-foreground-muted truncate">
            RAWAMANGUN, JAKARTA TIMUR
          </span>
        </div>

        {/* Metric 3: Response SLA */}
        <div className="p-3.5 bg-background border border-border/60 rounded-xs flex flex-col justify-between gap-1">
          <div className="flex items-center gap-1.5 text-[9px] text-foreground-muted uppercase tracking-wider">
            <Zap className="w-3 h-3 text-emerald-400" />
            <span>RESPONSE SLA</span>
          </div>
          <div className="text-sm font-bold text-emerald-400 tracking-wider">
            &lt; 24 HOURS
          </div>
          <span className="text-[9px] text-foreground-muted">
            FIRST DISPATCH TURNAROUND
          </span>
        </div>

        {/* Metric 4: Infrastructure & Security */}
        <div className="p-3.5 bg-background border border-border/60 rounded-xs flex flex-col justify-between gap-1">
          <div className="flex items-center gap-1.5 text-[9px] text-foreground-muted uppercase tracking-wider">
            <Shield className="w-3 h-3 text-foreground-secondary" />
            <span>SECURITY REL</span>
          </div>
          <div className="text-xs font-bold text-foreground">
            OWASP HARDENED
          </div>
          <span className="text-[9px] text-foreground-muted">
            TLS 1.3 // NOOPENER
          </span>
        </div>
      </div>

      {/* Production Infrastructure Footnote */}
      <div className="pt-2 flex items-center justify-between text-[10px] text-foreground-muted border-t border-border/40">
        <div className="flex items-center gap-2">
          <Server className="w-3 h-3" />
          <span>PRODUCTION HOST: RUMAHWEB LINUX 202.155.13.27</span>
        </div>
        <span className="hidden sm:inline">SSH: 2349 // NON-ROOT</span>
      </div>
    </div>
  );
}
