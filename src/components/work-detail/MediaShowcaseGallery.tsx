"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Maximize2, Minimize2, Eye } from "lucide-react";
import { Project } from "@/types/portfolio";
import { playHapticClick } from "@/utils/audio";
import { cn } from "@/lib/utils";
import { useLenis } from "@/components/common/SmoothScrollProvider";

export interface MediaShowcaseGalleryProps {
  project: Project;
  className?: string;
}

export function MediaShowcaseGallery({ project, className }: MediaShowcaseGalleryProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<"schematic" | "raw">("schematic");
  const { stop: stopLenis, start: startLenis } = useLenis();

  useEffect(() => {
    if (!isFullscreen) return;

    stopLenis();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.code === "Escape") {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      startLenis();
    };
  }, [isFullscreen, stopLenis, startLenis]);

  const toggleFullscreen = () => {
    playHapticClick(840);
    setIsFullscreen((prev) => !prev);
  };

  const handleTabChange = (tab: "schematic" | "raw") => {
    playHapticClick(780);
    setActiveTab(tab);
  };

  return (
    <section className={cn("w-full space-y-3", className)}>
      {/* Telemetry Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono border-b border-border/80 pb-3">
        <div className="flex items-center gap-2 text-foreground-secondary">
          <Eye className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-foreground font-bold">MEDIA ENGINE:</span>
          <span>16:9 HIGH-FIDELITY SCHEMATIC</span>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Tabs */}
          <div className="flex items-center bg-background-secondary border border-border p-0.5 rounded-xs">
            <button
              onClick={() => handleTabChange("schematic")}
              className={cn(
                "px-2.5 py-1 text-[11px] rounded-xs transition-colors font-mono cursor-pointer",
                activeTab === "schematic"
                  ? "bg-foreground text-background font-bold"
                  : "text-foreground-secondary hover:text-foreground"
              )}
            >
              01 // SCHEMATIC
            </button>
            <button
              onClick={() => handleTabChange("raw")}
              className={cn(
                "px-2.5 py-1 text-[11px] rounded-xs transition-colors font-mono cursor-pointer",
                activeTab === "raw"
                  ? "bg-foreground text-background font-bold"
                  : "text-foreground-secondary hover:text-foreground"
              )}
            >
              02 // METRICS MATRIX
            </button>
          </div>

          {/* Fullscreen Expansion Toggle */}
          <button
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Expand media viewport"}
            className="p-1.5 border border-border bg-background-secondary text-foreground-secondary hover:text-foreground hover:bg-background-tertiary transition-colors rounded-xs cursor-pointer"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Main 16:9 Showcase Frame */}
      <div
        data-lenis-prevent={isFullscreen ? "" : undefined}
        className={cn(
          "relative w-full aspect-[16/9] overflow-hidden rounded-xs border border-border bg-background-secondary transition-all duration-300",
          isFullscreen
            ? "fixed inset-4 z-50 aspect-auto h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] bg-background/95 backdrop-blur-xl shadow-2xl"
            : ""
        )}
      >
        {/* Precision Crosshair Markers */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none text-foreground-muted text-[11px] font-mono leading-none select-none opacity-60">
          +
        </div>
        <div className="absolute top-3 right-3 z-10 pointer-events-none text-foreground-muted text-[11px] font-mono leading-none select-none opacity-60">
          +
        </div>
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none text-foreground-muted text-[11px] font-mono leading-none select-none opacity-60">
          +
        </div>
        <div className="absolute bottom-3 right-3 z-10 pointer-events-none text-foreground-muted text-[11px] font-mono leading-none select-none opacity-60">
          +
        </div>

        {/* Dynamic Display Content */}
        {activeTab === "schematic" ? (
          <Image
            src={project.coverImage}
            alt={`${project.title} — Architectural schematic and interface mockup for ${project.category}`}
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            priority
            className="object-cover"
            unoptimized
          />
        ) : (
          <div
            data-lenis-prevent
            className="absolute inset-0 p-6 md:p-10 flex flex-col justify-between font-mono bg-radial from-background-secondary to-background text-foreground overflow-y-auto no-scrollbar"
          >
            <div className="space-y-2 border-b border-border/80 pb-4">
              <div className="text-xs text-foreground-muted uppercase tracking-widest">
                SYSTEM TELEMETRY MATRIX // {project.slug}
              </div>
              <div className="text-xl md:text-2xl font-bold uppercase text-foreground">
                {project.title}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-6">
              {project.keyMetrics.map((metric, i) => (
                <div
                  key={i}
                  className="p-4 border border-border bg-background-tertiary/70 rounded-xs space-y-1"
                >
                  <div className="text-[10px] text-foreground-muted uppercase">
                    {metric.label}
                  </div>
                  <div className="text-sm md:text-base font-bold text-accent">
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-foreground-muted border-t border-border/80 pt-3">
              <span>PATTERN: {project.coverPattern.toUpperCase()}</span>
              <span>ROLE: {project.role.toUpperCase()}</span>
              <span>YEAR: {project.year}</span>
            </div>
          </div>
        )}

        {/* Top-Right Resolution Overlay Tag */}
        <div className="absolute top-4 right-4 z-10 px-2 py-0.5 font-mono text-[10px] bg-background/80 text-foreground-muted border border-border/80 backdrop-blur-xs pointer-events-none">
          [VIEWPORT: 1920x1080 // 16:9]
        </div>

        {/* Close Button when Fullscreen */}
        {isFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 left-4 z-20 px-3 py-1 font-mono text-xs bg-foreground text-background font-bold uppercase rounded-xs cursor-pointer shadow-lg"
          >
            CLOSE FULLSCREEN [ESC]
          </button>
        )}
      </div>
    </section>
  );
}
