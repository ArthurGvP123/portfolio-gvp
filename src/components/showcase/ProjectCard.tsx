"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { ProjectItem, ProjectBadge } from "@/types/portfolio";
import { useCardTilt } from "@/hooks/useCardTilt";
import { playHapticClick } from "@/utils/audio";
import { cn } from "@/lib/utils";

export interface ProjectCardProps {
  project: ProjectItem;
  priority?: boolean;
  onSelect?: (project: ProjectItem) => void;
  className?: string;
}

function getBadgeStyle(badge: ProjectBadge): string {
  switch (badge) {
    case "Case":
      return "border-foreground/30 bg-foreground/10 text-foreground font-semibold";
    case "Research":
      return "border-emerald-500/30 bg-emerald-950/20 text-emerald-400 font-semibold";
    case "Shot":
      return "border-foreground-secondary/30 bg-foreground-secondary/10 text-foreground-secondary";
    case "WIP":
      return "border-foreground-muted/40 border-dashed bg-background-tertiary/60 text-foreground-muted";
    default:
      return "border-border text-foreground-secondary";
  }
}

export function ProjectCard({ project, onSelect, className }: ProjectCardProps) {
  const router = useRouter();
  const { cardRef, glareRef, cardStyle, glareStyle, onPointerMove, onPointerEnter, onPointerLeave } =
    useCardTilt({
      maxTilt: 12,
      perspective: 1000,
      scale: 1.025,
      returnDuration: 0.65,
    });

  const handleCardClick = () => {
    playHapticClick(880);
    if (onSelect) {
      onSelect(project);
    } else {
      router.push(`/work/${project.slug}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  };

  const handlePointerEnterWithSound = (e: React.PointerEvent<HTMLElement>) => {
    onPointerEnter(e);
    playHapticClick(940);
  };

  return (
    <article
      ref={cardRef}
      style={cardStyle}
      role="button"
      tabIndex={0}
      aria-label={`Explore case study for ${project.title}`}
      onPointerMove={onPointerMove}
      onPointerEnter={handlePointerEnterWithSound}
      onPointerLeave={onPointerLeave}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-sm",
        "border border-border bg-background-secondary/70 hover:border-foreground/35",
        "transition-colors duration-300 cursor-pointer select-none focus:outline-none focus:border-foreground/60",
        className
      )}
    >
      {/* Specular Radial Glare Layer */}
      <div ref={glareRef} style={glareStyle} aria-hidden="true" />

      {/* Crosshair Precision Markers in Corners */}
      <div className="absolute top-2 left-2 pointer-events-none text-foreground-muted text-[10px] font-mono leading-none select-none opacity-40 group-hover:opacity-100 transition-opacity">
        +
      </div>
      <div className="absolute top-2 right-2 pointer-events-none text-foreground-muted text-[10px] font-mono leading-none select-none opacity-40 group-hover:opacity-100 transition-opacity">
        +
      </div>
      <div className="absolute bottom-2 left-2 pointer-events-none text-foreground-muted text-[10px] font-mono leading-none select-none opacity-40 group-hover:opacity-100 transition-opacity">
        +
      </div>
      <div className="absolute bottom-2 right-2 pointer-events-none text-foreground-muted text-[10px] font-mono leading-none select-none opacity-40 group-hover:opacity-100 transition-opacity">
        +
      </div>

      <div>
        {/* Cover Thumbnail Image Box with Hairline Frame */}
        <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-border bg-background-tertiary">
          <Image
            src={project.coverImage}
            alt={`${project.title} — ${project.category} case study architectural preview`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            unoptimized
          />

          {/* Top Bar Floating Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <span
              className={cn(
                "px-2 py-0.5 rounded-xs text-[10px] tracking-wider uppercase font-mono border backdrop-blur-xs",
                getBadgeStyle(project.badge)
              )}
            >
              [{project.badge}]
            </span>

            <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono tracking-widest bg-background/80 text-foreground-secondary border border-border backdrop-blur-xs">
              {project.year}
            </span>
          </div>
        </div>

        {/* Project Information Body */}
        <div className="p-5">
          {/* Category & Node Tag */}
          <div className="flex items-center justify-between text-[11px] font-mono uppercase text-foreground-muted mb-2 tracking-wider">
            <span>{project.category}</span>
            <span className="text-[10px] text-foreground-secondary opacity-60">
              0x{project.id.replace("proj-", "").padStart(4, "0")}
            </span>
          </div>

          {/* Title with Double-Layer Rollover Link */}
          <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-accent transition-colors duration-200">
            <span className="link-inner">
              <span className="link-label">{project.title}</span>
              <span className="link-shadow text-accent">{project.title}</span>
            </span>
          </h3>

          {/* Subtitle / Brief Description */}
          <p className="mt-2 text-xs leading-relaxed text-foreground-secondary line-clamp-2">
            {project.subtitle}
          </p>

          {/* Tag Cloud */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[10px] font-mono bg-background-tertiary/80 text-foreground-secondary border border-border/80 rounded-xs"
              >
                #{tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="px-1.5 py-0.5 text-[10px] font-mono text-foreground-muted">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer Bar */}
      <div className="mt-2 px-5 py-3 border-t border-border/80 bg-background-tertiary/30 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          {project.stats && project.stats[0] ? (
            <span className="text-foreground-secondary text-[11px]">
              <span className="text-foreground-muted">{project.stats[0].label}: </span>
              <span className="text-foreground font-semibold">{project.stats[0].value}</span>
            </span>
          ) : (
            <span className="text-foreground-muted text-[11px]">[ACTIVE]</span>
          )}
        </div>

        <div className="flex items-center gap-1 text-foreground-secondary group-hover:text-foreground transition-colors">
          <span className="text-[11px] uppercase tracking-wider link-inner">
            <span className="link-label">EXPLORE</span>
            <span className="link-shadow">EXPLORE</span>
          </span>
          <ArrowUpRight className="w-3.5 h-3.5 transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </article>
  );
}
