"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Grid } from "lucide-react";
import { Project } from "@/types/portfolio";
import { playHapticClick } from "@/utils/audio";
import { cn } from "@/lib/utils";

export interface ProjectPaginationProps {
  prevProject: Project;
  nextProject: Project;
  className?: string;
}

export function ProjectPagination({
  prevProject,
  nextProject,
  className,
}: ProjectPaginationProps) {
  return (
    <nav
      aria-label="Case study pagination navigation"
      className={cn(
        "w-full pt-8 border-t border-border/80 flex flex-col md:flex-row items-stretch justify-between gap-4 font-mono",
        className
      )}
    >
      {/* Previous Project Card */}
      <Link
        href={`/work/${prevProject.slug}`}
        onClick={() => playHapticClick(900)}
        className="group flex-1 p-5 border border-border bg-background-secondary/50 rounded-xs hover:border-foreground/40 hover:bg-background-secondary transition-all select-none space-y-2 text-left"
      >
        <div className="flex items-center gap-2 text-[10px] text-foreground-muted uppercase tracking-widest">
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>PREVIOUS CASE</span>
        </div>
        <div className="text-sm sm:text-base font-bold text-foreground group-hover:text-accent transition-colors line-clamp-1">
          {prevProject.title}
        </div>
        <div className="text-[11px] text-foreground-secondary">
          [{prevProject.category}]
        </div>
      </Link>

      {/* Center Return to All Works */}
      <Link
        href="/work"
        onClick={() => playHapticClick(720)}
        className="group flex items-center justify-center gap-2 px-6 py-4 border border-border bg-background-secondary/30 rounded-xs hover:border-foreground/40 hover:bg-foreground hover:text-background transition-all text-xs text-foreground-secondary hover:text-background uppercase tracking-wider select-none"
      >
        <Grid className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
        <span className="font-bold">ALL WORKS</span>
      </Link>

      {/* Next Project Card */}
      <Link
        href={`/work/${nextProject.slug}`}
        onClick={() => playHapticClick(900)}
        className="group flex-1 p-5 border border-border bg-background-secondary/50 rounded-xs hover:border-foreground/40 hover:bg-background-secondary transition-all select-none space-y-2 text-right"
      >
        <div className="flex items-center justify-end gap-2 text-[10px] text-foreground-muted uppercase tracking-widest">
          <span>NEXT CASE</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </div>
        <div className="text-sm sm:text-base font-bold text-foreground group-hover:text-accent transition-colors line-clamp-1">
          {nextProject.title}
        </div>
        <div className="text-[11px] text-foreground-secondary">
          [{nextProject.category}]
        </div>
      </Link>
    </nav>
  );
}
