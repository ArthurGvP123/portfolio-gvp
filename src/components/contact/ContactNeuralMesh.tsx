"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { CONTACT_CHANNELS, PRIMARY_EMAIL } from "@/data/contacts";
import { ContactChannel } from "@/types/portfolio";
import { playHapticClick } from "@/utils/audio";
import { disposeThreeScene } from "@/hooks/useThreeSphere";
import { Mail, MessageCircle } from "lucide-react";

function BrandIcon({
  platform,
  className = "w-5 h-5",
}: {
  platform: string;
  className?: string;
}) {
  if (platform === "Email") return <Mail className={className} />;
  if (platform === "WhatsApp") return <MessageCircle className={className} />;
  if (platform === "LinkedIn") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46v-8.37M7.84 6.7a1.61 1.61 0 1 0 0 3.22 1.61 1.61 0 0 0 0-3.22Z" />
      </svg>
    );
  }
  if (platform === "GitHub") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
      </svg>
    );
  }
  if (platform === "Instagram") {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    );
  }
  return <Mail className={className} />;
}

const SVG_ICONS: Record<string, string> = {
  Email: `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  WhatsApp: `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`,
  LinkedIn: `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="#ffffff"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46v-8.37M7.84 6.7a1.61 1.61 0 1 0 0 3.22 1.61 1.61 0 0 0 0-3.22Z"/></svg>`,
  GitHub: `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="#ffffff"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"/></svg>`,
  Instagram: `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>`,
};

/**
 * Procedural 4-point stellar lens flare texture generator for Scorpius white stars.
 */
function createDiffractionSpikeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const cx = 64;
    const cy = 64;

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60);
    grad.addColorStop(0, "rgba(255, 255, 255, 1)");
    grad.addColorStop(0.12, "rgba(255, 255, 255, 0.85)");
    grad.addColorStop(0.35, "rgba(220, 240, 255, 0.25)");
    grad.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    const hGrad = ctx.createLinearGradient(0, cy, 128, cy);
    hGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
    hGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.95)");
    hGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = hGrad;
    ctx.fillRect(0, cy - 1.5, 128, 3);

    const vGrad = ctx.createLinearGradient(cx, 0, cx, 128);
    vGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
    vGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.95)");
    vGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = vGrad;
    ctx.fillRect(cx - 1.5, 0, 3, 128);
  }
  return new THREE.CanvasTexture(canvas);
}

/**
 * Procedural soft circular star texture for muted background stars.
 * Ensures background stars are soft anti-aliased orbs matching the white dots of Scorpius.
 */
function createCircularStarTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const cx = 32;
    const cy = 32;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30);
    grad.addColorStop(0, "rgba(255, 255, 255, 1)");
    grad.addColorStop(0.45, "rgba(235, 238, 245, 0.85)");
    grad.addColorStop(0.75, "rgba(180, 185, 200, 0.35)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
  }
  return new THREE.CanvasTexture(canvas);
}

/**
 * Soft radial cloud texture for procedural monochromatic nebula particles.
 */
function createNebulaCloudTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const cx = 128;
    const cy = 128;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 120);
    grad.addColorStop(0, "rgba(255, 255, 255, 0.85)");
    grad.addColorStop(0.35, "rgba(200, 200, 215, 0.35)");
    grad.addColorStop(0.7, "rgba(160, 160, 180, 0.08)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  return new THREE.CanvasTexture(canvas);
}

// Configuration of the 5 CTA Nodes on the Scorpius Constellation
interface CTANodeConfig {
  channelPlatform: string;
  colorHex: string;
  colorNum: number;
  activeGlowCss: string;
}

const CTA_CONFIGS: Record<string, CTANodeConfig> = {
  LinkedIn: {
    channelPlatform: "LinkedIn",
    colorHex: "#0077b5",
    colorNum: 0x0077b5,
    activeGlowCss: "shadow-[0_0_16px_rgba(0,119,181,0.85)] border-[#0077b5]",
  },
  Email: {
    channelPlatform: "Email",
    colorHex: "#ef4444",
    colorNum: 0xef4444,
    activeGlowCss: "shadow-[0_0_16px_rgba(239,68,68,0.85)] border-[#ef4444]",
  },
  GitHub: {
    channelPlatform: "GitHub",
    colorHex: "#94a3b8",
    colorNum: 0x94a3b8,
    activeGlowCss: "shadow-[0_0_16px_rgba(148,163,184,0.75)] border-[#94a3b8]",
  },
  Instagram: {
    channelPlatform: "Instagram",
    colorHex: "#ec4899",
    colorNum: 0xec4899,
    activeGlowCss: "shadow-[0_0_16px_rgba(236,72,153,0.85)] border-[#ec4899]",
  },
  WhatsApp: {
    channelPlatform: "WhatsApp",
    colorHex: "#22c55e",
    colorNum: 0x22c55e,
    activeGlowCss: "shadow-[0_0_16px_rgba(34,197,94,0.85)] border-[#22c55e]",
  },
};

