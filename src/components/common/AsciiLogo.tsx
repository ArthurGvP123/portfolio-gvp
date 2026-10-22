"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const HEADER_ASCII = [
  "       .      ",
  "     @@@@@@@# ",
  "     @@@@@@@@@",
  "    @@@@@@@@@@",
  "   @@@@@@@@@  ",
  "   @@@@@@@@   ",
  "  @@@@@       ",
  " @@@@@ @@@@@  ",
  " @@@@  @@@@@@ ",
  " @@@ @@@  @@@ ",
  " @@@@ @@  @@  ",
  "    @@@  @@   ",
  "   @@   @@    ",
  "   #@@@@      ",
  "    @ @@      ",
  "    @@@       ",
  "    @@        ",
  "    @         ",
].join("\n");

export const PRELOADER_ASCII = [
  "          .         ",
  "        @@@@@@@@    ",
  "       @@@@@@@@@@@@ ",
  "      @@@@@@@@@@@@@@",
  "      @@@@@@@@@@@@@@",
  "     @@@@@@@@@@@@@  ",
  "    @@@@@@@@@@@@@   ",
  "    @@@@@@@@@@@@    ",
  "   @@@@@@@@@@@      ",
  "  @@@@@@@  @@       ",
  "  @@@@@@  @@@@@@    ",
  " @@@@@@  @@  @@@@@@ ",
  " @@@@@     @@@@@@@@ ",
  " @@@@  @@@@   @@@@  ",
  " @@@@   @@@@  @@@   ",
  "   @@@@@@@@  @@@    ",
  "     @@@@@  @@@@    ",
  "     :     @@@@     ",
  "     @@@    @       ",
  "     @@@ @@@        ",
  "     @@ @@@         ",
  "     @@ @@          ",
  "     @@@@           ",
  "     @@@            ",
  "      @@            ",
  "      @             ",
].join("\n");

export interface AsciiLogoProps {
  className?: string;
  variant?: "header" | "preloader" | "floating";
  animate3D?: boolean;
}

/**
 * AsciiLogo:
 * Pure code-based ASCII Art rendition of Arthur's GaleriGvP personal emblem.
 * Uses GPU scale matrix transform to bypass browser minimum font-size clamps,
 * ensuring micro, razor-sharp, and perfectly compact dimensions.
 */
export function AsciiLogo({
  className,
  variant = "header",
  animate3D = false,
}: AsciiLogoProps) {
  const isHeader = variant === "header";
  const isFloating = variant === "floating";
  const asciiArt = isHeader ? HEADER_ASCII : PRELOADER_ASCII;

  if (animate3D) {
    return (
      <div
        className={cn(
          "relative inline-flex items-center justify-center select-none [perspective:800px] shrink-0",
          // Refined bounding box: slightly larger for clear visibility in navbar, without obstructing content
          isHeader
            ? "w-[20px] h-[30px] sm:w-[22px] sm:h-[33px]"
            : isFloating
            ? "w-[24px] h-[38px] sm:w-[28px] sm:h-[44px]"
            : "w-[28px] h-[44px]",
          className
        )}
        aria-hidden="true"
      >
        <div className="relative w-full h-full [transform-style:preserve-3d] animate-spin-y flex items-center justify-center">
          {/* Front Face */}
          <div className="absolute inset-0 flex items-center justify-center [backface-visibility:hidden]">
            <pre
              className={cn(
                "font-mono whitespace-pre select-none text-white font-bold tracking-[-0.08em] origin-center",
                isHeader
                  ? "text-[7px] leading-[5px] scale-[0.34] sm:scale-[0.38]"
                  : isFloating
                  ? "text-[7px] leading-[5.5px] scale-[0.28] sm:scale-[0.32]"
                  : "text-[7px] leading-[5.5px] scale-[0.32]"
              )}
            >
              {asciiArt}
            </pre>
          </div>

          {/* Back Face (Rotated 180deg on Y so glyphs face forward on both sides of orbit) */}
          <div className="absolute inset-0 flex items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <pre
              className={cn(
                "font-mono whitespace-pre select-none text-white font-bold tracking-[-0.08em] origin-center",
                isHeader
                  ? "text-[7px] leading-[5px] scale-[0.34] sm:scale-[0.38]"
                  : isFloating
                  ? "text-[7px] leading-[5.5px] scale-[0.28] sm:scale-[0.32]"
                  : "text-[7px] leading-[5.5px] scale-[0.32]"
              )}
            >
              {asciiArt}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  // Static Telemetry ASCII Art (used in Preloader & telemetry status badges)
  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center select-none shrink-0 overflow-hidden",
        isHeader
          ? "w-[20px] h-[30px] sm:w-[22px] sm:h-[33px]"
          : isFloating
          ? "w-[24px] h-[38px] sm:w-[28px] sm:h-[44px]"
          : "w-[26px] h-[40px] sm:w-[28px] sm:h-[44px]",
        className
      )}
      aria-hidden="true"
    >
      <pre
        className={cn(
          "font-mono whitespace-pre select-none font-bold tracking-[-0.08em] origin-center",
          isHeader
            ? "text-[7px] leading-[5px] text-white scale-[0.34] sm:scale-[0.38]"
            : isFloating
            ? "text-[7px] leading-[5.5px] text-white scale-[0.28] sm:scale-[0.32]"
            : "text-[7px] leading-[5.5px] text-zinc-400 group-hover:text-white scale-[0.30] sm:scale-[0.32] transition-colors"
        )}
      >
        {asciiArt}
      </pre>
    </div>
  );
}
