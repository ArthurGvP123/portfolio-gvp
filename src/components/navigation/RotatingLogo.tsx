"use client";

import React from "react";
import Image from "next/image";
import { AsciiLogo } from "@/components/common/AsciiLogo";
import { cn } from "@/lib/utils";

export interface RotatingLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  mode?: "ascii" | "image";
}

/**
 * 3D Horizontal Rotating Logo (Continuous Orbital Spin):
 * Recreates the iconic 3D perspective spin on the Y-axis (inspired by meermohsin.me).
 * Supports both pure code ASCII art mode (default) and PNG image mode.
 * Uses dual-sided 3D geometry with backface-visibility:hidden so the emblem is never reversed.
 * Spins at a calm 8s orbital cycle by default, accelerating to 2.2s on hover.
 */
export function RotatingLogo({
  className,
  size = "md",
  mode = "ascii",
}: RotatingLogoProps) {
  if (mode === "ascii") {
    return <AsciiLogo variant="header" animate3D={true} className={className} />;
  }

  // Dimensions calibrated to 610:1354 aspect ratio (~0.45)
  const sizeClasses = {
    sm: "h-4 w-[7.5px]",
    md: "h-5 sm:h-6 w-[9px] sm:w-[11px]",
    lg: "h-7 sm:h-8 w-[13px] sm:w-[14.5px]",
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center select-none [perspective:800px] shrink-0",
        className
      )}
      aria-hidden="true"
    >
      <div
        className={cn(
          "relative [transform-style:preserve-3d] animate-spin-y",
          sizeClasses[size]
        )}
      >
        {/* Front Face */}
        <div className="absolute inset-0 [backface-visibility:hidden] flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Arthur GvP Logo"
            width={610}
            height={1354}
            priority
            className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(252,252,252,0.2)]"
          />
        </div>

        {/* Back Face (Rotated 180deg so the emblem faces forward on both sides) */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Arthur GvP Logo"
            width={610}
            height={1354}
            priority
            className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(252,252,252,0.2)]"
          />
        </div>
      </div>
    </div>
  );
}
