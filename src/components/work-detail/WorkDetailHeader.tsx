import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Project } from "@/types/portfolio";
import { cn } from "@/lib/utils";

export interface WorkDetailHeaderProps {
  project: Project;
  totalProjects: number;
  currentIndex: number;
  className?: string;
}

export function WorkDetailHeader({
  project,
  totalProjects,
  currentIndex,
  className,
}: WorkDetailHeaderProps) {
  const formattedIndex = String(currentIndex + 1).padStart(2, "0");
  const formattedTotal = String(totalProjects).padStart(2, "0");

  return (
    <header className={cn("w-full space-y-8", className)}>
      {/* Top Navigation Breadcrumb & Index Readout */}
      <div className="flex items-center justify-between border-b border-border/80 pb-4">
        <Link
          href="/work"
          className="group inline-flex items-center gap-2 text-xs font-mono text-foreground-secondary hover:text-foreground transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>RETURN TO WORK CATALOG</span>
        </Link>

        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-foreground-muted">NODE:</span>
          <span className="px-2 py-0.5 bg-background-secondary border border-border text-foreground font-bold rounded-xs">
            {formattedIndex} {"//"} {formattedTotal}
          </span>
        </div>
      </div>

      {/* Title & Category Matrix */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 text-xs font-mono font-bold tracking-wider uppercase border border-foreground/30 bg-foreground/10 text-foreground rounded-xs">
            [{project.badge}]
          </span>
          <span className="px-2.5 py-1 text-xs font-mono uppercase tracking-wider border border-border bg-background-secondary text-foreground-secondary rounded-xs">
            {project.category}
          </span>
          <span className="px-2.5 py-1 text-xs font-mono text-foreground-muted border border-border/60 bg-background-tertiary rounded-xs">
            {project.year}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-foreground leading-[1.05]">
          {project.title}
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-foreground-secondary max-w-3xl leading-relaxed font-sans">
          {project.subtitle}
        </p>
      </div>

      {/* 4-Column Technical Meta Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 sm:p-6 border border-border bg-background-secondary/60 rounded-xs font-mono">
        {/* Timeline */}
        <div className="space-y-1">
          <div className="text-[10px] text-foreground-muted uppercase tracking-wider">
            TIMELINE / YEAR
          </div>
          <div className="text-xs sm:text-sm font-bold text-foreground">
            {project.period || project.year}
          </div>
        </div>

        {/* Role */}
        <div className="space-y-1">
          <div className="text-[10px] text-foreground-muted uppercase tracking-wider">
            PRIMARY ROLE
          </div>
          <div className="text-xs sm:text-sm font-bold text-foreground">
            {project.role}
          </div>
        </div>

        {/* Context / Client */}
        <div className="space-y-1">
          <div className="text-[10px] text-foreground-muted uppercase tracking-wider">
            CONTEXT / CLIENT
          </div>
          <div className="text-xs sm:text-sm font-bold text-foreground truncate" title={project.client || project.context}>
            {project.client || project.context}
          </div>
        </div>

        {/* System Status */}
        <div className="space-y-1">
          <div className="text-[10px] text-foreground-muted uppercase tracking-wider">
            SYSTEM STATUS
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-foreground">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="truncate">{project.status}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
