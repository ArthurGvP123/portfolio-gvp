"use client";

import React, { useState } from "react";
import {
  useRotaryDial,
  SOCKET_ANGLES,
  FINGER_STOP_ANGLE,
} from "@/hooks/useRotaryDial";
import { playHapticClick } from "@/utils/audio";
import { cn } from "@/lib/utils";

export interface RotaryDialProps {
  onDialTheme?: (theme?: unknown) => void;
  onScrollToTop?: () => void;
  className?: string;
}

export function RotaryDial({
  onScrollToTop,
  className,
}: RotaryDialProps) {
  const [lastDialed, setLastDialed] = useState<number | null>(null);
  const [dialMessage, setDialMessage] = useState<string>("READY TO DIAL");

  const handleDialComplete = (digit: number) => {
    setLastDialed(digit);
    playHapticClick(880);

    switch (digit) {
      case 1:
        setDialMessage("TELEMETRY -> NODE 01: JAKARTA HQ (WIB)");
        break;
      case 2:
        setDialMessage("TELEMETRY -> NODE 02: CORE AI & CV RESEARCH");
        break;
      case 3:
        setDialMessage("TELEMETRY -> NODE 03: FULLSTACK SYSTEMS");
        break;
      case 4:
        setDialMessage("TELEMETRY -> NODE 04: CLOUD & VPS DEVOPS");
        break;
      case 5:
        setDialMessage("TELEMETRY -> NODE 05: 3D WEBGL MOTION LAB");
        break;
      case 9:
        if (onScrollToTop) {
          onScrollToTop();
        }
        setDialMessage("SYSTEM CMD -> SCROLL TO TOP [0, 0]");
        break;
      default:
        setDialMessage(`SIGNAL TRANSMITTED -> [PULSE 00${digit}]`);
        break;
    }
  };

  const { dialRef, rotation, isDragging, activeSocket, handlePointerDown } =
    useRotaryDial({
      onDialComplete: handleDialComplete,
    });

  // Center coordinate and radius for sockets
  const CX = 150;
  const CY = 150;
  const SOCKET_RADIUS = 96;
  const HOLE_RADIUS = 20;

  // Finger stop position at FINGER_STOP_ANGLE (60 deg)
  const stopRad = (FINGER_STOP_ANGLE * Math.PI) / 180;
  const stopInnerX = CX + (SOCKET_RADIUS - 10) * Math.cos(stopRad);
  const stopInnerY = CY + (SOCKET_RADIUS - 10) * Math.sin(stopRad);
  const stopOuterX = CX + 138 * Math.cos(stopRad);
  const stopOuterY = CY + 138 * Math.sin(stopRad);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center select-none font-mono",
        className
      )}
    >
      {/* Top Dial Telephony Header */}
      <div className="w-full flex items-center justify-between text-[10px] text-foreground-secondary mb-3 pb-1 border-b border-border/50 uppercase tracking-widest">
        <span>MECHANICAL ROTARY INTERFACE</span>
        <span className="text-foreground-muted">[REF: BLEIBTGLEICH.DEV]</span>
      </div>

      {/* SVG Rotary Dial Stage */}
      <div
        ref={dialRef}
        className="relative w-64 h-64 sm:w-72 sm:h-72 touch-none cursor-grab active:cursor-grabbing"
        style={{ perspective: 1000 }}
      >
        <svg
          viewBox="0 0 300 300"
          className="w-full h-full drop-shadow-lg"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base Outer Bezel Ring */}
          <circle
            cx={CX}
            cy={CY}
            r="144"
            className="fill-background-secondary stroke-border"
            strokeWidth="2"
          />
          <circle
            cx={CX}
            cy={CY}
            r="138"
            className="fill-background-tertiary/40 stroke-border/40"
            strokeWidth="1"
          />

          {/* Fixed Base Plate Digits (1 through 9 underneath sockets) */}
          {SOCKET_ANGLES.map((angleDeg, idx) => {
            const digit = idx + 1;
            const rad = (angleDeg * Math.PI) / 180;
            const x = CX + SOCKET_RADIUS * Math.cos(rad);
            const y = CY + SOCKET_RADIUS * Math.sin(rad);

            return (
              <g key={`digit-${digit}`}>
                <circle
                  cx={x}
                  cy={y}
                  r={HOLE_RADIUS - 2}
                  className="fill-background-tertiary stroke-border/30"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={y + 5}
                  textAnchor="middle"
                  className="fill-foreground font-bold text-sm tracking-tighter"
                  style={{ pointerEvents: "none" }}
                >
                  {digit}
                </text>
              </g>
            );
          })}

          {/* Central Information Hub */}
          <circle
            cx={CX}
            cy={CY}
            r="54"
            className="fill-background-primary stroke-border"
            strokeWidth="2"
          />
          <circle
            cx={CX}
            cy={CY}
            r="48"
            className="fill-background-secondary stroke-border/50"
            strokeWidth="1"
          />
          <text
            x={CX}
            y={CY - 10}
            textAnchor="middle"
            className="fill-foreground-muted text-[8px] font-mono tracking-widest uppercase"
          >
            SYS / ROTARY
          </text>
          <text
            x={CX}
            y={CY + 8}
            textAnchor="middle"
            className="fill-foreground text-xs font-bold font-mono tracking-wider"
          >
            {lastDialed ? `NUM: ${lastDialed}` : "DIAL 1-9"}
          </text>
          <text
            x={CX}
            y={CY + 22}
            textAnchor="middle"
            className="fill-foreground-muted text-[7px] font-mono tracking-tight uppercase"
          >
            TELEMETRY
          </text>

          {/* =============================================================
              ROTATING ROTOR DISC (Rotates with pointer drag and springs back)
             ============================================================= */}
          <g
            style={{
              transformOrigin: `${CX}px ${CY}px`,
              transform: `rotate(${rotation}deg)`,
              transition: isDragging ? "none" : "transform 0.05s ease-out",
            }}
          >
            {/* Transparent Acrylic Rotor Disc Body */}
            <circle
              cx={CX}
              cy={CY}
              r="132"
              fill="rgba(255, 255, 255, 0.03)"
              className="stroke-border/40"
              strokeWidth="1.5"
            />

            {/* 9 Draggable Finger Sockets */}
            {SOCKET_ANGLES.map((angleDeg, idx) => {
              const digit = idx + 1;
              const rad = (angleDeg * Math.PI) / 180;
              const x = CX + SOCKET_RADIUS * Math.cos(rad);
              const y = CY + SOCKET_RADIUS * Math.sin(rad);
              const isActive = activeSocket === digit;

              return (
                <g
                  key={`socket-${digit}`}
                  onPointerDown={(e) => handlePointerDown(digit, e)}
                  className="cursor-pointer"
                >
                  {/* Outer Socket Rim */}
                  <circle
                    cx={x}
                    cy={y}
                    r={HOLE_RADIUS}
                    className={cn(
                      "transition-colors duration-150",
                      isActive
                        ? "fill-foreground/20 stroke-foreground"
                        : "fill-background/40 hover:fill-foreground/10 stroke-foreground/50 hover:stroke-foreground"
                    )}
                    strokeWidth="2"
                  />
                  {/* Inner Hole Cutout */}
                  <circle
                    cx={x}
                    cy={y}
                    r={HOLE_RADIUS - 4}
                    fill="transparent"
                  />
                </g>
              );
            })}
          </g>

          {/* =============================================================
              FIXED FINGER STOP BRACKET (Positioned at 60 deg)
             ============================================================= */}
          <line
            x1={stopOuterX}
            y1={stopOuterY}
            x2={stopInnerX}
            y2={stopInnerY}
            className="stroke-foreground stroke-[3]"
            strokeLinecap="round"
          />
          <circle
            cx={stopInnerX}
            cy={stopInnerY}
            r="4"
            className="fill-foreground"
          />
          <circle
            cx={stopOuterX}
            cy={stopOuterY}
            r="3"
            className="fill-border-strong stroke-foreground"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Telephony Status Readout */}
      <div className="w-full mt-3 flex items-center justify-between text-xs bg-background-secondary p-2 border border-border rounded-xs">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "w-2 h-2 rounded-full",
              isDragging
                ? "bg-amber-400 animate-pulse"
                : "bg-emerald-400"
            )}
          />
          <span className="text-[11px] text-foreground font-semibold">
            {dialMessage}
          </span>
        </div>
        <div className="text-[10px] text-foreground-muted">
          ROT: {Math.round(rotation)}&deg;
        </div>
      </div>
    </div>
  );
}