// 12 Constellation Stars Base Spatial Coordinates
const SCORPIUS_RAW_COORDS = [
  // 3 White Stars of Top-Right Claws
  { pos: new THREE.Vector3(3.8, 4.1, 0), isCTA: false }, // 0: Top Claw
  { pos: new THREE.Vector3(4.2, 3.2, 0), isCTA: false }, // 1: Mid Claw
  { pos: new THREE.Vector3(4.0, 1.9, 0), isCTA: false }, // 2: Bottom Claw
  // CTA 1: LinkedIn (Head Node / Claw Hub)
  { pos: new THREE.Vector3(1.7, 2.2, 0), isCTA: true, ctaKey: "LinkedIn" }, // 3: LinkedIn
  // White Star on Neck
  { pos: new THREE.Vector3(1.1, 1.5, 0), isCTA: false }, // 4: Neck
  // CTA 2: Email (Heart / Antares position)
  { pos: new THREE.Vector3(-0.2, -0.4, 0), isCTA: true, ctaKey: "Email" }, // 5: Email
  // White Star on Upper Spine
  { pos: new THREE.Vector3(-0.5, -1.7, 0), isCTA: false }, // 6: Spine
  // CTA 3: GitHub (Lower Spine)
  { pos: new THREE.Vector3(-0.8, -3.2, 0), isCTA: true, ctaKey: "GitHub" }, // 7: GitHub
  // White Star on Bottom Tail Curve
  { pos: new THREE.Vector3(-2.0, -3.3, 0), isCTA: false }, // 8: Tail Bottom-Mid
  // CTA 4: Instagram (Tail Corner)
  { pos: new THREE.Vector3(-3.6, -3.3, 0), isCTA: true, ctaKey: "Instagram" }, // 9: Instagram
  // White Star on Upward Stinger Curve
  { pos: new THREE.Vector3(-4.3, -2.2, 0), isCTA: false }, // 10: Stinger Joint
  // CTA 5: WhatsApp (Stinger Tip)
  { pos: new THREE.Vector3(-3.5, -1.0, 0), isCTA: true, ctaKey: "WhatsApp" }, // 11: WhatsApp
];

// 11 Line connections tracing the Scorpius skeleton exactly as reference
const SCORPIUS_EDGES: [number, number][] = [
  [0, 3], // Top Claw to LinkedIn (Head Hub)
  [1, 3], // Mid Claw to LinkedIn (Head Hub)
  [2, 3], // Bottom Claw to LinkedIn (Head Hub)
  [3, 4], // LinkedIn (Head Hub) to Neck
  [4, 5], // Neck to Email (Heart/Antares)
  [5, 6], // Email to Spine
  [6, 7], // Spine to GitHub (Lower Spine)
  [7, 8], // GitHub to Tail Bottom-Mid
  [8, 9], // Tail Bottom-Mid to Instagram (Tail Corner)
  [9, 10], // Instagram to Stinger Joint
  [10, 11], // Stinger Joint to WhatsApp (Stinger Tip)
];

// Six Peripheral Zodiac Constellations (Same scale as Scorpius, spaced out without collisions)
interface ZodiacConstellationDef {
  name: string;
  center: THREE.Vector3;
  stars: THREE.Vector3[];
  edges: [number, number][];
}

