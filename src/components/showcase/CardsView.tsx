"use client";

import React from "react";
import { ProjectItem } from "@/types/portfolio";
import { ProjectCard } from "@/components/showcase/ProjectCard";
import { cn } from "@/lib/utils";

export interface CardsViewProps {
  projects: ProjectItem[];
  onSelectProject?: (project: ProjectItem) => void;
  onResetFilters?: () => void;
  className?: string;
}

export function CardsView({
  projects,
  onSelectProject,
  onResetFilters,
  className,
}: CardsViewProps) {
  return (
    <section className={cn("w-full py-4 space-y-6", className)}>
      {/* 12-Column Responsive Swiss Hairline Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              priority={index < 6}
              onSelect={onSelectProject}
            />
          ))}
        </div>
      ) : (
        <div className="p-16 border border-border border-dashed text-center font-mono space-y-4 bg-background-secondary/20 rounded-xs">
          <p className="text-sm text-foreground-secondary uppercase tracking-wider">
            NO PROJECTS FOUND MATCHING THE ACTIVE FILTER CRITERIA
          </p>
          <p className="text-xs text-foreground-muted">
            Try choosing a different domain pill or clearing your search term.
          </p>
          {onResetFilters && (
            <button
              onClick={onResetFilters}
              className="px-4 py-2 border border-foreground/30 text-xs font-mono text-foreground uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors cursor-pointer"
            >
              RESET ALL FILTERS
            </button>
          )}
        </div>
      )}
    </section>
  );
}
