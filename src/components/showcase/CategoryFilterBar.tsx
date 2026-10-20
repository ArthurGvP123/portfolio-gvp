"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { playHapticClick } from "@/utils/audio";
import { cn } from "@/lib/utils";

export interface CategoryItem {
  name: string;
  count: number;
}

export interface CategoryFilterBarProps {
  categories: CategoryItem[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalProjects: number;
  filteredCount: number;
  className?: string;
}

export function CategoryFilterBar({
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  totalProjects,
  filteredCount,
  className,
}: CategoryFilterBarProps) {
  const handleCategoryClick = (cat: string) => {
    playHapticClick(820);
    onSelectCategory(cat);
  };

  const handleClearSearch = () => {
    playHapticClick(720);
    onSearchChange("");
  };

  return (
    <div className={cn("w-full space-y-4 pb-2", className)}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Category Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter works by engineering domain"
          className="flex flex-wrap items-center gap-2"
        >
          {categories.map((cat) => {
            const isActive = activeCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.name}
                role="tab"
                aria-selected={isActive}
                onClick={() => handleCategoryClick(cat.name)}
                className={cn(
                  "group relative flex items-center gap-2 px-3 py-1.5 text-xs font-mono tracking-wider rounded-xs transition-all duration-200 border cursor-pointer select-none",
                  isActive
                    ? "bg-foreground text-background border-foreground font-bold shadow-xs"
                    : "bg-background-secondary/80 text-foreground-secondary border-border hover:text-foreground hover:border-foreground/40 hover:bg-background-tertiary"
                )}
              >
                <span>#{cat.name}</span>
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-xs font-mono transition-colors",
                    isActive
                      ? "bg-background text-foreground"
                      : "bg-background-tertiary text-foreground-muted group-hover:text-foreground"
                  )}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar & Telemetry Readout */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground-muted pointer-events-none" />
            <input
              type="text"
              placeholder="SEARCH BY TECH, TITLE, OR TAG..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-background-secondary border border-border pl-8 pr-8 py-1.5 text-xs font-mono text-foreground placeholder:text-foreground-muted rounded-xs focus:outline-none focus:border-foreground/60 w-64 md:w-72 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                aria-label="Clear search query"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="hidden sm:flex items-center px-3 py-1.5 border border-border bg-background-secondary/50 font-mono text-[11px] text-foreground-secondary rounded-xs">
            <span>NODES: </span>
            <span className="font-bold text-foreground ml-1">
              {filteredCount}/{totalProjects}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
