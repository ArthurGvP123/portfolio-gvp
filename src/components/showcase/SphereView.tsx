"use client";

import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowUpRight, Compass, Move, RotateCcw, ZoomIn, ZoomOut, X } from "lucide-react";
import { ProjectItem } from "@/types/portfolio";
import { WebGLSphereCanvas, SphereControls } from "@/components/showcase/WebGLSphereCanvas";
import { SphericalCoordinates } from "@/hooks/useThreeSphere";
import { playHapticClick } from "@/utils/audio";
import { cn } from "@/lib/utils";

export interface SphereViewProps {
  projects: ProjectItem[];
  onSelectProject?: (project: ProjectItem) => void;
  className?: string;
}

export function SphereView({ projects, onSelectProject, className }: SphereViewProps) {
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [coords, setCoords] = useState<SphericalCoordinates>({
    lat: 0,
    lon: 0,
    phi: 0,
    theta: 0,
  });

  const controlsRef = useRef<SphereControls | null>(null);

  const handleSelect = useCallback(
    (project: ProjectItem) => {
      playHapticClick(860);
      setSelectedProject(project);
    },
    []
  );

  const handleCloseModal = () => {
    playHapticClick(750);
    setSelectedProject(null);
  };

  return (
    <div className={cn("relative w-full border border-border bg-background-secondary/40 rounded-sm overflow-hidden", className)}>
      {/* 3D WebGL Canvas Layer */}
      <WebGLSphereCanvas
        projects={projects}
        radius={280}
        onCoordsChange={setCoords}
        onActiveProjectChange={setActiveProject}
        onSelectProject={handleSelect}
        controlsRef={controlsRef}
      />

      {/* TOP LEFT HUD: Live Spherical Coordinate Readout */}
      <div className="absolute top-4 left-4 pointer-events-none z-10 flex flex-col gap-1 text-[11px] font-mono text-foreground-secondary bg-background/80 backdrop-blur-sm border border-border p-3 rounded-xs">
        <div className="flex items-center gap-2 text-foreground font-bold">
          <Compass className="w-3.5 h-3.5 text-accent animate-spin-slow" />
          <span>3D SPHERE S² ENGINE</span>
        </div>
        <div className="text-[10px] text-foreground-muted">
          LAT: {coords.lat >= 0 ? `+${coords.lat.toFixed(1)}` : coords.lat.toFixed(1)}° | LON:{" "}
          {coords.lon >= 0 ? `+${coords.lon.toFixed(1)}` : coords.lon.toFixed(1)}°
        </div>
        <div className="text-[10px] text-foreground-muted">
          PHI: {coords.phi.toFixed(3)} rad | THETA: {coords.theta.toFixed(3)} rad
        </div>
        <div className="text-[10px] text-accent/80 font-bold">
          NODES: {projects.length}/{projects.length} UNIFORM FIBONACCI
        </div>
      </div>

      {/* TOP RIGHT HUD: Drag & Interaction Guide */}
      <div className="absolute top-4 right-4 pointer-events-none z-10 hidden sm:flex items-center gap-2 text-[10px] font-mono text-foreground-secondary bg-background/80 backdrop-blur-sm border border-border px-3 py-2 rounded-xs">
        <Move className="w-3.5 h-3.5 text-foreground-muted" />
        <span>DRAG TO ROTATE • SCROLL / PINCH TO ZOOM</span>
      </div>

      {/* BOTTOM LEFT HUD: Camera Zoom & Reset Controls */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 font-mono text-xs">
        <button
          onClick={() => controlsRef.current?.zoomIn()}
          aria-label="Zoom into sphere"
          className="flex items-center justify-center w-8 h-8 bg-background/90 text-foreground border border-border hover:bg-foreground hover:text-background transition-colors rounded-xs shadow-xs"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => controlsRef.current?.zoomOut()}
          aria-label="Zoom out of sphere"
          className="flex items-center justify-center w-8 h-8 bg-background/90 text-foreground border border-border hover:bg-foreground hover:text-background transition-colors rounded-xs shadow-xs"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => controlsRef.current?.resetView()}
          className="flex items-center gap-1.5 px-3 h-8 bg-background/90 text-foreground border border-border hover:bg-foreground hover:text-background transition-colors rounded-xs shadow-xs text-[11px] tracking-wider uppercase"
        >
          <RotateCcw className="w-3 h-3" />
          <span>RESET</span>
        </button>
      </div>

      {/* BOTTOM RIGHT / CENTER HUD: Active Card Metadata Drawer */}
      <div className="absolute bottom-4 right-4 z-10 max-w-sm w-[calc(100%-2rem)] sm:w-auto">
        {activeProject ? (
          <div
            onClick={() => handleSelect(activeProject)}
            className="cursor-pointer bg-background/95 backdrop-blur-md border border-foreground/30 p-4 rounded-xs shadow-xl transition-all duration-200 hover:border-foreground"
          >
            <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
              <span className="px-1.5 py-0.5 border border-border bg-background-tertiary text-foreground-secondary rounded-xs">
                [{activeProject.badge}]
              </span>
              <span className="text-foreground-muted">{activeProject.year}</span>
            </div>

            <h4 className="text-base font-bold text-foreground flex items-center justify-between gap-3">
              <span>{activeProject.title}</span>
              <ArrowUpRight className="w-4 h-4 text-accent shrink-0" />
            </h4>

            <p className="text-xs text-foreground-secondary mt-1 line-clamp-1">
              {activeProject.subtitle}
            </p>

            <div className="mt-3 pt-2 border-t border-border flex items-center justify-between text-[10px] font-mono text-foreground-muted">
              <span>{activeProject.category}</span>
              <span className="text-accent uppercase">
                {activeProject.stats?.[0]?.value ?? "EXPLORE ->"}
              </span>
            </div>
          </div>
        ) : (
          <div className="hidden sm:block bg-background/70 backdrop-blur-xs border border-border/80 px-4 py-2 rounded-xs text-[11px] font-mono text-foreground-muted pointer-events-none">
            HOVER OR DRAG SPHERE TO INSPECT WORKS
          </div>
        )}
      </div>

      {/* Project Detail Modal Overlay */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
          onClick={handleCloseModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl bg-background-secondary border border-border p-6 md:p-8 rounded-sm shadow-2xl space-y-6"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs text-foreground-secondary mb-2">
                  <span className="px-2 py-0.5 border border-border text-[10px] font-bold">
                    {selectedProject.badge}
                  </span>
                  <span>{selectedProject.year}</span>
                  <span>/</span>
                  <span className="uppercase">{selectedProject.category}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                  {selectedProject.title}
                </h3>
                <p className="text-sm text-foreground-secondary mt-1">
                  {selectedProject.subtitle}
                </p>
              </div>

              <button
                onClick={handleCloseModal}
                aria-label="Close modal"
                className="p-1.5 border border-border hover:bg-foreground hover:text-background transition-colors rounded-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Description */}
            <p className="text-sm md:text-base text-foreground-secondary leading-relaxed border-t border-border pt-4">
              {selectedProject.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {selectedProject.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs font-mono bg-background-tertiary border border-border text-foreground-secondary rounded-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Stats Grid */}
            {selectedProject.stats && selectedProject.stats.length > 0 && (
              <div className="grid grid-cols-3 gap-3 pt-2">
                {selectedProject.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="p-3 border border-border bg-background-tertiary/40 rounded-xs font-mono"
                  >
                    <div className="text-[10px] text-foreground-muted uppercase">
                      {stat.label}
                    </div>
                    <div className="text-xs md:text-sm font-bold text-foreground mt-0.5">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-border">
              <span className="font-mono text-xs text-foreground-muted">
                NODE_ID: {selectedProject.id} {"//"} {selectedProject.slug}
              </span>

              <div className="flex items-center gap-2">
                <Link
                  href={`/work/${selectedProject.slug}`}
                  onClick={() => {
                    playHapticClick(880);
                    if (onSelectProject) {
                      onSelectProject(selectedProject);
                    }
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-foreground text-background font-mono text-xs font-bold uppercase tracking-wider rounded-xs hover:bg-accent transition-colors cursor-pointer"
                >
                  <span>EXPLORE CASE STUDY</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>

                {selectedProject.externalUrl && (
                  <a
                    href={selectedProject.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-2 border border-border text-foreground-secondary font-mono text-xs hover:text-foreground hover:border-foreground/40 transition-colors rounded-xs"
                  >
                    <span>EXTERNAL</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State Overlay when filtered nodes count is 0 */}
      {projects.length === 0 && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-6 bg-background/90 backdrop-blur-sm">
          <div className="p-8 border border-border border-dashed text-center font-mono space-y-3 bg-background-secondary/40 max-w-md">
            <p className="text-xs text-foreground-secondary uppercase tracking-wider">
              NO SPHERICAL NODES FOUND MATCHING FILTER
            </p>
            <p className="text-[11px] text-foreground-muted">
              Select another engineering domain or clear search query to reactivate the 3D Fibonacci lattice.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
