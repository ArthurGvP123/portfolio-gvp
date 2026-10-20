"use client";

import React, { useEffect, useState } from "react";

export interface JakartaClockProps {
  className?: string;
  showSeconds?: boolean;
  showLabel?: boolean;
}

/**
 * JakartaClock: Real-time WIB digital clock displaying live Asia/Jakarta time (HH:mm:ss WIB).
 * Hydration-safe with fallback calculations and tabular-nums rendering.
 */
export function JakartaClock({
  className = "",
  showSeconds = true,
  showLabel = true,
}: JakartaClockProps) {
  const [timeString, setTimeString] = useState<string>("");

  useEffect(() => {
    const updateClock = () => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Jakarta",
          hour: "2-digit",
          minute: "2-digit",
          second: showSeconds ? "2-digit" : undefined,
          hour12: false,
        });
        setTimeString(`${formatter.format(now)} WIB`);
      } catch {
        // Deterministic fallback for Asia/Jakarta (UTC+7)
        const now = new Date();
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const jakartaTime = new Date(utc + 3600000 * 7);
        const hh = String(jakartaTime.getHours()).padStart(2, "0");
        const mm = String(jakartaTime.getMinutes()).padStart(2, "0");
        const ss = String(jakartaTime.getSeconds()).padStart(2, "0");
        setTimeString(showSeconds ? `${hh}:${mm}:${ss} WIB` : `${hh}:${mm} WIB`);
      }
    };

    updateClock();
    const intervalId = setInterval(updateClock, 1000);
    return () => clearInterval(intervalId);
  }, [showSeconds]);

  return (
    <div
      className={`inline-flex items-center gap-2 font-mono text-xs tabular-nums select-none ${className}`}
      aria-label="Current Jakarta Time"
    >
      <span
        className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"
        aria-hidden="true"
      />
      {showLabel && (
        <span className="text-foreground-muted text-[10px] uppercase tracking-wider">
          JKT:
        </span>
      )}
      <span className="font-semibold text-foreground tracking-wider">
        {timeString || "--:--:-- WIB"}
      </span>
    </div>
  );
}
