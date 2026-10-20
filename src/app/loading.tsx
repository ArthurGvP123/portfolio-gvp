import React from "react";

/**
 * Global App Router Skeleton Loading State (Feature 23)
 * Obsidian Dark Luxury aesthetic (#050505), Swiss brutalist wireframes,
 * zero-CLS layout preservation, and neural telemetry pulse indicators.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page content"
      className="relative min-h-[calc(100vh-4rem)] w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 animate-fade-in"
    >
      {/* Precision Corner Crosshairs */}
      <span className="absolute top-4 left-4 font-mono text-[10px] text-foreground-muted select-none pointer-events-none opacity-40">
        +
      </span>
      <span className="absolute top-4 right-4 font-mono text-[10px] text-foreground-muted select-none pointer-events-none opacity-40">
        +
      </span>

      {/* Header Skeleton Bar */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-background-secondary border border-border rounded-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px] text-foreground-secondary tracking-widest uppercase">
            SYNCHRONIZING NEURAL TELEMETRY // ACTIVE BUFFER
          </span>
        </div>

        {/* Title Skeleton */}
        <div className="h-12 sm:h-16 w-3/4 bg-background-secondary/80 border border-border/80 rounded-xs animate-pulse" />

        {/* Subtitle / Description Skeleton */}
        <div className="space-y-2 pt-2">
          <div className="h-4 w-full max-w-xl bg-background-tertiary border border-border/60 rounded-xs animate-pulse" />
          <div className="h-4 w-2/3 max-w-md bg-background-tertiary border border-border/60 rounded-xs animate-pulse" />
        </div>
      </div>

      {/* Control / Filter Bar Skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-border">
        <div className="flex items-center gap-2">
          <div className="h-7 w-16 bg-background-tertiary border border-border/60 rounded-xs animate-pulse" />
          <div className="h-7 w-24 bg-background-tertiary border border-border/60 rounded-xs animate-pulse" />
          <div className="h-7 w-20 bg-background-tertiary border border-border/60 rounded-xs animate-pulse" />
        </div>
        <div className="h-7 w-28 bg-background-tertiary border border-border/60 rounded-xs animate-pulse" />
      </div>

      {/* Grid Content Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="border border-border bg-background-secondary/60 rounded-xs overflow-hidden flex flex-col justify-between"
          >
            {/* Visual Thumbnail Frame */}
            <div className="aspect-[16/9] w-full bg-background-tertiary border-b border-border/80 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              <div className="absolute top-3 left-3 h-5 w-16 bg-background/80 border border-border/60 rounded-xs animate-pulse" />
              <div className="absolute top-3 right-3 h-5 w-20 bg-background/80 border border-border/60 rounded-xs animate-pulse" />
            </div>

            {/* Content Meta Frame */}
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-3 w-24 bg-background-tertiary rounded-xs animate-pulse" />
                <div className="h-3 w-16 bg-background-tertiary rounded-xs animate-pulse" />
              </div>
              <div className="h-6 w-3/4 bg-background-tertiary rounded-xs animate-pulse" />
              <div className="h-4 w-full bg-background-tertiary/60 rounded-xs animate-pulse" />
              <div className="flex gap-2 pt-2">
                <div className="h-5 w-14 bg-background-tertiary rounded-xs animate-pulse" />
                <div className="h-5 w-16 bg-background-tertiary rounded-xs animate-pulse" />
                <div className="h-5 w-12 bg-background-tertiary rounded-xs animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
