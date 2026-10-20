"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, ExternalLink } from "lucide-react";
import { Project } from "@/types/portfolio";
import { getFeaturedProjects } from "@/data/projects";
import { useCardTilt } from "@/hooks/useCardTilt";
import { playHapticClick } from "@/utils/audio";
import { cn } from "@/lib/utils";

interface FeaturedProjectCardProps {
  project: Project;
  index: number;
}

function FeaturedProjectCard({ project, index }: FeaturedProjectCardProps) {
  const {
    cardRef,
    glareRef,
    cardStyle,
    glareStyle,
    onPointerMove,
    onPointerEnter,
    onPointerLeave,
  } = useCardTilt({
    maxTilt: 10,
    perspective: 1000,
    scale: 1.02,
    returnDuration: 0.6,
  });

  const handlePointerEnterWithSound = (e: React.PointerEvent<HTMLElement>) => {
    onPointerEnter(e);
    playHapticClick(900);
  };

  return (
    <article
      ref={cardRef}
      style={cardStyle}
      onPointerMove={onPointerMove}
      onPointerEnter={handlePointerEnterWithSound}
      onPointerLeave={onPointerLeave}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-sm",
        "border border-border bg-background-secondary/70 hover:border-foreground/40",
        "transition-colors duration-300"
      )}
    >
      {/* Specular Radial Glare Layer */}
      <div ref={glareRef} style={glareStyle} aria-hidden="true" />

      {/* Crosshair Corner Markers */}
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
        {/* Cover Thumbnail Image with alt={project.title} */}
        <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-border bg-background-tertiary">
          <Image
            src={project.coverImage}
            alt={`${project.title} — Featured case study preview and architectural breakdown`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            unoptimized
          />

          {/* Top Bar Floating Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <span className="px-2 py-0.5 rounded-xs text-[10px] tracking-wider uppercase font-mono border border-foreground/30 bg-foreground/10 text-foreground font-bold backdrop-blur-xs">
              [{project.badge}]
            </span>

            <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono tracking-widest bg-background/80 text-foreground-secondary border border-border backdrop-blur-xs">
              0{index + 1} {"//"} {project.year}
            </span>
          </div>
        </div>

        {/* Project Information */}
        <div className="p-6">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase text-foreground-muted mb-2 tracking-wider">
            <span>{project.category}</span>
            <span>{project.id}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground group-hover:text-white transition-colors duration-200">
            {project.title}
          </h3>

          <p className="text-xs sm:text-sm text-foreground-secondary line-clamp-2 mt-2 leading-relaxed">
            {project.tagline || project.subtitle}
          </p>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {project.techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-[10px] font-mono border border-border/80 bg-background-tertiary/60 text-foreground-muted rounded-xs"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 4 && (
              <span className="px-1.5 py-0.5 text-[10px] font-mono text-foreground-muted">
                +{project.techStack.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-6 pt-0 border-t border-border/40 flex items-center justify-between gap-3 text-xs font-mono">
        <Link
          href={`/work/${project.slug}`}
          onClick={() => playHapticClick(940)}
          className="inline-flex items-center gap-1.5 text-foreground hover:text-white font-semibold group/link"
        >
          <span>VIEW CASE STUDY</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
        </Link>

        {project.links && project.links.length > 0 && (
          <a
            href={project.links[0].url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playHapticClick(880)}
            className="inline-flex items-center gap-1 text-foreground-muted hover:text-foreground text-[11px]"
            title={project.links[0].label}
          >
            <span>{project.links[0].label}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </article>
  );
}

export function FeaturedWorksPreview() {
  const featured = getFeaturedProjects();

  return (
    <section className="relative w-full py-16 md:py-24 border-b border-border bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-foreground-secondary mb-2">
              <span className="text-foreground-muted">02 {"//"}</span>
              <span>FEATURED WORK SHOWCASE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              SELECTED WORKS &amp; AI BENCHMARKS
            </h2>
          </div>

          <Link
            href="/work"
            onClick={() => playHapticClick(920)}
            className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest uppercase text-foreground hover:text-white group"
          >
            <span>EXPLORE ALL 8+ PROJECTS</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 2x2 Grid of Featured Projects with 3D Tilt */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {featured.map((project, index) => (
            <FeaturedProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Bottom Callout Banner */}
        <div className="mt-12 p-6 sm:p-8 border border-border bg-background-secondary/40 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-foreground text-sm uppercase">Looking for full catalog &amp; interactive 3D WebGL sphere?</h3>
            <p className="text-xs text-foreground-secondary mt-1">
              Switch between 3D Cards tilt grid and WebGL Fibonacci spherical coordinate projection on the Work page.
            </p>
          </div>

          <Link
            href="/work"
            onClick={() => playHapticClick(920)}
            className="px-5 py-2.5 bg-background-secondary border border-border hover:border-foreground/60 text-foreground font-mono text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors whitespace-nowrap"
          >
            OPEN CATALOG →
          </Link>
        </div>
      </div>
    </section>
  );
}
