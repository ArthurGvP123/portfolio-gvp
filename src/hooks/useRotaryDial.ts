"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { playHapticClick } from "@/utils/audio";

/**
 * The 9 standard socket angles in degrees as specified:
 * Sockets 1 to 9 placed at:
 * [30deg, 0deg, 330deg, 300deg, 270deg, 240deg, 210deg, 180deg, 150deg]
 */
export const SOCKET_ANGLES = [30, 0, 330, 300, 270, 240, 210, 180, 150] as const;

/**
 * Mechanical finger stop angle positioned clockwise after socket 1 (at 60 degrees).
 */
export const FINGER_STOP_ANGLE = 60;

/**
 * Detent increment for tactile ratchet audio clicks (in degrees).
 */
export const DETENT_STEP_DEG = 15;

/**
 * Calculates polar angle in degrees [0, 360) from dial center to pointer coordinate.
 * 0 deg points along +X axis (3 o'clock), 90 deg points along +Y axis (6 o'clock).
 */
export function calculatePolarAngle(
  x: number,
  y: number,
  centerX: number,
  centerY: number
): number {
  const dx = x - centerX;
  const dy = y - centerY;
  const rad = Math.atan2(dy, dx);
  let deg = (rad * 180) / Math.PI;
  if (deg < 0) {
    deg += 360;
  }
  return deg;
}

/**
 * Calculates the shortest signed angular difference (current - previous)
 * accounting for 360-degree boundary wrapping.
 * Returns a value in [-180, 180].
 */
export function normalizeAngleDelta(current: number, previous: number): number {
  let delta = current - previous;
  while (delta > 180) delta -= 360;
  while (delta < -180) delta += 360;
  return delta;
}

/**
 * Computes the maximum clockwise rotation allowed for a given socket digit (1 through 9)
 * until it hits the finger stop (at 60 deg).
 * Socket 1 (30 deg) travels 30 deg.
 * Socket 2 (0 deg) travels 60 deg.
 * Socket k travels k * 30 deg.
 */
export function getSocketMaxRotation(socketNumber: number): number {
  if (socketNumber < 1 || socketNumber > 9) {
    return 0;
  }
  return socketNumber * 30;
}

/**
 * Calculates detent transitions between two rotation angles.
 * Returns an array of detent indices crossed.
 */
export function getDetentsCrossed(
  fromRot: number,
  toRot: number,
  step = DETENT_STEP_DEG
): number[] {
  const crossed: number[] = [];
  if (fromRot === toRot || step <= 0) return crossed;

  if (toRot > fromRot) {
    const start = Math.floor(fromRot / step) + 1;
    const end = Math.floor(toRot / step);
    for (let d = start; d <= end; d++) {
      crossed.push(d);
    }
  } else {
    const start = Math.floor(fromRot / step);
    const end = Math.floor(toRot / step) + 1;
    for (let d = start; d >= end; d--) {
      crossed.push(d);
    }
  }

  return crossed;
}

export interface UseRotaryDialOptions {
  onDialComplete?: (digit: number) => void;
  onDetentCross?: (detent: number, rotation: number) => void;
}

export function useRotaryDial({ onDialComplete, onDetentCross }: UseRotaryDialOptions = {}) {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [activeSocket, setActiveSocket] = useState<number | null>(null);

  const dialRef = useRef<HTMLDivElement>(null);
  const prevAngleRef = useRef<number>(0);
  const currentRotationRef = useRef<number>(0);
  const activeSocketRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Sync ref with state
  currentRotationRef.current = rotation;
  activeSocketRef.current = activeSocket;

  // Cleanup spring animation on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  const handlePointerDown = useCallback(
    (socketNumber: number, e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }

      if (!dialRef.current) return;
      const rect = dialRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const angle = calculatePolarAngle(e.clientX, e.clientY, centerX, centerY);
      prevAngleRef.current = angle;
      setActiveSocket(socketNumber);
      setIsDragging(true);

      playHapticClick(880);
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!activeSocketRef.current || !dialRef.current) return;

      const rect = dialRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const currentAngle = calculatePolarAngle(e.clientX, e.clientY, centerX, centerY);
      const delta = normalizeAngleDelta(currentAngle, prevAngleRef.current);
      prevAngleRef.current = currentAngle;

      const maxRot = getSocketMaxRotation(activeSocketRef.current);
      const prevRot = currentRotationRef.current;
      const nextRot = Math.max(0, Math.min(maxRot, prevRot + delta));

      if (nextRot !== prevRot) {
        const crossed = getDetentsCrossed(prevRot, nextRot, DETENT_STEP_DEG);
        for (const detent of crossed) {
          playHapticClick(650 + detent * 25);
          if (onDetentCross) {
            onDetentCross(detent, nextRot);
          }
        }

        setRotation(nextRot);
      }
    },
    [onDetentCross]
  );

  const springBack = useCallback(
    (startRot: number, dialedDigit: number | null) => {
      const startTime = performance.now();
      const duration = Math.min(600, Math.max(250, (startRot / 270) * 550));
      let lastCrossed = startRot;

      const animateReturn = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        // Spring bounce back easing: cubic deceleration
        const ease = 1 - Math.pow(1 - progress, 3);
        const currRot = startRot * (1 - ease);

        const crossed = getDetentsCrossed(lastCrossed, currRot, DETENT_STEP_DEG);
        if (crossed.length > 0) {
          playHapticClick(900 + crossed[0] * 30);
          lastCrossed = currRot;
        }

        setRotation(currRot);

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(animateReturn);
        } else {
          setRotation(0);
          setActiveSocket(null);
          setIsDragging(false);
          animFrameRef.current = null;

          if (dialedDigit !== null && onDialComplete) {
            onDialComplete(dialedDigit);
          }
        }
      };

      animFrameRef.current = requestAnimationFrame(animateReturn);
    },
    [onDialComplete]
  );

  const handlePointerUp = useCallback(() => {
    if (!activeSocketRef.current) return;

    const socketNum = activeSocketRef.current;
    const maxRot = getSocketMaxRotation(socketNum);
    const currRot = currentRotationRef.current;

    // If turned within 15 degrees of finger stop, count as dialed
    const dialed = currRot >= maxRot - 18 ? socketNum : null;

    springBack(currRot, dialed);
  }, [springBack]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointercancel", handlePointerUp);
    }
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  return {
    dialRef,
    rotation,
    isDragging,
    activeSocket,
    handlePointerDown,
  };
}
