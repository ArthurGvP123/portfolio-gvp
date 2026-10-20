import React from "react";
import { Cpu, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TechStackPillsProps {
  techStack: string[];
  tags?: string[];
  className?: string;
}

export function TechStackPills({ techStack, tags, className }: TechStackPillsProps) {
  return (
    <section className={cn("w-full border border-border bg-background-secondary/40 rounded-xs p-6 sm:p-8 space-y-6", className)}>
      <div className="flex items-center gap-2 font-mono text-xs text-foreground-muted uppercase tracking-wider">
        <Cpu className="w-4 h-4 text-foreground-secondary" />
        <span>04 // PRODUCTION TECH STACK & ECOSYSTEM</span>
      </div>

      <div className="space-y-4">
        {/* Core Libraries and Infrastructure */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono text-foreground-muted uppercase tracking-wider">
            FRAMEWORKS, LANGUAGES & LIBRARIES ({techStack.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 text-xs font-mono bg-background-secondary border border-border text-foreground rounded-xs hover:border-foreground/50 transition-colors select-none"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Domain Taxonomy Tags */}
        {tags && tags.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border/60">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-foreground-muted uppercase tracking-wider">
              <Tag className="w-3 h-3" />
              <span>DOMAIN TAXONOMY ({tags.length})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-[11px] font-mono bg-background-tertiary/80 border border-border/80 text-foreground-secondary rounded-xs select-none"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
