"use client";

import React, { useState } from "react";
import { EXPERIENCES } from "@/data/experience";
import { Briefcase, ChevronDown, ChevronUp, MapPin, Calendar, CheckCircle2 } from "lucide-react";
import { playHapticClick } from "@/utils/audio";
import { cn } from "@/lib/utils";

export function WorkExperienceTimeline() {
  // Allow expanding/collapsing all or individual items (default first 2 open)
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    "exp-01": true,
    "exp-02": true,
  });

  const toggleExpand = (id: string) => {
    playHapticClick(900);
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className="relative w-full py-16 md:py-24 border-b border-border bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-foreground-secondary mb-2">
              <span className="text-foreground-muted">03 {"//"}</span>
              <span>PROFESSIONAL TRAJECTORY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              WORK EXPERIENCE &amp; IMPACT
            </h2>
          </div>

          <div className="font-mono text-xs text-foreground-muted">
            <span>7 CAREER STAGES</span>
            <span className="mx-2">•</span>
            <span>2024 — 2026</span>
          </div>
        </div>

        {/* Vertical Timeline Container */}
        <div className="relative border-l border-border/80 ml-3 sm:ml-6 pl-6 sm:pl-8 space-y-8">
          {EXPERIENCES.map((exp, index) => {
            const isExpanded = Boolean(expandedIds[exp.id]);
            const isCurrent = exp.current;

            return (
              <div key={exp.id} className="relative group">
                {/* Timeline Node Indicator on the border line */}
                <span
                  className={cn(
                    "absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full border-2 transition-colors duration-200",
                    isCurrent
                      ? "bg-emerald-500 border-background ring-4 ring-emerald-500/20"
                      : "bg-background border-border group-hover:border-foreground"
                  )}
                  aria-hidden="true"
                />

                {/* Card Container */}
                <div
                  className={cn(
                    "border rounded-sm transition-all duration-200",
                    isExpanded
                      ? "border-border/90 bg-background-secondary/60"
                      : "border-border/60 bg-background-secondary/30 hover:border-border/90"
                  )}
                >
                  {/* Card Header (Clickable Trigger) */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(exp.id)}
                    className="w-full text-left p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 focus:outline-hidden"
                    aria-expanded={isExpanded}
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[10px] text-foreground-muted tracking-widest uppercase">
                          PHASE 0{index + 1}
                        </span>

                        {isCurrent && (
                          <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 rounded-xs">
                            ACTIVE ENGAGEMENT
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground group-hover:text-white transition-colors">
                        {exp.role}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-foreground-secondary">
                        <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                          <Briefcase className="w-3.5 h-3.5 text-foreground-muted" />
                          {exp.company}
                        </span>
                        <span className="text-foreground-muted">•</span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-foreground-muted" />
                          {exp.location}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 font-mono text-xs text-foreground-muted">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-border/80 bg-background-tertiary rounded-xs">
                        <Calendar className="w-3.5 h-3.5" />
                        {exp.period}
                      </span>

                      <div className="p-1 rounded-xs border border-border/60 bg-background-tertiary text-foreground-secondary group-hover:text-foreground">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Expandable Body */}
                  {isExpanded && (
                    <div className="px-5 pb-6 sm:px-6 pt-0 border-t border-border/40 mt-1 space-y-4">
                      {/* Quantifiable Achievements */}
                      <div className="pt-4 space-y-2">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-foreground-muted block">
                          MEASURABLE IMPACT &amp; RESPONSIBILITIES:
                        </span>
                        <ul className="space-y-2 text-xs sm:text-sm text-foreground-secondary">
                          {exp.achievements.map((ach, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/80 shrink-0 mt-0.5" />
                              <span className="leading-relaxed">{ach}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Associated Skills */}
                      {exp.skills && exp.skills.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-1.5">
                          {exp.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 text-[10px] font-mono border border-border bg-background-tertiary/70 text-foreground-muted rounded-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