const ZODIAC_CONSTELLATIONS: ZodiacConstellationDef[] = [
  // 1. Sagittarius (Sagitarius / The Teapot) - East / Right
  {
    name: "Sagittarius",
    center: new THREE.Vector3(17.0, -2.0, -1.0),
    stars: [
      new THREE.Vector3(-3.4, 0.2, 0), // 0: Alnasl (Spout tip)
      new THREE.Vector3(-1.8, 0.7, 0), // 1: Kaus Media (Spout base)
      new THREE.Vector3(-1.2, -2.4, 0), // 2: Kaus Australis (Bowl base left)
      new THREE.Vector3(1.6, -2.2, 0), // 3: Ascella (Bowl base right)
      new THREE.Vector3(-0.8, 2.7, 0), // 4: Kaus Borealis (Lid top)
      new THREE.Vector3(2.5, 1.3, 0), // 5: Nunki (Handle top)
      new THREE.Vector3(2.7, -0.7, 0), // 6: Tau Sgr (Handle bottom)
      new THREE.Vector3(0.6, 1.2, 0), // 7: Phi Sgr (Lid base)
    ],
    edges: [
      [0, 1],
      [1, 4],
      [1, 2],
      [2, 3],
      [3, 7],
      [7, 4],
      [7, 5],
      [5, 6],
      [6, 3],
    ],
  },
  // 2. Capricorn (Capricorn / The Sea-Goat Wedge) - North-East / Upper-Right
  {
    name: "Capricorn",
    center: new THREE.Vector3(16.5, 12.0, -1.2),
    stars: [
      new THREE.Vector3(-3.2, 2.2, 0), // 0: Algedi (Horn top)
      new THREE.Vector3(-2.8, 0.8, 0), // 1: Dabih (Horn bottom)
      new THREE.Vector3(-0.2, 0.3, 0), // 2: Theta Cap (Dorsal)
      new THREE.Vector3(-0.6, -2.0, 0), // 3: Iota Cap (Belly)
      new THREE.Vector3(1.8, -2.4, 0), // 4: Zeta Cap (Belly right)
      new THREE.Vector3(3.2, -1.4, 0), // 5: Omega Cap (Tail under)
      new THREE.Vector3(3.6, 0.8, 0), // 6: Deneb Algedi (Tail tip)
      new THREE.Vector3(2.6, 1.6, 0), // 7: Nashira (Tail upper)
    ],
    edges: [
      [0, 1],
      [1, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 2],
      [2, 1],
      [0, 7],
    ],
  },
  // 3. Aquarius (Aquarius / The Water Bearer & Streams) - North / Upper-Center
  {
    name: "Aquarius",
    center: new THREE.Vector3(1.0, 16.0, -1.0),
    stars: [
      new THREE.Vector3(0.8, 2.4, 0), // 0: Sadalmelik (Shoulder right)
      new THREE.Vector3(-1.8, 2.8, 0), // 1: Sadalsuud (Shoulder left)
      new THREE.Vector3(2.4, 1.6, 0), // 2: Sadachbia (Urn mouth)
      new THREE.Vector3(2.8, 2.9, 0), // 3: Gamma Aqr (Urn top)
      new THREE.Vector3(3.7, 1.5, 0), // 4: Eta Aqr (Urn right)
      new THREE.Vector3(0.0, 0.6, 0), // 5: Zeta Aqr (Torso)
      new THREE.Vector3(-0.7, -1.4, 0), // 6: Ancha (Hip)
      new THREE.Vector3(-2.0, -3.2, 0), // 7: Skat (Leg)
      new THREE.Vector3(2.8, -0.3, 0), // 8: Stream 1
      new THREE.Vector3(3.3, -1.9, 0), // 9: Stream 2
      new THREE.Vector3(2.6, -3.4, 0), // 10: Stream 3
    ],
    edges: [
      [1, 5],
      [5, 0],
      [0, 2],
      [2, 3],
      [2, 4],
      [3, 4],
      [2, 8],
      [8, 9],
      [9, 10],
      [5, 6],
      [6, 7],
    ],
  },
  // 4. Leo (Leo / The Lion & Sickle) - North-West / Upper-Left
  {
    name: "Leo",
    center: new THREE.Vector3(-15.0, 12.5, -1.2),
    stars: [
      new THREE.Vector3(-2.2, -2.6, 0), // 0: Regulus (Heart)
      new THREE.Vector3(-2.4, -0.6, 0), // 1: Al Jabhah (Neck)
      new THREE.Vector3(-1.5, 0.8, 0), // 2: Algieba (Mane)
      new THREE.Vector3(-0.8, 2.4, 0), // 3: Adhafera (Crest)
      new THREE.Vector3(0.5, 2.8, 0), // 4: Rasalas (Nose)
      new THREE.Vector3(1.0, 1.6, 0), // 5: Al Minliar (Muzzle)
      new THREE.Vector3(1.8, 0.6, 0), // 6: Zosma (Back)
      new THREE.Vector3(1.5, -1.6, 0), // 7: Chertan (Haunch)
      new THREE.Vector3(3.6, -0.3, 0), // 8: Denebola (Tail)
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 2],
      [2, 6],
      [6, 7],
      [7, 0],
      [6, 8],
      [7, 8],
    ],
  },
  // 5. Virgo (Virgo / The Maiden & Spica) - West / Left
  {
    name: "Virgo",
    center: new THREE.Vector3(-17.0, -2.0, -1.0),
    stars: [
      new THREE.Vector3(2.2, -3.2, 0), // 0: Spica (Bright base)
      new THREE.Vector3(1.3, -1.3, 0), // 1: Heze (Lower torso)
      new THREE.Vector3(-0.3, 0.6, 0), // 2: Porrima (Chest hub)
      new THREE.Vector3(-1.8, -0.4, 0), // 3: Auva (Waist)
      new THREE.Vector3(-0.9, 2.9, 0), // 4: Vindemiatrix (Left wing)
      new THREE.Vector3(-3.0, 1.9, 0), // 5: Zavijava (Head)
      new THREE.Vector3(1.1, -2.3, 0), // 6: Syrma (Left leg)
      new THREE.Vector3(-2.4, -2.5, 0), // 7: Rijl al Awwa (Right foot)
    ],
    edges: [
      [0, 6],
      [6, 1],
      [1, 2],
      [1, 3],
      [3, 5],
      [2, 4],
      [2, 5],
      [3, 7],
    ],
  },
  // 6. Gemini (Gemini / The Twins) - South-West / Lower-Left
  {
    name: "Gemini",
    center: new THREE.Vector3(-6.0, -15.5, -1.0),
    stars: [
      new THREE.Vector3(-2.4, 3.2, 0), // 0: Castor (Head 1)
      new THREE.Vector3(0.2, 3.4, 0), // 1: Pollux (Head 2)
      new THREE.Vector3(-2.8, 1.3, 0), // 2: Mebsuta (Torso 1)
      new THREE.Vector3(-0.2, 1.1, 0), // 3: Wasat (Torso 2)
      new THREE.Vector3(-3.2, -1.1, 0), // 4: Tejat Posterior (Knee 1)
      new THREE.Vector3(-3.6, -3.0, 0), // 5: Propus (Foot 1)
      new THREE.Vector3(0.4, -1.3, 0), // 6: Mekbuda (Knee 2)
      new THREE.Vector3(1.3, -3.2, 0), // 7: Alhena (Foot 2)
      new THREE.Vector3(-1.3, 1.2, 0), // 8: Arm clasp bridge
    ],
    edges: [
      [0, 2],
      [2, 4],
      [4, 5],
      [1, 3],
      [3, 6],
      [6, 7],
      [0, 1],
      [2, 8],
      [8, 3],
    ],
  },
];

