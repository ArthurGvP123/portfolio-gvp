"use client";

import React from "react";
import { LayoutGrid, Globe } from "lucide-react";
import { ViewMode } from "@/types/portfolio";
import { playHapticClick } from "@/utils/audio";
import { cn } from "@/lib/utils";

export interface ShowcaseViewSwitcherProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  className?: string;
}

interface ViewTabOption {
  id: ViewMode;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

const VIEW_OPTIONS: ViewTabOption[] = [
  {
    id: "cards",
    label: "CARDS GRID",
    sublabel: "3D TILT",
    icon: LayoutGrid,
  },
  {
    id: "sphere",
    label: "3D SPHERE",
    sublabel: "WEBGL S²",
    icon: Globe,
  },
];

export function ShowcaseViewSwitcher({
  currentView,
  onViewChange,
  className,
}: ShowcaseViewSwitcherProps) {
  const handleSelectView = (view: ViewMode) => {
    if (view === currentView) return;
    playHapticClick(860);
    onViewChange(view);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const nextIndex = index === 0 ? 1 : 0;
      handleSelectView(VIEW_OPTIONS[nextIndex].id);
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Portfolio showcase view modes"
      className={cn(
        "inline-flex items-center p-1 bg-background-secondary border border-border rounded-xs gap-1",
        className
      )}
    >
      {VIEW_OPTIONS.map((opt, index) => {
        const isActive = currentView === opt.id;
        const Icon = opt.icon;

        return (
          <button
            key={opt.id}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => handleSelectView(opt.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              "group relative flex items-center gap-2.5 px-4 py-2 text-xs font-mono tracking-wider uppercase rounded-xs transition-all duration-200 cursor-pointer select-none border",
              isActive
                ? "bg-foreground text-background border-foreground font-bold shadow-xs"
                : "bg-transparent text-foreground-secondary border-transparent hover:text-foreground hover:bg-background-tertiary/70"
            )}
          >
            <Icon
              className={cn(
                "w-3.5 h-3.5 transition-transform duration-300",
                isActive ? "text-background scale-110" : "text-foreground-muted group-hover:text-foreground"
              )}
            />

            {/* Swiss Double-Layer Text Label */}
            <span className="link-inner">
              <span className="link-label">{opt.label}</span>
              <span className={cn("link-shadow", isActive ? "text-background" : "text-foreground")}>
                {opt.label}
              </span>
            </span>

            <span
              className={cn(
                "text-[9px] px-1 py-0.2 rounded-xs border",
                isActive
                  ? "bg-background/20 text-background border-background/30"
                  : "bg-background-tertiary text-foreground-muted border-border"
              )}
            >
              {opt.sublabel}
            </span>
          </button>
        );
      })}
    </div>
  );
}
