import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Radio, Terminal } from "lucide-react";

/**
 * Native App Router Custom 404 Page (Feature 21)
 * Obsidian Dark Luxury styling (#050505), brutalist typography,
 * "SIGNAL TERMINATED // 404", and tactical return to base navigation.
 */
export default function NotFound() {
  return (
    <main className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 sm:py-24 bg-background text-foreground overflow-hidden">
      {/* Precision Crosshairs in Corners */}
      <span className="absolute top-4 left-4 font-mono text-[10px] text-foreground-muted select-none pointer-events-none opacity-40">
        +
      </span>
      <span className="absolute top-4 right-4 font-mono text-[10px] text-foreground-muted select-none pointer-events-none opacity-40">
        +
      </span>
      <span className="absolute bottom-4 left-4 font-mono text-[10px] text-foreground-muted select-none pointer-events-none opacity-40">
        +
      </span>
      <span className="absolute bottom-4 right-4 font-mono text-[10px] text-foreground-muted select-none pointer-events-none opacity-40">
        +
      </span>

      {/* Subtle Ambient Radial Lighting */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-xl w-full border border-border bg-background-secondary/80 backdrop-blur-sm p-6 sm:p-10 md:p-12 text-center rounded-sm">
        {/* Status Beacon */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-background-tertiary border border-border font-mono text-[11px] uppercase tracking-widest text-foreground-secondary mb-6">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span>SYS.STATUS // ANOMALY DETECTED</span>
        </div>

        {/* Brutalist 404 Hero */}
        <h1 className="text-7xl sm:text-9xl font-black font-mono tracking-tighter text-foreground leading-none select-none">
          404
        </h1>

        {/* Feature 21 Tactical Badge */}
        <div className="my-6 border-y border-border py-2.5">
          <p className="font-mono text-xs sm:text-sm font-bold uppercase tracking-widest text-foreground">
            SIGNAL TERMINATED // 404
          </p>
        </div>

        {/* Descriptive Briefing */}
        <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed max-w-md mx-auto mb-8">
          The requested coordinate or sector does not exist in the active neural topology.
          The transmission packet was dropped or the endpoint has been decommissioned.
        </p>

        {/* Telemetry Diagnostics Box */}
        <div className="mb-8 p-4 bg-background/70 border border-border/80 font-mono text-[10px] sm:text-[11px] text-foreground-muted text-left space-y-1 rounded-xs">
          <div className="flex items-center justify-between text-foreground-secondary pb-1 mb-1 border-b border-border/60">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-foreground" />
              <span className="font-bold">DIAGNOSTIC TELEMETRY</span>
            </span>
            <span className="flex items-center gap-1">
              <Radio className="w-3 h-3 text-rose-400" />
              <span>DISCONNECTED</span>
            </span>
          </div>
          <div className="flex justify-between">
            <span>VECTOR:</span>
            <span className="text-foreground">0x404_NULL_REFERENCE</span>
          </div>
          <div className="flex justify-between">
            <span>STATUS:</span>
            <span className="text-foreground">ROUTE_UNRESOLVED</span>
          </div>
          <div className="flex justify-between">
            <span>COORDINATES:</span>
            <span className="text-foreground">-6.1944° S, 106.8229° E (JAKARTA_ID)</span>
          </div>
          <div className="flex justify-between">
            <span>SECURITY PROTOCOL:</span>
            <span className="text-foreground">OBSIDIAN_SECURE // SHA-256</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          <Link
            href="/"
            className="group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-foreground text-background font-mono text-xs uppercase tracking-widest font-bold border border-foreground hover:bg-background hover:text-foreground transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>RETURN TO BASE // HOME</span>
          </Link>

          <Link
            href="/work"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-background-tertiary border border-border hover:border-foreground/60 text-foreground font-mono text-xs uppercase tracking-widest font-semibold transition-colors"
          >
            <span>VIEW ARCHIVES // WORK</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
