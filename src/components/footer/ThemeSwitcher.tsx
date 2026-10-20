"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ThemeMode } from "@/types/portfolio";
import { playHapticClick } from "@/utils/audio";
import { cn } from "@/lib/utils";

export interface ThemeOption {
  id: ThemeMode;
  name: string;
  code: string;
  bgHex: string;
  accentHex: string;
}

export const THEMES: ThemeOption[] = [
  {
    id: "base",
    name: "BASE",
    code: "01/OBSIDIAN",
    bgHex: "#0a0a0a",
    accentHex: "#ffffff",
  },
  {
    id: "concrete",
    name: "CONCRETE",
    code: "02/MINERAL",
    bgHex: "#1a1c1e",
    accentHex: "#8e9297",
  },
  {
    id: "rust",
    name: "RUST",
    code: "03/CORTEN",
    bgHex: "#1c110d",
    accentHex: "#c45b36",
  },
  {
    id: "verdigris",
    name: "VERDIGRIS",
    code: "04/PATINA",
    bgHex: "#0a1715",
    accentHex: "#2e8b7b",
  },
  {
    id: "blood",
    name: "BLOOD",
    code: "05/CRIMSON",
    bgHex: "#170808",
    accentHex: "#b01a1a",
  },
];

export const STORAGE_KEY = "portfolio-theme";

/**
 * Pure helper to validate theme mode string.
 */
export function isValidTheme(theme: string): theme is ThemeMode {
  return THEMES.some((t) => t.id === theme);
}

/**
 * Applies theme to DOM root and updates sessionStorage.
 * Safe for SSR and client execution.
 */
export function applyThemeMode(theme: ThemeMode): void {
  if (typeof document !== "undefined") {
    document.documentElement.dataset.theme = theme;
  }
  if (typeof window !== "undefined" && window.sessionStorage) {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Storage access blocked or unavailable
    }
  }
}

/**
 * Retrieves persisted theme mode from sessionStorage or falls back to 'base'.
 */
export function getInitialThemeMode(): ThemeMode {
  if (typeof window !== "undefined" && window.sessionStorage) {
    try {
      const stored = window.sessionStorage.getItem(STORAGE_KEY);
      if (stored && isValidTheme(stored)) {
        return stored;
      }
    } catch {
      // Storage access blocked
    }
  }
  if (typeof document !== "undefined") {
    const currentAttr = document.documentElement.dataset.theme;
    if (currentAttr && isValidTheme(currentAttr)) {
      return currentAttr;
    }
  }
  return "base";
}

export interface ThemeSwitcherProps {
  currentTheme?: ThemeMode;
  onThemeChange?: (theme: ThemeMode) => void;
  className?: string;
}

export function ThemeSwitcher({
  currentTheme: propTheme,
  onThemeChange,
  className,
}: ThemeSwitcherProps) {
  const [activeTheme, setActiveTheme] = useState<ThemeMode>("base");

  useEffect(() => {
    const initial = propTheme || getInitialThemeMode();
    setActiveTheme(initial);
    applyThemeMode(initial);
  }, [propTheme]);

  const handleSelectTheme = useCallback(
    (themeId: ThemeMode) => {
      setActiveTheme(themeId);
      applyThemeMode(themeId);
      playHapticClick(920);
      if (onThemeChange) {
        onThemeChange(themeId);
      }
    },
    [onThemeChange]
  );

  return (
    <div className={cn("flex flex-col gap-2 font-mono select-none", className)}>
      <div className="flex items-center justify-between text-[11px] text-foreground-secondary uppercase tracking-widest">
        <span>TACTILE THEME ENGINE</span>
        <span className="text-foreground-muted">[5 MODES ACTIVE]</span>
      </div>

      <div
        role="group"
        aria-label="Color Theme Switcher"
        className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1 bg-background-secondary border border-border rounded-xs"
      >
        {THEMES.map((theme) => {
          const isSelected = activeTheme === theme.id;
          return (
            <button
              key={theme.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => handleSelectTheme(theme.id)}
              className={cn(
                "group relative flex items-center justify-between px-3 py-2 text-xs rounded-xs border transition-all duration-200 cursor-pointer text-left",
                isSelected
                  ? "bg-foreground text-background border-foreground font-bold shadow-xs"
                  : "bg-background-tertiary/60 text-foreground-secondary border-border/60 hover:text-foreground hover:border-border hover:bg-background-tertiary"
              )}
            >
              <div className="flex flex-col">
                <span className="text-[10px] tracking-wider uppercase font-semibold">
                  {theme.name}
                </span>
                <span
                  className={cn(
                    "text-[8px] tracking-tight font-mono",
                    isSelected ? "text-background/80" : "text-foreground-muted"
                  )}
                >
                  {theme.code}
                </span>
              </div>

              {/* Theme color swatch indicator */}
              <div
                className="w-3 h-3 rounded-full border border-border/80 flex items-center justify-center shrink-0 ml-2"
                style={{ backgroundColor: theme.bgHex }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: theme.accentHex }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