interface CTAScorpiusNodeData {
  channel: ContactChannel;
  group: THREE.Group;
  mesh: THREE.Mesh;
  auraMesh: THREE.Mesh;
  haloPoints: THREE.Points;
  iconSprite: THREE.Sprite;
  basePos: THREE.Vector3;
  colorNum: number;
  index: number;
}

interface WhiteStarData {
  mesh: THREE.Mesh;
  flareSprite: THREE.Sprite;
  basePos: THREE.Vector3;
  twinklePhase: number;
}

interface ZodiacStarData {
  mesh: THREE.Mesh;
  flareSprite: THREE.Sprite;
  twinklePhase: number;
}

export function ContactNeuralMesh() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeChannel, setActiveChannel] = useState<ContactChannel | null>(
    CONTACT_CHANNELS[0]
  );
  const activeChannelRef = useRef<ContactChannel | null>(activeChannel);
  activeChannelRef.current = activeChannel;

  const ctaNodesRef = useRef<CTAScorpiusNodeData[]>([]);
  const whiteStarsRef = useRef<WhiteStarData[]>([]);
  const constellationGroupRef = useRef<THREE.Group | null>(null);
  const bgConstellationsGroupRef = useRef<THREE.Group | null>(null);
  const nebulaParticlesRef = useRef<THREE.Points | null>(null);
  const mousePlanePos = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const dockRef = useRef<HTMLElement | null>(null);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const targetScaleRef = useRef<number>(1.0);
  const hasRevealedRef = useRef<boolean>(false);

  const handleOpenChannel = useCallback((channel: ContactChannel) => {
    playHapticClick(940);
    if (channel.platform === "Email") {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(PRIMARY_EMAIL).catch(() => {});
      }
      window.location.href = channel.url;
    } else {
      window.open(channel.url, "_blank", "noopener,noreferrer");
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const initialAspect = width / height;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x100d0e, 0.022);

    const camera = new THREE.PerspectiveCamera(50, initialAspect, 0.1, 100);

    const updateCameraAndScale = (w: number, h: number) => {
      const aspect = w / h;
      camera.aspect = aspect;

      if (aspect < 0.6) {
        camera.position.set(0, 0.4, 20);
      } else if (aspect < 0.8) {
        camera.position.set(0, 0.3, 18);
      } else if (aspect < 1.2) {
        camera.position.set(0, 0.2, 16);
      } else {
        camera.position.set(0, 0, 14.5);
      }
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();

      // Responsive auto-fit scaling for the Scorpius and peripheral constellations
      let targetScale = 1.0;
      if (aspect < 0.8) {
        targetScale = Math.min(0.85, Math.max(0.62, aspect * 1.05));
      } else if (aspect < 1.2) {
        targetScale = 0.88;
      } else {
        targetScale = 1.08;
      }
      targetScaleRef.current = targetScale;

      if (constellationGroupRef.current) {
        constellationGroupRef.current.scale.set(
          targetScale,
          targetScale,
          targetScale
        );
      }
      if (bgConstellationsGroupRef.current) {
        bgConstellationsGroupRef.current.scale.set(
          targetScale,
          targetScale,
          targetScale
        );
      }
    };

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // 1. Celestial Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const coreLight = new THREE.PointLight(0xffffff, 2.2, 35);
    coreLight.position.set(0, 2, 8);
    scene.add(coreLight);

    // Textures
    const flareTexture = createDiffractionSpikeTexture();
    const circularStarTexture = createCircularStarTexture();
    const nebulaTexture = createNebulaCloudTexture();

    // 2. Monochromatic Nebula Cloud Dust Clusters
    const nebulaCount = 38;
    const nebulaGeo = new THREE.BufferGeometry();
    const nebulaPositions = new Float32Array(nebulaCount * 3);
    const nebulaColors = new Float32Array(nebulaCount * 3);

    for (let i = 0; i < nebulaCount; i++) {
      const radius = 4.0 + Math.random() * 16.0;
      const angle = Math.random() * Math.PI * 2;
      nebulaPositions[i * 3] = Math.cos(angle) * radius;
      nebulaPositions[i * 3 + 1] = Math.sin(angle) * (radius * 0.75);
      nebulaPositions[i * 3 + 2] = -18.0 + Math.random() * 12.0;

      const brightness = 0.22 + Math.random() * 0.18;
      nebulaColors[i * 3] = brightness * 0.95;
      nebulaColors[i * 3 + 1] = brightness * 0.95;
      nebulaColors[i * 3 + 2] = brightness * 1.05;
    }

    nebulaGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(nebulaPositions, 3)
    );
    nebulaGeo.setAttribute(
      "color",
      new THREE.BufferAttribute(nebulaColors, 3)
    );

    const nebulaMat = new THREE.PointsMaterial({
      size: 14.0,
      map: nebulaTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.075,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const nebulaPoints = new THREE.Points(nebulaGeo, nebulaMat);
    scene.add(nebulaPoints);
    nebulaParticlesRef.current = nebulaPoints;

    // 3. Background Starfield (Muted Light-Grey, exactly matching Scorpius' white star dot size)
    const starfieldCount = 380;
    const starfieldGeo = new THREE.BufferGeometry();
    const starfieldPositions = new Float32Array(starfieldCount * 3);

    for (let i = 0; i < starfieldCount; i++) {
      starfieldPositions[i * 3] = (Math.random() - 0.5) * 44;
      starfieldPositions[i * 3 + 1] = (Math.random() - 0.5) * 44;
      starfieldPositions[i * 3 + 2] = -22.0 + Math.random() * 18.0;
    }

    starfieldGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(starfieldPositions, 3)
    );

    // Muted light-grey color (0xa1a1aa) and size (0.36) perfectly matching Scorpius' white sphere stars!
    const starfieldMat = new THREE.PointsMaterial({
      color: 0xa1a1aa,
      size: 0.36,
      map: circularStarTexture,
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const starfieldPoints = new THREE.Points(starfieldGeo, starfieldMat);
    scene.add(starfieldPoints);

    // 4. Six Peripheral Zodiac Constellations (Same scale as Scorpius, with radiant shine flares)
    const bgConstellationsGroup = new THREE.Group();
    scene.add(bgConstellationsGroup);
    bgConstellationsGroupRef.current = bgConstellationsGroup;

    // Star sphere geometry matching Scorpius' white stars (radius 0.18, diameter 0.36)
    const zodiacStarGeo = new THREE.SphereGeometry(0.18, 14, 14);
    const zodiacStarMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });
    const zodiacStars: ZodiacStarData[] = [];

    ZODIAC_CONSTELLATIONS.forEach((constell) => {
      const cGroup = new THREE.Group();
      cGroup.position.copy(constell.center);
      bgConstellationsGroup.add(cGroup);

      // Star spheres with radiant diffraction spike shine flare
      constell.stars.forEach((starPos) => {
        const starGroup = new THREE.Group();
        starGroup.position.copy(starPos);
        cGroup.add(starGroup);

        const starMesh = new THREE.Mesh(zodiacStarGeo, zodiacStarMat);
        starGroup.add(starMesh);

        // Radiant diffraction spike lens flare for shine effect
        const flareMat = new THREE.SpriteMaterial({
          map: flareTexture,
          color: 0xffffff,
          transparent: true,
          opacity: 0.85,
          blending: THREE.AdditiveBlending,
          depthTest: false,
        });
        const flareSprite = new THREE.Sprite(flareMat);
        flareSprite.scale.set(1.4, 1.4, 1);
        starGroup.add(flareSprite);

        zodiacStars.push({
          mesh: starMesh,
          flareSprite,
          twinklePhase: Math.random() * Math.PI * 2,
        });
      });

      // Constellation line segments
      const linePositions = new Float32Array(constell.edges.length * 2 * 3);
      let lIdx = 0;
      constell.edges.forEach(([iA, iB]) => {
        const pA = constell.stars[iA];
        const pB = constell.stars[iB];
        linePositions[lIdx++] = pA.x;
        linePositions[lIdx++] = pA.y;
        linePositions[lIdx++] = pA.z;

        linePositions[lIdx++] = pB.x;
        linePositions[lIdx++] = pB.y;
        linePositions[lIdx++] = pB.z;
      });

      const linesGeo = new THREE.BufferGeometry();
      linesGeo.setAttribute(
        "position",
        new THREE.BufferAttribute(linePositions, 3)
      );
      const linesMat = new THREE.LineBasicMaterial({
        color: 0x94a3b8,
        transparent: true,
        opacity: 0.38,
      });
      const linesMesh = new THREE.LineSegments(linesGeo, linesMat);
      cGroup.add(linesMesh);
    });

    // 5. Scorpius Master Constellation Pivot Group (Foreground Hero)
    const scorpiusGroup = new THREE.Group();
    scene.add(scorpiusGroup);
    constellationGroupRef.current = scorpiusGroup;

    // 6. Construct 12 Stars of Scorpius
    const ctaNodes: CTAScorpiusNodeData[] = [];
    const whiteStars: WhiteStarData[] = [];
    const interactiveMeshes: THREE.Mesh[] = [];

    SCORPIUS_RAW_COORDS.forEach((item, starIdx) => {
      const basePos = item.pos.clone();

      if (item.isCTA && item.ctaKey) {
        // 🔴 CTA BUTTON NODE (Custom Colored Star)
        const cfg = CTA_CONFIGS[item.ctaKey];
        const channel = CONTACT_CHANNELS.find(
          (c) => c.platform === item.ctaKey
        )!;

        const nodeGroup = new THREE.Group();
        nodeGroup.position.copy(basePos);
        scorpiusGroup.add(nodeGroup);

        const coreGeo = new THREE.IcosahedronGeometry(0.55, 0);
        const coreMat = new THREE.MeshStandardMaterial({
          color: cfg.colorNum,
          emissive: cfg.colorNum,
          emissiveIntensity: 0.75,
          roughness: 0.15,
          metalness: 0.85,
        });
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        coreMesh.userData = { starIdx, ctaKey: item.ctaKey, channel };
        nodeGroup.add(coreMesh);

        // Invisible Touch & Click Hit Sphere (Ergonomic radius 1.25)
        const hitGeo = new THREE.SphereGeometry(1.25, 8, 8);
        const hitMat = new THREE.MeshBasicMaterial({ visible: false });
        const hitMesh = new THREE.Mesh(hitGeo, hitMat);
        hitMesh.userData = { starIdx, ctaKey: item.ctaKey, channel };
        coreMesh.add(hitMesh);
        interactiveMeshes.push(hitMesh);

        // 3D Billboard SVG Brand Icon Sprite
        const iconCanvas = document.createElement("canvas");
        iconCanvas.width = 128;
        iconCanvas.height = 128;
        const iconCtx = iconCanvas.getContext("2d");
        const iconTexture = new THREE.CanvasTexture(iconCanvas);

        if (iconCtx) {
          const img = new Image();
          img.src = `data:image/svg+xml;utf8,${encodeURIComponent(
            SVG_ICONS[channel.platform] || SVG_ICONS.Email
          )}`;
          img.onload = () => {
            iconCtx.clearRect(0, 0, 128, 128);
            iconCtx.drawImage(img, 18, 18, 92, 92);
            iconTexture.needsUpdate = true;
          };
        }

        const iconSpriteMat = new THREE.SpriteMaterial({
          map: iconTexture,
          transparent: true,
          opacity: 0.95,
          depthTest: false,
        });
        const iconSprite = new THREE.Sprite(iconSpriteMat);
        iconSprite.scale.set(1.05, 1.05, 1);
        nodeGroup.add(iconSprite);

        // Wireframe Colored Aura Cage
        const auraGeo = new THREE.IcosahedronGeometry(0.78, 0);
        const auraMat = new THREE.MeshBasicMaterial({
          color: cfg.colorNum,
          wireframe: true,
          transparent: true,
          opacity: 0.45,
        });
        const auraMesh = new THREE.Mesh(auraGeo, auraMat);
        nodeGroup.add(auraMesh);

        // Halo Particle Ring
        const haloGeo = new THREE.BufferGeometry();
        const haloPts: number[] = [];
        for (let p = 0; p < 24; p++) {
          const ang = (p / 24) * Math.PI * 2;
          haloPts.push(Math.cos(ang) * 0.95, Math.sin(ang) * 0.95, 0);
        }
        haloGeo.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(haloPts, 3)
        );
        const haloMat = new THREE.PointsMaterial({
          color: cfg.colorNum,
          size: 0.05,
          transparent: true,
          opacity: 0.8,
        });
        const haloPoints = new THREE.Points(haloGeo, haloMat);
        nodeGroup.add(haloPoints);

        ctaNodes.push({
          channel,
          group: nodeGroup,
          mesh: coreMesh,
          auraMesh,
          haloPoints,
          iconSprite,
          basePos,
          colorNum: cfg.colorNum,
          index: starIdx,
        });
      } else {
        // ⭐ WHITE STELLAR NODE (Constellation Anchor)
        const starGroup = new THREE.Group();
        starGroup.position.copy(basePos);
        scorpiusGroup.add(starGroup);

        // White Star Core (radius 0.18, diameter 0.36)
        const starGeo = new THREE.SphereGeometry(0.18, 14, 14);
        const starMat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
        });
        const starMesh = new THREE.Mesh(starGeo, starMat);
        starGroup.add(starMesh);

        // 4-Point Diffraction Spike Lens Flare Sprite
        const flareMat = new THREE.SpriteMaterial({
          map: flareTexture,
          color: 0xffffff,
          transparent: true,
          opacity: 0.9,
          blending: THREE.AdditiveBlending,
          depthTest: false,
        });
        const flareSprite = new THREE.Sprite(flareMat);
        flareSprite.scale.set(1.5, 1.5, 1);
        starGroup.add(flareSprite);

        whiteStars.push({
          mesh: starMesh,
          flareSprite,
          basePos,
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }
    });

    ctaNodesRef.current = ctaNodes;
    whiteStarsRef.current = whiteStars;

    // 7. Build 11 Scorpius Constellation Lines
    const lineGeo = new THREE.BufferGeometry();
    const linePositions = new Float32Array(SCORPIUS_EDGES.length * 2 * 3);
    lineGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(linePositions, 3)
    );

    const lineMat = new THREE.LineBasicMaterial({
      color: 0xa5b4fc,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const constellationLines = new THREE.LineSegments(lineGeo, lineMat);
    scorpiusGroup.add(constellationLines);

    // Initial scale & camera setup
    updateCameraAndScale(width, height);

    // 8. Raycaster & Pointer Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    const updatePointerCoords = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((clientY - rect.top) / rect.height) * 2 + 1;
      mouse.x = x;
      mouse.y = y;

      raycaster.setFromCamera(mouse, camera);
      const intersectionPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersectionPoint);
      mousePlanePos.current.copy(intersectionPoint);

      camera.position.x += (x * 4.2 - camera.position.x) * 0.05;
      camera.position.y += (y * 3.2 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      if (bgConstellationsGroupRef.current) {
        bgConstellationsGroupRef.current.position.x +=
          (x * 1.5 - bgConstellationsGroupRef.current.position.x) * 0.04;
        bgConstellationsGroupRef.current.position.y +=
          (y * 1.1 - bgConstellationsGroupRef.current.position.y) * 0.04;
      }
      if (nebulaParticlesRef.current) {
        nebulaParticlesRef.current.position.x +=
          (x * 0.6 - nebulaParticlesRef.current.position.x) * 0.02;
        nebulaParticlesRef.current.position.y +=
          (y * 0.4 - nebulaParticlesRef.current.position.y) * 0.02;
      }
    };

    const onPointerMove = (e: MouseEvent) => {
      updatePointerCoords(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePointerCoords(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const triggerRaycastClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes);
      if (intersects.length > 0) {
        const ctaKey = intersects[0].object.userData.ctaKey as string;
        const target = CONTACT_CHANNELS.find((c) => c.platform === ctaKey);
        if (target) {
          setActiveChannel(target);
          handleOpenChannel(target);
        }
      }
    };

    const onClick = () => {
      triggerRaycastClick();
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length > 0) {
        updatePointerCoords(
          e.changedTouches[0].clientX,
          e.changedTouches[0].clientY
        );
        triggerRaycastClick();
      }
    };

    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("click", onClick);
    window.addEventListener("touchend", onTouchEnd);

    // 9. Entrance Animation State & Timeline
    const entranceAnimState = {
      nebulaOpacity: 0,
      starfieldOpacity: 0,
      zodiacScale: 0,
      linesMultiplier: 0,
      whiteStarsScale: [0, 0, 0, 0, 0, 0, 0],
      ctaNodesScale: [0, 0, 0, 0, 0],
    };

    // Initial dormant state for dock & buttons
    if (dockRef.current) {
      gsap.set(dockRef.current, { opacity: 0, y: 40 });
    }
    const initialButtons = buttonsRef.current.filter(Boolean);
    if (initialButtons.length > 0) {
      gsap.set(initialButtons, {
        opacity: 0,
        y: 12,
        scale: 0.85,
      });
    }

    const entranceTl = gsap.timeline({
      paused: true,
      defaults: { ease: "power2.out" },
    });

    // Phase 1: Nebula & Cosmic Starfield Deep Space Fade-In
    entranceTl.to(
      entranceAnimState,
      {
        nebulaOpacity: 1,
        starfieldOpacity: 1,
        duration: 0.9,
        ease: "power2.inOut",
      },
      0
    );

    // Phase 2: Peripheral 6 Zodiac Constellations Bloom Outward
    entranceTl.to(
      entranceAnimState,
      {
        zodiacScale: 1,
        duration: 1.05,
        ease: "power2.out",
      },
      0.15
    );

    // Phase 3: Scorpius Constellation Lines Ignition
    entranceTl.to(
      entranceAnimState,
      {
        linesMultiplier: 1,
        duration: 0.85,
        ease: "power1.inOut",
      },
      0.25
    );

    // Phase 4: Staggered Pop-In of Scorpius' 7 White Anchor Stars
    whiteStars.forEach((_, idx) => {
      entranceTl.to(
        entranceAnimState.whiteStarsScale,
        {
          [idx]: 1,
          duration: 0.5,
          ease: "back.out(2)",
        },
        0.35 + idx * 0.06
      );
    });

    // Phase 5: Staggered Ignition of 5 CTA Gateway Nodes Along Scorpius Spine
    ctaNodes.forEach((_, idx) => {
      entranceTl.to(
        entranceAnimState.ctaNodesScale,
        {
          [idx]: 1,
          duration: 0.65,
          ease: "back.out(2.2)",
        },
        0.6 + idx * 0.12
      );
    });

    // Phase 6: Floating Bottom Dock & Tactile Brand Buttons Reveal
    if (dockRef.current) {
      entranceTl.to(
        dockRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          ease: "power3.out",
          onComplete: () => {
            if (dockRef.current) {
              gsap.set(dockRef.current, { clearProps: "y,opacity" });
            }
          },
        },
        1.0
      );
    }

    entranceTl.add(() => {
      const liveButtons = buttonsRef.current.filter(Boolean);
      if (liveButtons.length > 0) {
        gsap.to(liveButtons, {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.07,
          duration: 0.45,
          ease: "back.out(1.6)",
          onComplete: () => {
            gsap.set(liveButtons, { clearProps: "transform,opacity" });
          },
        });
      }
    }, 1.08);

    const handleReveal = () => {
      if (!hasRevealedRef.current) {
        hasRevealedRef.current = true;
        entranceTl.play();
      }
    };

    window.addEventListener("preloader:reveal", handleReveal);

    // Safety fallback timer: triggers if preloader:reveal was already dispatched or unavailable
    const fallbackTimer = setTimeout(() => {
      if (!hasRevealedRef.current) {
        handleReveal();
      }
    }, 2600);

    // 10. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Functional cursor feedback without hover animations
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes);
      if (container) {
        container.style.cursor = intersects.length > 0 ? "pointer" : "default";
      }

      // Gentle Foreground Scorpius Sway
      scorpiusGroup.rotation.z = Math.sin(elapsedTime * 0.4) * 0.015;

      // Gentle Background Drift & Parallax Scales
      if (bgConstellationsGroupRef.current) {
        const currentZodiacScale =
          targetScaleRef.current * entranceAnimState.zodiacScale;
        bgConstellationsGroupRef.current.scale.set(
          currentZodiacScale,
          currentZodiacScale,
          currentZodiacScale
        );
        bgConstellationsGroupRef.current.rotation.z =
          Math.sin(elapsedTime * 0.2) * 0.008;
      }
      if (nebulaParticlesRef.current) {
        (nebulaParticlesRef.current.material as THREE.PointsMaterial).opacity =
          0.075 * entranceAnimState.nebulaOpacity;
        nebulaParticlesRef.current.rotation.z = elapsedTime * 0.0015;
      }
      starfieldMat.opacity = 0.42 * entranceAnimState.starfieldOpacity;

      // Twinkle White Stars of Scorpius (Modulated by entrance scale)
      whiteStars.forEach((ws, i) => {
        const scale = entranceAnimState.whiteStarsScale[i] ?? 1;
        ws.mesh.scale.set(scale, scale, scale);
        const twinkle =
          0.75 + Math.sin(elapsedTime * 3.5 + ws.twinklePhase) * 0.25;
        ws.flareSprite.scale.set(
          1.5 * twinkle * scale,
          1.5 * twinkle * scale,
          1
        );
        ws.flareSprite.material.opacity = (0.7 + twinkle * 0.3) * scale;
      });

      // Twinkle & Radiant Shine for the 6 Peripheral Zodiac Constellations
      zodiacStars.forEach((zs) => {
        const twinkle =
          0.75 + Math.sin(elapsedTime * 3.2 + zs.twinklePhase) * 0.25;
        zs.flareSprite.scale.set(1.4 * twinkle, 1.4 * twinkle, 1);
        zs.flareSprite.material.opacity =
          (0.65 + twinkle * 0.35) * entranceAnimState.zodiacScale;
      });

      // Animate CTA Nodes (Gentle rotation & floating, entrance-scaled)
      ctaNodes.forEach((node, i) => {
        node.mesh.rotation.x += 0.015;
        node.mesh.rotation.y += 0.02;
        node.auraMesh.rotation.y -= 0.01;
        node.haloPoints.rotation.z += 0.025;

        const floatY = Math.sin(elapsedTime * 2 + node.index) * 0.08;
        node.group.position.set(
          node.basePos.x,
          node.basePos.y + floatY,
          node.basePos.z
        );

        // Scale driven smoothly by entrance animation state
        const scale = entranceAnimState.ctaNodesScale[i] ?? 1;
        node.group.scale.set(scale, scale, scale);
        const spriteMat = node.iconSprite.material as THREE.SpriteMaterial;
        spriteMat.opacity = 0.95 * scale;
      });

      // Update Constellation Lines buffer
      const linePosArray = lineGeo.attributes.position.array as Float32Array;
      let lineIdx = 0;

      SCORPIUS_EDGES.forEach(([iA, iB]) => {
        const itemA = SCORPIUS_RAW_COORDS[iA];
        const itemB = SCORPIUS_RAW_COORDS[iB];

        const floatA = itemA.isCTA
          ? Math.sin(elapsedTime * 2 + iA) * 0.08
          : 0;
        const floatB = itemB.isCTA
          ? Math.sin(elapsedTime * 2 + iB) * 0.08
          : 0;

        linePosArray[lineIdx++] = itemA.pos.x;
        linePosArray[lineIdx++] = itemA.pos.y + floatA;
        linePosArray[lineIdx++] = itemA.pos.z;

        linePosArray[lineIdx++] = itemB.pos.x;
        linePosArray[lineIdx++] = itemB.pos.y + floatB;
        linePosArray[lineIdx++] = itemB.pos.z;
      });

      lineGeo.attributes.position.needsUpdate = true;
      lineMat.opacity =
        (0.4 + Math.sin(elapsedTime * 2.5) * 0.12) *
        entranceAnimState.linesMultiplier;

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      updateCameraAndScale(w, h);
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("preloader:reveal", handleReveal);
      clearTimeout(fallbackTimer);
      entranceTl.kill();
      disposeThreeScene(scene, renderer, animationFrameId);
    };
  }, [handleOpenChannel]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen h-dvh min-h-screen min-h-dvh overflow-hidden select-none bg-[#0e0b0d]"
      style={{
        backgroundImage: `radial-gradient(ellipse at 50% 45%, rgba(38, 30, 34, 0.55) 0%, rgba(20, 16, 18, 0.85) 55%, #0e0b0d 100%)`,
      }}
    >
      {/* Pure Icon-Only Floating Bottom Dock (Zero Text, Staggered Entrance Animation) */}
      <footer
        ref={dockRef}
        className="absolute bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center gap-2 sm:gap-3 bg-background/80 backdrop-blur-md px-3 py-2 border border-border-hairline shadow-2xl"
      >
        {CONTACT_CHANNELS.map((ch, idx) => {
          const cfg = CTA_CONFIGS[ch.platform] || {
            colorHex: "#fcfcfc",
            activeGlowCss: "border-white",
          };
          const isSelected = activeChannel?.platform === ch.platform;
          return (
            <button
              key={ch.platform}
              ref={(el) => {
                buttonsRef.current[idx] = el;
              }}
              type="button"
              onClick={() => {
                setActiveChannel(ch);
                handleOpenChannel(ch);
              }}
              aria-label={ch.platform}
              className={`p-2.5 sm:p-3 shrink-0 cursor-pointer border ${
                isSelected
                  ? `bg-secondary ${cfg.activeGlowCss}`
                  : "bg-secondary/70 border-transparent text-muted-foreground"
              }`}
              style={{
                color: isSelected ? cfg.colorHex : undefined,
              }}
            >
              <BrandIcon platform={ch.platform} className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            </button>
          );
        })}
      </footer>
    </div>
  );
}
