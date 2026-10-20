"use client";

import React from "react";
import { RotaryDial } from "./RotaryDial";
import { useLenis } from "@/components/common/SmoothScrollProvider";
import { ArrowUp, Terminal, Shield, Cpu, MapPin } from "lucide-react";

export function TactileFooter() {
  const { scrollTo } = useLenis();

  const handleScrollToTop = () => {
    scrollTo(0, { immediate: false, duration: 1.2 });
  };

  return (
    <footer className="w-full mt-24 border-t border-border pt-12 pb-16 font-mono select-none">
      {/* Upper Grid: Rotary Interface, Theme Engine, and System Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-border/60">
        {/* Left Column: Mechanical Rotary Dial */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-background-secondary/50 border border-border rounded-xs">
          <RotaryDial
            onScrollToTop={handleScrollToTop}
          />
          <p className="mt-3 text-[10px] text-foreground-muted text-center max-w-xs">
            * Interactive mechanical dial modeled on vintage pulse telephony. Drag any socket clockwise to the finger stop bracket.
          </p>
        </div>

        {/* Right Column: Theme Engine & Architecture Dossier */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-8">
          {/* Static Obsidian System Architecture Branding */}
          <div className="p-6 bg-background-secondary/50 border border-border rounded-xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                <span className="text-xs font-bold tracking-widest text-foreground uppercase">
                  OBSIDIAN DARK LUXURY // SYSTEM 01
                </span>
              </div>
              <span className="text-[10px] text-foreground-muted uppercase tracking-wider font-mono">
                PALETTE LOCKED
              </span>
            </div>

            <p className="text-xs text-foreground-secondary leading-relaxed">
              Monochrome architectural system calibrated for high-contrast legibility, Swiss grid hierarchy, and tactile micro-interactions.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/30">
              <div className="flex flex-col gap-1 p-2 bg-background-primary/60 border border-border/60 rounded-xs">
                <span className="text-[9px] text-foreground-muted uppercase">CANVAS</span>
                <span className="text-[11px] font-mono font-semibold text-foreground">#050505</span>
              </div>
              <div className="flex flex-col gap-1 p-2 bg-background-primary/60 border border-border/60 rounded-xs">
                <span className="text-[9px] text-foreground-muted uppercase">SURFACE</span>
                <span className="text-[11px] font-mono font-semibold text-foreground">#0E0E0E</span>
              </div>
              <div className="flex flex-col gap-1 p-2 bg-background-primary/60 border border-border/60 rounded-xs">
                <span className="text-[9px] text-foreground-muted uppercase">BORDER</span>
                <span className="text-[11px] font-mono font-semibold text-foreground">#1A1A1A</span>
              </div>
              <div className="flex flex-col gap-1 p-2 bg-background-primary/60 border border-border/60 rounded-xs">
                <span className="text-[9px] text-foreground-muted uppercase">SPECULAR</span>
                <span className="text-[11px] font-mono font-semibold text-white">#FFFFFF</span>
              </div>
            </div>
          </div>

          {/* Dossier & Bio Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 border border-border bg-background-secondary/30 rounded-xs flex flex-col justify-between gap-3">
              <div className="flex items-center gap-2 text-foreground-secondary">
                <Terminal className="w-3.5 h-3.5 text-foreground" />
                <span className="font-bold uppercase tracking-wider">CREATIVE TECHNOLOGIST</span>
              </div>
              <p className="text-foreground-secondary leading-relaxed text-[11px]">
                Engineering high-concurrency systems, spatial 3D WebGL interfaces, and resilient distributed architectures with meticulous craft.
              </p>
              <div className="text-[10px] text-foreground-muted flex items-center gap-1">
                <MapPin className="w-3 h-3 text-foreground-muted" />
                <span>JAKARTA, INDONESIA &bull; UTC+7</span>
              </div>
            </div>

            <div className="p-4 border border-border bg-background-secondary/30 rounded-xs flex flex-col justify-between gap-3">
              <div className="flex items-center gap-2 text-foreground-secondary">
                <Shield className="w-3.5 h-3.5 text-foreground" />
                <span className="font-bold uppercase tracking-wider">STATUS &amp; COMMISSIONS</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] text-foreground font-semibold">AVAILABLE Q2/Q3 &apos;26</span>
              </div>
              <p className="text-foreground-secondary text-[11px]">
                Direct advisory, full-stack architectural sprints, or lead creative engineering engagements.
              </p>
              <div className="text-[10px] text-foreground-muted flex items-center gap-1">
                <Cpu className="w-3 h-3 text-foreground-muted" />
                <span>NEXT.JS 15 &bull; THREE.JS &bull; GSAP &bull; LENIS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Bar: Copyright, Hairline Badges, Scroll to Top */}
      <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-foreground-secondary">
        <div>
          <span className="font-bold text-foreground">ARTHUR GREGORIUS PONGOH</span>
          <span className="mx-2 text-foreground-muted">&bull;</span>
          <span>&copy; {new Date().getFullYear()} ALL RIGHTS RESERVED</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-3 text-[10px] text-foreground-muted uppercase">
            <span>SPEC: 12-COL SWISS GRID</span>
            <span>&bull;</span>
            <span>FPS: LOCKED 60</span>
            <span>&bull;</span>
            <span>MODE: OBSIDIAN // 01</span>
          </div>

          {/* Scroll to Top Trigger */}
          <button
            type="button"
            onClick={handleScrollToTop}
            aria-label="Scroll back to top of page"
            className="group flex items-center gap-2 px-3 py-1.5 border border-border bg-background-secondary rounded-xs hover:bg-foreground hover:text-background transition-all duration-200 cursor-pointer"
          >
            <span className="text-[11px] tracking-wider uppercase font-bold">TOP</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
