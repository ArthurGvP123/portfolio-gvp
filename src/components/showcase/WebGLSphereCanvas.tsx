"use client";

import React, { useEffect } from "react";
import { ProjectItem } from "@/types/portfolio";
import { useThreeSphere, SphericalCoordinates } from "@/hooks/useThreeSphere";
import { cn } from "@/lib/utils";

export interface SphereControls {
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  isDragging: boolean;
}

export interface WebGLSphereCanvasProps {
  projects: ProjectItem[];
  radius?: number;
  onHoverProject?: (project: ProjectItem | null, screenCoord?: { x: number; y: number }) => void;
  onSelectProject?: (project: ProjectItem) => void;
  onCoordsChange?: (coords: SphericalCoordinates) => void;
  onActiveProjectChange?: (project: ProjectItem | null) => void;
  controlsRef?: React.MutableRefObject<SphereControls | null>;
  className?: string;
}

export function WebGLSphereCanvas({
  projects,
  radius = 280,
  onHoverProject,
  onSelectProject,
  onCoordsChange,
  onActiveProjectChange,
  controlsRef,
  className,
}: WebGLSphereCanvasProps) {
  const {
    containerRef,
    activeProject,
    coords,
    zoomIn,
    zoomOut,
    resetView,
    isDragging,
  } = useThreeSphere({
    projects,
    radius,
    onHoverProject,
    onSelectProject,
  });

  useEffect(() => {
    if (controlsRef) {
      controlsRef.current = {
        zoomIn,
        zoomOut,
        resetView,
        isDragging,
      };
    }
  }, [controlsRef, zoomIn, zoomOut, resetView, isDragging]);

  useEffect(() => {
    if (onCoordsChange) {
      onCoordsChange(coords);
    }
  }, [coords, onCoordsChange]);

  useEffect(() => {
    if (onActiveProjectChange) {
      onActiveProjectChange(activeProject);
    }
  }, [activeProject, onActiveProjectChange]);

  return (
    <div
      ref={containerRef}
      data-lenis-prevent
      className={cn(
        "relative w-full h-[620px] md:h-[720px] overflow-hidden bg-background-primary select-none cursor-grab active:cursor-grabbing",
        className
      )}
      role="region"
      aria-label="3D Interactive Project Sphere"
    >
      {/* Background Subtle Radial Atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, rgba(0, 0, 0, 0) 70%)",
        }}
      />
    </div>
  );
}
