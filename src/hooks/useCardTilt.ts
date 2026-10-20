"use client";

import { useRef, useState, useEffect, useCallback, CSSProperties } from "react";
import gsap from "gsap";

export interface CardTiltOptions {
  /** Maximum rotation angle in degrees along X and Y axes. Defaults to 12 */
  maxTilt?: number;
  /** Perspective distance in pixels. Defaults to 1000 */
  perspective?: number;
  /** Scale factor applied on card hover. Defaults to 1.025 */
  scale?: number;
  /** Duration of spring return in seconds when cursor exits. Defaults to 0.65 */
  returnDuration?: number;
  /** Whether tilt effect is disabled. Defaults to false */
  disabled?: boolean;
}

export interface CardTiltState {
  rotateX: number;
  rotateY: number;
  glareX: number;
  glareY: number;
  glareOpacity: number;
  isHovered: boolean;
}

export interface UseCardTiltReturn {
  cardRef: React.RefObject<HTMLDivElement | null>;
  glareRef: React.RefObject<HTMLDivElement | null>;
  tiltState: CardTiltState;
  cardStyle: CSSProperties;
  glareStyle: CSSProperties;
  onPointerMove: (e: React.PointerEvent<HTMLElement>) => void;
  onPointerEnter: (e: React.PointerEvent<HTMLElement>) => void;
  onPointerLeave: (e: React.PointerEvent<HTMLElement>) => void;
}

/**
 * 3D perspective tilt hook with dynamic specular radial glare and smooth spring return.
 * Mathematical formulation complies with Swiss-brutalist kinematics specifications:
 * - Normalized cursor coordinates (u, v) in [-1, 1]
 * - rotateX = -v * maxTilt
 * - rotateY =  u * maxTilt
 * - Specular glare at ((u + 1) * 50%, (v + 1) * 50%)
 * - Touch-safe: automatically bypasses tilt on coarse pointer devices.
 */
export function useCardTilt(options: CardTiltOptions = {}): UseCardTiltReturn {
  const {
    maxTilt = 12,
    perspective = 1000,
    scale = 1.025,
    returnDuration = 0.65,
    disabled = false,
  } = options;

  const cardRef = useRef<HTMLDivElement | null>(null);
  const glareRef = useRef<HTMLDivElement | null>(null);

  const [tiltState, setTiltState] = useState<CardTiltState>({
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50,
    glareOpacity: 0,
    isHovered: false,
  });

  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  // Detect coarse pointer (mobile / touch) devices
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(pointer: coarse)");
    setIsCoarsePointer(mq.matches);

    const handler = (e: MediaQueryListEvent) => {
      setIsCoarsePointer(e.matches);
    };

    if (mq.addEventListener) {
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, []);

  const handlePointerEnter = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (disabled || isCoarsePointer) return;

      if (cardRef.current) {
        gsap.killTweensOf(cardRef.current);
      }
      if (glareRef.current) {
        gsap.killTweensOf(glareRef.current);
      }

      setTiltState((prev) => ({ ...prev, isHovered: true }));
    },
    [disabled, isCoarsePointer]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (disabled || isCoarsePointer) return;

      const target = cardRef.current ?? (e.currentTarget as HTMLDivElement);
      if (!target) return;

      const rect = target.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      // Compute normalized centered coordinates u, v in [-1, 1]
      const halfW = rect.width / 2;
      const halfH = rect.height / 2;
      const rawU = (e.clientX - (rect.left + halfW)) / halfW;
      const rawV = (e.clientY - (rect.top + halfH)) / halfH;

      const u = Math.max(-1, Math.min(1, rawU));
      const v = Math.max(-1, Math.min(1, rawV));

      const rotX = -v * maxTilt;
      const rotY = u * maxTilt;

      const glareX = (u + 1) * 50;
      const glareY = (v + 1) * 50;
      const distance = Math.sqrt(u * u + v * v);
      const glareOpacity = Math.min(0.35, distance * 0.28);

      // Direct DOM update for silky 60fps performance without wait
      if (cardRef.current) {
        cardRef.current.style.transform = `perspective(${perspective}px) rotateX(${rotX.toFixed(
          2
        )}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`;
      }

      if (glareRef.current) {
        glareRef.current.style.background = `radial-gradient(circle at ${glareX.toFixed(
          1
        )}% ${glareY.toFixed(
          1
        )}%, rgba(255, 255, 255, ${glareOpacity.toFixed(
          3
        )}) 0%, rgba(255, 255, 255, 0.04) 45%, transparent 80%)`;
        glareRef.current.style.opacity = "1";
      }

      setTiltState({
        rotateX: rotX,
        rotateY: rotY,
        glareX,
        glareY,
        glareOpacity,
        isHovered: true,
      });
    },
    [disabled, isCoarsePointer, maxTilt, perspective, scale]
  );

  const handlePointerLeave = useCallback(() => {
    if (disabled || isCoarsePointer) return;

    setTiltState((prev) => ({
      ...prev,
      rotateX: 0,
      rotateY: 0,
      glareOpacity: 0,
      isHovered: false,
    }));

    // Smooth spring decay on mouseleave using GSAP power3.out
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
        duration: returnDuration,
        ease: "power3.out",
        overwrite: "auto",
      });
    }

    if (glareRef.current) {
      gsap.to(glareRef.current, {
        opacity: 0,
        duration: returnDuration,
        ease: "power3.out",
        overwrite: "auto",
      });
    }
  }, [disabled, isCoarsePointer, perspective, returnDuration]);

  // Fallback inline styles for SSR and initial render
  const cardStyle: CSSProperties = {
    transformStyle: "preserve-3d",
    willChange: "transform",
    transition: isCoarsePointer ? undefined : "box-shadow 0.3s ease",
  };

  const glareStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    borderRadius: "inherit",
    zIndex: 10,
    opacity: tiltState.glareOpacity,
    background: `radial-gradient(circle at ${tiltState.glareX}% ${tiltState.glareY}%, rgba(255, 255, 255, ${tiltState.glareOpacity}) 0%, rgba(255, 255, 255, 0.04) 45%, transparent 80%)`,
    transition: tiltState.isHovered ? "none" : `opacity ${returnDuration}s ease-out`,
  };

  return {
    cardRef,
    glareRef,
    tiltState,
    cardStyle,
    glareStyle,
    onPointerMove: handlePointerMove,
    onPointerEnter: handlePointerEnter,
    onPointerLeave: handlePointerLeave,
  };
}
