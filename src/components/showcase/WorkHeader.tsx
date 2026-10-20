"use client";

import React from "react";
import { ShowcaseViewSwitcher } from "@/components/showcase/ShowcaseViewSwitcher";
import { ViewMode } from "@/types/portfolio";
import { cn } from "@/lib/utils";

export interface WorkHeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  totalCount: number;
  className?: string;
}

export function WorkHeader({
  currentView,
  onViewChange,
  totalCount,
  className,
}: WorkHeaderProps) {
  const formattedCount = String(totalCount).padStart(2, "0");

  return (
    <header className={cn("w-full space-y-6 pt-4 pb-2 border-b border-border/80", className)}>
      {/* Eyebrow Telemetry Readout */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-foreground-secondary">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>CATALOG // {formattedCount} NODES ARCHIVED</span>
        </div>
        <div className="hidden sm:block text-[11px] font-mono text-foreground-muted tracking-wider">
          STATUS: PRODUCTION_VERIFIED
        </div>
      </div>

      {/* Main Title & Switcher Row */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground uppercase">
            SELECTED WORKS
          </h1>
          <p className="text-sm sm:text-base text-foreground-secondary leading-relaxed font-sans">
            Production web & mobile platforms, deep learning research benchmarks, and distributed cloud
            systems architecture engineered by Arthur Gregorius Pongoh.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="shrink-0 self-start lg:self-end">
          <ShowcaseViewSwitcher
            currentView={currentView}
            onViewChange={onViewChange}
          />
        </div>
      </div>
    </header>
  );
}
