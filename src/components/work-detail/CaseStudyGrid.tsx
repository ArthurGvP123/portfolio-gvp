import React from "react";
import { AlertCircle, CheckCircle2, TrendingUp } from "lucide-react";
import { Project } from "@/types/portfolio";
import { cn } from "@/lib/utils";

export interface CaseStudyGridProps {
  project: Project;
  className?: string;
}

export function CaseStudyGrid({ project, className }: CaseStudyGridProps) {
  const problemText = project.problemStatement || project.challenge;
  const solutions = project.solutionDetails && project.solutionDetails.length > 0
    ? project.solutionDetails
    : project.solution;

  return (
    <section className={cn("w-full space-y-8", className)}>
      {/* 01: Problem Statement & Architectural Challenge */}
      <div className="border border-border bg-background-secondary/40 rounded-xs p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 font-mono text-xs text-foreground-muted uppercase tracking-wider">
          <AlertCircle className="w-4 h-4 text-amber-500/80" />
          <span>01 // THE CHALLENGE & PROBLEM STATEMENT</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground uppercase">
          Architectural Constraints & Core Objectives
        </h2>

        <div className="text-sm sm:text-base text-foreground-secondary leading-relaxed font-sans border-l-2 border-foreground/30 pl-4 py-1 italic bg-background-tertiary/30">
          &quot;{problemText}&quot;
        </div>
      </div>

      {/* 02: Quantifiable Impact & Benchmark Telemetry */}
      {project.keyMetrics && project.keyMetrics.length > 0 && (
        <div className="border border-border bg-background-secondary/40 rounded-xs p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2 font-mono text-xs text-foreground-muted uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>02 // QUANTIFIABLE IMPACT & BENCHMARKS</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground uppercase">
            Validated Performance Telemetry
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {project.keyMetrics.map((metric, idx) => (
              <div
                key={idx}
                className="p-4 border border-border bg-background-secondary rounded-xs font-mono space-y-2 hover:border-foreground/40 transition-colors"
              >
                <div className="text-[10px] text-foreground-muted uppercase tracking-widest">
                  {metric.label}
                </div>
                <div className="text-base sm:text-lg font-bold text-foreground">
                  {metric.value}
                </div>
                <div className="text-[9px] text-foreground-secondary/70">
                  METRIC_NODE_0{idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 03: Solution Architecture & Engineering Innovations */}
      {solutions && solutions.length > 0 && (
        <div className="border border-border bg-background-secondary/40 rounded-xs p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2 font-mono text-xs text-foreground-muted uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-foreground" />
            <span>03 // SOLUTION ARCHITECTURE & INNOVATIONS</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground uppercase">
            Core Technical Implementations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {solutions.map((item, idx) => {
              const formattedNum = String(idx + 1).padStart(2, "0");
              return (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 border border-border bg-background-secondary rounded-xs hover:border-foreground/30 transition-colors"
                >
                  <span className="font-mono text-xs font-bold text-foreground bg-background-tertiary px-2 py-1 rounded-xs shrink-0 border border-border">
                    {formattedNum}
                  </span>
                  <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed">
                    {item}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
