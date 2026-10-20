"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { playHapticClick } from "@/utils/audio";
import { PRIMARY_EMAIL, CONTACT_CHANNELS } from "@/data/contacts";
import {
  RotateCcw,
  Compass,
  Radio,
  Activity,
  Mail,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export interface ObsidianMonolithCanvasProps {
  className?: string;
  fullscreen?: boolean;
  onDetentCrossed?: (detentIndex: number) => void;
}

interface OrbitalCTANode {
  id: string;
  platform: string;
  label: string;
  value: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  actionType: "copy" | "link";
  ringIndex: number;
  angle: number;
}

const ORBITAL_CTA_DATA: OrbitalCTANode[] = [
  {
    id: "email",
    platform: "Email",
    label: "DIRECT TRANSMISSION",
    value: PRIMARY_EMAIL,
    url: `mailto:${PRIMARY_EMAIL}`,
    icon: Mail,
    actionType: "copy",
    ringIndex: 1,
    angle: 0,
  },
  {
    id: "whatsapp",
    platform: "WhatsApp",
    label: "DIRECT COMM PROTOCOL",
    value: "+62 895-3256-05798",
    url: "https://wa.me/62895325605798?text=Hello%20Arthur%2C%20I%20visited%20your%20portfolio",
    icon: MessageCircle,
    actionType: "link",
    ringIndex: 1,
    angle: (Math.PI * 2) / 3, // 120 deg
  },
  {
    id: "linkedin",
    platform: "LinkedIn",
    label: "PROFESSIONAL NETWORK",
    value: "in/arthur-gregorius-pongoh",
    url: "https://www.linkedin.com/in/arthur-gregorius-pongoh-125322248",
    icon: LinkedInIcon,
    actionType: "link",
    ringIndex: 1,
    angle: (Math.PI * 4) / 3, // 240 deg
  },
  {
    id: "github",
    platform: "GitHub",
    label: "SOURCE REPOSITORY",
    value: "github/ArthurGvP123",
    url: "https://github.com/ArthurGvP123",
    icon: GitHubIcon,
    actionType: "link",
    ringIndex: 2,
    angle: Math.PI * 0.35, // ~63 deg on outer ring
  },
  {
    id: "instagram",
    platform: "Instagram",
    label: "VISUAL / CREATIVE LOG",
    value: "@arthurgvp",
    url: "https://www.instagram.com/arthurgvp",
    icon: InstagramIcon,
    actionType: "link",
    ringIndex: 2,
    angle: Math.PI * 1.35, // ~243 deg on outer ring
  },
];

/**
 * Checks whether WebGL context creation is supported in the current environment.
 * Prevents runtime crashes in headless browsers or disabled-GPU environments.
 */
function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export function ObsidianMonolithCanvas({
  className,
  fullscreen = false,
  onDetentCrossed,
}: ObsidianMonolithCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafIdRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const pointerPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastPointerPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const angularVelocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetTiltRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentTiltRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastDetentRef = useRef<number>(-1);
  const lastDetentSoundTimeRef = useRef<number>(0);

  const resetAnimationRef = useRef<{
    active: boolean;
    startTime: number;
    startEuler: THREE.Euler;
  }>({
    active: false,
    startTime: 0,
    startEuler: new THREE.Euler(),
  });

  const [webGLSupported, setWebGLSupported] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [telemetry, setTelemetry] = useState<{
    azimuth: number;
    elevation: number;
    rpm: number;
    status: string;
  }>({
    azimuth: 0,
    elevation: 0,
    rpm: 0.1,
    status: "STANDBY",
  });

  const monolithGroupRef = useRef<THREE.Group | null>(null);

  // References to the 5 orbital CTA HTML overlay containers for high-perf direct DOM transform
  const ctaBtnRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ctaAnchorsRef = useRef<THREE.Object3D[]>([]);

  const resetOrientation = useCallback(() => {
    playHapticClick(900);
    const group = monolithGroupRef.current;
    if (!group) return;

    resetAnimationRef.current = {
      active: true,
      startTime: performance.now(),
      startEuler: group.rotation.clone(),
    };
    angularVelocityRef.current = { x: 0, y: 0 };
    targetTiltRef.current = { x: 0, y: 0 };
  }, []);

  // 3-Tier Resilient Clipboard Copy Protocol for Email CTA
  const handleCopyEmail = useCallback(async () => {
    playHapticClick(960);
    let copySuccessful = false;

    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      navigator.clipboard.writeText
    ) {
      try {
        await navigator.clipboard.writeText(PRIMARY_EMAIL);
        copySuccessful = true;
      } catch {
        copySuccessful = false;
      }
    }

    if (!copySuccessful && typeof document !== "undefined") {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = PRIMARY_EMAIL;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        copySuccessful = document.execCommand("copy");
        document.body.removeChild(textArea);
      } catch {
        copySuccessful = false;
      }
    }

    setCopiedEmail(true);
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
    copyTimeoutRef.current = setTimeout(() => {
      setCopiedEmail(false);
    }, 2800);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!isWebGLAvailable()) {
      setWebGLSupported(false);
      return;
    }

    let width = container.clientWidth || window.innerWidth || 800;
    let height = container.clientHeight || window.innerHeight || 800;

    // 1. Scene & Camera Setup with Adaptive Responsive FOV
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);

    // Compute optimal camera distance so Monolith is never clipped and fits device perfectly
    const updateCameraDistance = (w: number, h: number) => {
      const aspect = w / h;
      let baseZ = 7.8;
      if (aspect < 0.7) {
        // Tall mobile screen (e.g. 375x812)
        baseZ = 7.8 * (1.35 / Math.max(aspect, 0.45));
      } else if (aspect < 1.0) {
        // Square or tablet portrait
        baseZ = 7.8 * (1.15 / aspect);
      } else if (aspect < 1.4) {
        // Tablet landscape / small desktop
        baseZ = 7.8 * (1.05 / Math.min(aspect, 1.2));
      }
      camera.position.set(0, 0.1, baseZ);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    updateCameraDistance(width, height);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      setWebGLSupported(false);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 2. Procedural Obsidian Monolith Hierarchy
    const monolithGroup = new THREE.Group();
    scene.add(monolithGroup);
    monolithGroupRef.current = monolithGroup;

    // A. Central Hexagonal Faceted Spire (Max base radius = 1.45, apex = 0.85, height = 4.6)
    const spireGeo = new THREE.CylinderGeometry(0.85, 1.45, 4.6, 6, 1);
    const spireMat = new THREE.MeshPhysicalMaterial({
      color: 0x090909,
      roughness: 0.12,
      metalness: 0.22,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      reflectivity: 0.9,
      flatShading: true,
    });
    const spireMesh = new THREE.Mesh(spireGeo, spireMat);
    monolithGroup.add(spireMesh);

    // B. Brutalist High-Contrast Wireframe Edges
    const edgesGeo = new THREE.EdgesGeometry(spireGeo);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
    });
    const wireframeEdges = new THREE.LineSegments(edgesGeo, edgesMat);
    monolithGroup.add(wireframeEdges);

    // C. Non-Intersecting Solid Orbital Telemetry Rings (Anti-Clipping Physics)
    // Ring radii are strictly greater than maximum spire radius (R1 = 2.95, R2 = 3.75 > 1.45).
    // Tilt inclination is bounded to +/- 18 deg so the ring NEVER breaches the monolith volume.
    const ringsGroup = new THREE.Group();
    monolithGroup.add(ringsGroup);

    // Ring 1 (Inner telemetry ring, radius 2.95)
    const ring1Radius = 2.95;
    const ring1Geo = new THREE.TorusGeometry(ring1Radius, 0.024, 4, 64);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.88,
      roughness: 0.18,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI * 0.18; // Stable ~32° inclination (strict anti-penetration clearance)
    ringsGroup.add(ring1);

    // Ring 2 (Outer telemetry ring, radius 3.75)
    const ring2Radius = 3.75;
    const ring2Geo = new THREE.TorusGeometry(ring2Radius, 0.02, 4, 64);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x888888,
      metalness: 0.92,
      roughness: 0.25,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI * 0.22;
    ring2.rotation.z = Math.PI * 0.14;
    ringsGroup.add(ring2);

    // Anchor nodes for the 5 dynamic 3D projected CTA buttons
    const anchors: THREE.Object3D[] = [];
    ORBITAL_CTA_DATA.forEach((cta) => {
      const anchor = new THREE.Object3D();
      const radius = cta.ringIndex === 1 ? ring1Radius : ring2Radius;
      const targetRing = cta.ringIndex === 1 ? ring1 : ring2;

      // Position along circumference of the respective ring
      anchor.position.set(
        Math.cos(cta.angle) * radius,
        Math.sin(cta.angle) * radius,
        0
      );
      targetRing.add(anchor);

      // Add small glowing beacon sphere at the ring contact point
      const beaconPointGeo = new THREE.SphereGeometry(0.065, 8, 8);
      const beaconPointMat = new THREE.MeshBasicMaterial({
        color: cta.id === "email" ? 0x10b981 : 0xffffff,
      });
      const beaconPointMesh = new THREE.Mesh(beaconPointGeo, beaconPointMat);
      anchor.add(beaconPointMesh);

      anchors.push(anchor);
    });
    ctaAnchorsRef.current = anchors;

    // D. Apex Signal Beacon Core & PointLight
    const beaconGeo = new THREE.OctahedronGeometry(0.2, 0);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
    beaconMesh.position.set(0, 2.4, 0);
    monolithGroup.add(beaconMesh);

    const beaconLight = new THREE.PointLight(0xffffff, 2.4, 7.0);
    beaconLight.position.set(0, 2.4, 0);
    monolithGroup.add(beaconLight);

    // E. Ascending Signal Emission Particles (84 points)
    const particleCount = 84;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.35 + Math.random() * 2.2;
      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 5.6;
      particlePositions[i * 3 + 2] = Math.sin(angle) * radius;
      particleVelocities[i] = 0.007 + Math.random() * 0.014;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );
    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.038,
      transparent: true,
      opacity: 0.5,
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    monolithGroup.add(particlePoints);

    // F. Base Horizon Calibration Ring (Outside spire base)
    const baseRingGeo = new THREE.RingGeometry(2.1, 2.14, 48);
    const baseRingMat = new THREE.MeshBasicMaterial({
      color: 0x333333,
      side: THREE.DoubleSide,
    });
    const baseRing = new THREE.Mesh(baseRingGeo, baseRingMat);
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.y = -2.35;
    monolithGroup.add(baseRing);

    // 3. Stage Lighting
    const ambientLight = new THREE.AmbientLight(0x1a1a1a, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.4);
    keyLight.position.set(4, 7, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x778899, 1.6);
    rimLight.position.set(-5, -2, -4);
    scene.add(rimLight);

    // 4. Interaction Handlers with Anti-Penetration Angular Clamping
    const handlePointerDown = (e: PointerEvent) => {
      // Don't drag if clicking directly on a CTA button overlay
      const target = e.target as HTMLElement | null;
      if (target && target.closest("[data-cta-button='true']")) {
        return;
      }

      isDraggingRef.current = true;
      pointerPosRef.current = { x: e.clientX, y: e.clientY };
      lastPointerPosRef.current = { x: e.clientX, y: e.clientY };
      angularVelocityRef.current = { x: 0, y: 0 };
      resetAnimationRef.current.active = false;
      playHapticClick(620);
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      // Clamp target tilt within safe non-penetrating angular bounds (+/- 0.22 rad)
      targetTiltRef.current = {
        x: THREE.MathUtils.clamp(-ndcY * 0.22, -0.24, 0.24),
        y: THREE.MathUtils.clamp(ndcX * 0.22, -0.24, 0.24),
      };

      if (!isDraggingRef.current) return;

      const deltaX = e.clientX - lastPointerPosRef.current.x;
      const deltaY = e.clientY - lastPointerPosRef.current.y;
      lastPointerPosRef.current = { x: e.clientX, y: e.clientY };

      // Apply tangential rotation with safe velocity clamping
      const rotY = THREE.MathUtils.clamp(deltaX * 0.007, -0.07, 0.07);
      const rotX = THREE.MathUtils.clamp(deltaY * 0.007, -0.07, 0.07);

      angularVelocityRef.current = { x: rotX, y: rotY };
      monolithGroup.rotation.y += rotY;

      // Solid body constraint: Pitch rotation is strictly clamped between -0.32 and 0.32 rad
      monolithGroup.rotation.x = THREE.MathUtils.clamp(
        monolithGroup.rotation.x + rotX,
        -0.32,
        0.32
      );
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    const handleDoubleClick = () => {
      resetOrientation();
    };

    container.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    container.addEventListener("dblclick", handleDoubleClick);

    // Resize Observer for Dynamic Viewport Adaptation
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0) {
          width = newW;
          height = newH;
          updateCameraDistance(width, height);
          renderer.setSize(width, height);
        }
      }
    });
    resizeObserver.observe(container);

    // 5. Render Loop with Inertia, Idle Drift & Dynamic 3D Projected CTA Coordinates
    let lastTime = performance.now();
    let frameCounter = 0;
    const tempVec = new THREE.Vector3();

    const animate = (time: number) => {
      rafIdRef.current = requestAnimationFrame(animate);
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;
      frameCounter++;

      // Handle Smooth Reset Animation
      if (resetAnimationRef.current.active) {
        const elapsed = (time - resetAnimationRef.current.startTime) / 800; // 800ms
        if (elapsed >= 1) {
          monolithGroup.rotation.set(0, 0, 0);
          resetAnimationRef.current.active = false;
        } else {
          const t = 1 - Math.pow(1 - elapsed, 3);
          const start = resetAnimationRef.current.startEuler;
          monolithGroup.rotation.x = THREE.MathUtils.lerp(start.x, 0, t);
          monolithGroup.rotation.y = THREE.MathUtils.lerp(start.y, 0, t);
          monolithGroup.rotation.z = THREE.MathUtils.lerp(start.z, 0, t);
        }
      } else {
        // Inertia damping when not dragging
        if (!isDraggingRef.current) {
          angularVelocityRef.current.x *= 0.94;
          angularVelocityRef.current.y *= 0.94;

          // Idle drift when velocity drops
          if (
            Math.abs(angularVelocityRef.current.x) < 0.0001 &&
            Math.abs(angularVelocityRef.current.y) < 0.0001
          ) {
            monolithGroup.rotation.y += 0.0028;
          } else {
            monolithGroup.rotation.y += angularVelocityRef.current.y;
            monolithGroup.rotation.x = THREE.MathUtils.clamp(
              monolithGroup.rotation.x + angularVelocityRef.current.x,
              -0.32,
              0.32
            );
          }
        }

        // Smooth cursor tilt tracking with anti-clipping clamp
        currentTiltRef.current.x +=
          (targetTiltRef.current.x - currentTiltRef.current.x) * 0.05;
        currentTiltRef.current.y +=
          (targetTiltRef.current.y - currentTiltRef.current.y) * 0.05;

        spireMesh.rotation.x = currentTiltRef.current.x;
        spireMesh.rotation.z = -currentTiltRef.current.y * 0.45;
        wireframeEdges.rotation.x = spireMesh.rotation.x;
        wireframeEdges.rotation.z = spireMesh.rotation.z;

        // Subtle vertical floating wave
        monolithGroup.position.y = Math.sin(time * 0.0016) * 0.08;
      }

      // Orbital Rings counter-rotation (smooth non-intersecting planetary motion)
      ring1.rotation.z += 0.008;
      ring2.rotation.z -= 0.006;

      // Update 3D projected screen coordinates for the 5 orbital CTA buttons
      anchors.forEach((anchor, idx) => {
        const btnEl = ctaBtnRefs.current[idx];
        if (!btnEl) return;

        anchor.getWorldPosition(tempVec);
        tempVec.project(camera);

        // Convert normalized device coordinates (NDC -1 to +1) to screen pixels
        const screenX = ((tempVec.x + 1) * width) / 2;
        const screenY = ((-tempVec.y + 1) * height) / 2;

        // Depth perspective scale & visibility
        const isFacingUser = tempVec.z < 1.0;
        const scale = THREE.MathUtils.clamp(
          THREE.MathUtils.mapLinear(tempVec.z, -1.0, 1.0, 1.08, 0.82),
          0.75,
          1.15
        );
        const opacity = THREE.MathUtils.clamp(
          THREE.MathUtils.mapLinear(tempVec.z, -0.6, 0.95, 1.0, 0.65),
          0.55,
          1.0
        );

        // Direct DOM matrix transform for silky 60 FPS performance
        btnEl.style.transform = `translate3d(${screenX}px, ${screenY}px, 0) scale(${scale})`;
        btnEl.style.opacity = isFacingUser ? `${opacity}` : "0";
        btnEl.style.zIndex = tempVec.z < 0.2 ? "25" : "15";
      });

      // Particle column ascending animation
      const posAttr = particleGeo.getAttribute(
        "position"
      ) as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3 + 1] += particleVelocities[i];
        if (posArray[i * 3 + 1] > 2.8) {
          posArray[i * 3 + 1] = -2.2;
        }
      }
      posAttr.needsUpdate = true;

      // Beacon Light subtle pulsation
      beaconLight.intensity = 1.8 + Math.sin(time * 0.005) * 0.6;

      // 30-Degree Detent Ratchet Clicks (12 detents per 360 deg)
      const currentYawDeg =
        ((THREE.MathUtils.radToDeg(monolithGroup.rotation.y) % 360) + 360) %
        360;
      const currentDetent = Math.floor(currentYawDeg / 30);

      if (
        currentDetent !== lastDetentRef.current &&
        time - lastDetentSoundTimeRef.current >= 35
      ) {
        if (lastDetentRef.current !== -1) {
          const clickFreq = 760 + (currentDetent % 12) * 15;
          playHapticClick(clickFreq);
          if (onDetentCrossed) {
            onDetentCrossed(currentDetent);
          }
        }
        lastDetentRef.current = currentDetent;
        lastDetentSoundTimeRef.current = time;
      }

      // Update Live Telemetry State (every 6 frames to minimize React state overhead)
      if (frameCounter % 6 === 0) {
        const az = Math.round(currentYawDeg);
        const el = Math.round(
          THREE.MathUtils.radToDeg(monolithGroup.rotation.x)
        );
        const rpm =
          Math.round(
            (((Math.abs(angularVelocityRef.current.y) * 60 * 60) /
              (2 * Math.PI)) *
              10)
          ) / 10;
        setTelemetry({
          azimuth: az,
          elevation: el,
          rpm: isDraggingRef.current ? rpm : 0.3,
          status: isDraggingRef.current ? "TRACKING" : "TRANSMITTING",
        });
      }

      renderer.render(scene, camera);
    };

    rafIdRef.current = requestAnimationFrame(animate);
    setIsInitialized(true);

    // 6. Deterministic Disposal Protocol
    return () => {
      cancelAnimationFrame(rafIdRef.current);
      resizeObserver.disconnect();

      container.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      container.removeEventListener("dblclick", handleDoubleClick);

      scene.traverse((obj) => {
        if (
          obj instanceof THREE.Mesh ||
          obj instanceof THREE.LineSegments ||
          obj instanceof THREE.Points
        ) {
          if (obj.geometry) {
            obj.geometry.dispose();
          }
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach((mat) => mat.dispose());
            } else {
              obj.material.dispose();
            }
          }
        }
      });

      renderer.dispose();
      renderer.forceContextLoss();
      const gl = renderer.getContext();
      if (gl) {
        const loseContext = gl.getExtension("WEBGL_lose_context");
        if (loseContext) {
          loseContext.loseContext();
        }
      }
      if (renderer.domElement && renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
      monolithGroupRef.current = null;
      ctaAnchorsRef.current = [];
    };
  }, [onDetentCrossed, resetOrientation]);

  return (
    <div
      ref={containerRef}
      data-lenis-prevent
      className={cn(
        fullscreen
          ? "fixed inset-0 w-full h-full min-h-screen bg-background overflow-hidden select-none cursor-grab active:cursor-grabbing font-mono z-0"
          : "relative w-full h-[400px] sm:h-[480px] lg:h-[580px] bg-background-secondary/40 border border-border rounded-xs overflow-hidden select-none cursor-grab active:cursor-grabbing font-mono",
        className
      )}
      role="region"
      aria-label="3D Interactive Obsidian Monolith Centerpiece with Orbital CTA Nodes"
    >
      {/* Precision Crosshairs in Viewport Corners */}
      <span className="absolute top-4 left-4 text-[11px] text-foreground-muted pointer-events-none select-none opacity-40 z-10">
        +
      </span>
      <span className="absolute top-4 right-4 text-[11px] text-foreground-muted pointer-events-none select-none opacity-40 z-10">
        +
      </span>
      <span className="absolute bottom-4 left-4 text-[11px] text-foreground-muted pointer-events-none select-none opacity-40 z-10">
        +
      </span>
      <span className="absolute bottom-4 right-4 text-[11px] text-foreground-muted pointer-events-none select-none opacity-40 z-10">
        +
      </span>

      {/* Top HUD Bar: Frequency Beacon & Live Reset Button */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[11px] tracking-wider pointer-events-none z-20">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-background/85 border border-border/80 rounded-xs backdrop-blur-md">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="font-bold text-foreground">
            OBSIDIAN MONOLITH // CARRIER ACTIVE
          </span>
          <span className="text-foreground-muted hidden sm:inline">
            [{telemetry.status}]
          </span>
        </div>

        {/* Orientation Reset Button */}
        <button
          type="button"
          onClick={resetOrientation}
          aria-label="Reset monolith orientation to default frontal position"
          className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 bg-background/85 hover:bg-foreground hover:text-background border border-border hover:border-foreground rounded-xs text-[11px] text-foreground-secondary transition-all cursor-pointer backdrop-blur-md"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">RESET ORIENTATION</span>
        </button>
      </div>

      {/* 5 Dynamic 3D Projected Orbital CTA Buttons (Direct DOM projected via vector.project) */}
      {isInitialized &&
        webGLSupported &&
        ORBITAL_CTA_DATA.map((cta, idx) => {
          const Icon = cta.icon;
          const isEmail = cta.actionType === "copy";

          return (
            <div
              key={cta.id}
              ref={(el) => {
                ctaBtnRefs.current[idx] = el;
              }}
              data-cta-button="true"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                willChange: "transform, opacity",
                transform: "translate3d(-9999px, -9999px, 0)", // Offscreen until calculated
              }}
              className="pointer-events-auto select-none"
            >
              <div className="relative -translate-x-1/2 -translate-y-1/2 group">
                {/* Orbital Anchor Radar Reticle */}
                <span className="absolute -top-1 -left-1 w-2 h-2 rounded-full border border-foreground/50 opacity-40 group-hover:opacity-100 group-hover:scale-125 transition-transform" />

                {/* Primary Orbital Action Card */}
                {isEmail ? (
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    aria-label={`Copy email address ${cta.value}`}
                    className={cn(
                      "flex items-center gap-2.5 px-3.5 py-2 rounded-xs border backdrop-blur-md transition-all cursor-pointer shadow-lg",
                      copiedEmail
                        ? "bg-emerald-950/90 border-emerald-500 text-emerald-300"
                        : "bg-background/90 hover:bg-foreground hover:text-background border-border/90 hover:border-foreground text-foreground"
                    )}
                  >
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full",
                        copiedEmail
                          ? "bg-emerald-400 animate-ping"
                          : "bg-emerald-500 animate-pulse"
                      )}
                    />
                    <Icon className="w-4 h-4 shrink-0" />
                    <div className="text-left font-mono">
                      <div className="text-[9px] text-foreground-muted tracking-widest uppercase">
                        {copiedEmail ? "EMAIL COPIED!" : cta.label}
                      </div>
                      <div className="text-xs font-bold tracking-tight">
                        {copiedEmail ? "COPIED TO CLIPBOARD" : cta.value}
                      </div>
                    </div>
                    {copiedEmail ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 shrink-0" />
                    )}
                  </button>
                ) : (
                  <a
                    href={cta.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playHapticClick(850)}
                    aria-label={`Open ${cta.platform}: ${cta.value}`}
                    className="flex items-center gap-2.5 px-3.5 py-2 bg-background/90 hover:bg-foreground hover:text-background border border-border/90 hover:border-foreground text-foreground rounded-xs backdrop-blur-md transition-all cursor-pointer shadow-lg"
                  >
                    <span className="w-2 h-2 rounded-full bg-foreground-muted/60 group-hover:bg-background group-hover:animate-ping" />
                    <Icon className="w-4 h-4 shrink-0" />
                    <div className="text-left font-mono">
                      <div className="text-[9px] text-foreground-muted group-hover:text-background/80 tracking-widest uppercase">
                        {cta.platform}
                      </div>
                      <div className="text-xs font-bold tracking-tight">
                        {cta.value}
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 shrink-0" />
                  </a>
                )}
              </div>
            </div>
          );
        })}

      {/* Bottom HUD Bar: Azimuth, Elevation & Interaction Guide */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-[11px] tracking-wider pointer-events-none z-20">
        <div className="flex items-center gap-3 px-3 py-1.5 bg-background/85 border border-border/80 rounded-xs backdrop-blur-md">
          <div className="flex items-center gap-1.5 text-foreground-secondary">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>AZ: {telemetry.azimuth}°</span>
          </div>
          <span className="text-border">|</span>
          <div className="flex items-center gap-1.5 text-foreground-secondary">
            <Activity className="w-3.5 h-3.5 text-foreground-muted" />
            <span>EL: {telemetry.elevation}°</span>
          </div>
        </div>

        <div className="px-3 py-1.5 bg-background/70 border border-border/60 rounded-xs text-[10px] text-foreground-muted backdrop-blur-md">
          [DRAG MONOLITH TO ROTATE ORBIT // CLICK CTA NODES TO TRANSMIT]
        </div>
      </div>

      {/* Zero-CLS Skeleton while Three.js initializes */}
      {!isInitialized && webGLSupported && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-background/95 select-none z-10"
          role="status"
          aria-label="Loading 3D Obsidian Monolith"
        >
          <div className="w-12 h-12 border border-foreground/30 rounded-full animate-ping opacity-35 mb-4" />
          <span className="font-mono text-xs text-foreground font-bold tracking-widest uppercase">
            INITIALIZING 3D WEBGL MONOLITH // CALIBRATING 3D MONOLITH ORBITS
          </span>
          <span className="font-mono text-[10px] text-foreground-muted uppercase tracking-wider mt-1">
            BUFFERING SHADERS &bull; ALIGNING PROCEDURAL GIMBALS &bull; PROJECTING CTA NODES
          </span>
        </div>
      )}

      {/* Graceful 2D Fallback for Non-WebGL / Headless Environments */}
      {!webGLSupported && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-background z-20 space-y-6">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <div className="absolute inset-0 border border-foreground/20 rounded-full animate-ping opacity-25" />
            <div className="absolute inset-3 border border-dashed border-foreground/40 rounded-full animate-spin [animation-duration:12s]" />
            <div className="w-14 h-20 bg-gradient-to-b from-foreground/80 via-foreground/20 to-transparent border border-foreground/50" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold tracking-widest text-foreground uppercase block font-mono">
              OBSIDIAN SIGNAL MONOLITH // 2D DIRECT TRANSMISSION
            </span>
            <span className="text-[10px] text-foreground-muted tracking-wider block font-mono">
              [WEBGL ACCELERATION STANDBY // NOMINAL TRANSMISSION ACTIVE]
            </span>
          </div>
          {/* Fallback buttons in 2D mode */}
          <div className="flex flex-wrap gap-2 justify-center max-w-md pt-2">
            {ORBITAL_CTA_DATA.map((cta) => (
              <a
                key={cta.id}
                href={cta.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 border border-border text-xs font-mono text-foreground hover:bg-foreground hover:text-background rounded-xs"
              >
                {cta.platform}: {cta.value}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
