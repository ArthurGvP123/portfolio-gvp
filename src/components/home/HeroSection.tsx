"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Terminal } from "lucide-react";
import { playHapticClick } from "@/utils/audio";

export function HeroSection() {
  const handleCtaClick = () => {
    playHapticClick(920);
  };

  return (
    <section className="relative w-full pt-12 pb-16 md:pt-20 md:pb-24 border-b border-border overflow-hidden">
      {/* Precision Crosshair Corner Accents */}
      <div className="absolute top-2 left-2 pointer-events-none text-foreground-muted text-[10px] font-mono select-none opacity-40">
        +
      </div>
      <div className="absolute top-2 right-2 pointer-events-none text-foreground-muted text-[10px] font-mono select-none opacity-40">
        +
      </div>
      <div className="absolute bottom-2 left-2 pointer-events-none text-foreground-muted text-[10px] font-mono select-none opacity-40">
        +
      </div>
      <div className="absolute bottom-2 right-2 pointer-events-none text-foreground-muted text-[10px] font-mono select-none opacity-40">
        +
      </div>

      {/* Subtle Background Radial Ambient Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-white/[0.015] rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Telemetry Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-8">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-border bg-background-secondary/80 rounded-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-foreground font-semibold">JAKARTA, ID [WIB]</span>
            </span>
            <span className="hidden sm:inline-block text-foreground-muted">/</span>
            <span className="hidden sm:inline-block text-foreground-muted">
              6°11&apos;35.2&quot;S 106°53&apos;01.3&quot;E
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 border border-border text-[10px] text-foreground-muted rounded-xs bg-background-secondary/50">
              [SYS_NODE: 0x0505]
            </span>
            <span className="px-2 py-0.5 border border-emerald-500/30 text-[10px] text-emerald-400 font-mono rounded-xs bg-emerald-950/20">
              TRANSMISSION ACTIVE
            </span>
          </div>
        </div>

        {/* Hero Title & Identity Statement */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-mono text-xs tracking-widest text-foreground-muted uppercase">
            <Terminal className="w-3.5 h-3.5 text-foreground-secondary" />
            <span>PORTFOLIO &amp; RESEARCH ARCHIVE — 2026</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-foreground leading-[0.95] uppercase">
            Arthur
            <br />
            <span className="text-foreground/90">Gregorius</span>
            <br />
            <span className="text-foreground/80">Pongoh</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl font-medium text-foreground-secondary max-w-3xl leading-relaxed pt-2">
            Computer Engineer &amp; Creative Technologist architecting high-performance Deep Learning
            vision pipelines, production fullstack systems, and kinetic visual software.
          </p>
        </div>

        {/* Dual CTA: Above-the-fold Core Actions */}
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-5">
          <Link
            href="/work"
            onClick={handleCtaClick}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-foreground text-background font-mono text-xs uppercase tracking-widest font-bold border border-foreground hover:bg-background hover:text-foreground transition-all duration-300 shadow-sm"
          >
            <span>EXPLORE ARCHIVES</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <Link
            href="/contact"
            onClick={handleCtaClick}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-background-secondary text-foreground font-mono text-xs uppercase tracking-widest font-semibold border border-border hover:border-foreground/60 hover:bg-background-tertiary transition-all duration-300"
          >
            <span>INITIATE TRANSMISSION</span>
            <ArrowUpRight className="w-4 h-4 text-foreground-muted group-hover:text-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          <div className="hidden lg:flex items-center gap-2 pl-4 text-xs font-mono text-foreground-muted border-l border-border/60">
            <span>UNNES GRADUATE</span>
            <span>•</span>
            <span>SINTA 2 AI RESEARCHER</span>
          </div>
        </div>

        {/* Discipline Tickers */}
        <div className="mt-12 pt-6 border-t border-border/60 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="space-y-1">
            <span className="text-foreground-muted text-[10px] uppercase block">DISCIPLINE 01</span>
            <span className="text-foreground font-medium">Deep Learning &amp; CV</span>
          </div>
          <div className="space-y-1">
            <span className="text-foreground-muted text-[10px] uppercase block">DISCIPLINE 02</span>
            <span className="text-foreground font-medium">Fullstack Architecture</span>
          </div>
          <div className="space-y-1">
            <span className="text-foreground-muted text-[10px] uppercase block">DISCIPLINE 03</span>
            <span className="text-foreground font-medium">Cloud &amp; DevOps Infra</span>
          </div>
          <div className="space-y-1">
            <span className="text-foreground-muted text-[10px] uppercase block">DISCIPLINE 04</span>
            <span className="text-foreground font-medium">Kinetic Motion Design</span>
          </div>
        </div>
      </div>
    </section>
  );
}
