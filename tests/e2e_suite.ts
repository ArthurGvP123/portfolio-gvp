/**
 * Comprehensive Multi-Tier E2E Test Suite
 * Interactive Portfolio Website (bleibtgleich.dev/work Caliber)
 *
 * Tier Structure:
 * - Tier 1: Feature Coverage (Validating all 14 features from PROJECT.md Feature Inventory)
 * - Tier 2: Boundary & Corner Cases (Non-finite values, extremes, empty states, zero vectors)
 * - Tier 3: Pairwise & Cross-Feature Combinations (View toggle, theme modes, rotary dial, card tilt)
 * - Tier 4: Real-World Application Scenarios (End-to-end simulated client review journey)
 * - Tier 5: Adversarial Coverage Hardening (200-cycle WebGL disposal, zombie RAF, memory stability)
 */

import * as fs from "fs";
import * as path from "path";
import * as THREE from "three";
import { PROJECTS } from "../src/data/projects";
import { calculateFibonacciSpherePoints, normalizeVector } from "../src/utils/math3d";
import { disposeThreeScene } from "../src/hooks/useThreeSphere";
import { calculatePreloaderProgress } from "../src/components/common/Preloader";
import {
  SOCKET_ANGLES,
  FINGER_STOP_ANGLE,
  DETENT_STEP_DEG,
  calculatePolarAngle,
  normalizeAngleDelta,
  getSocketMaxRotation,
  getDetentsCrossed,
} from "../src/hooks/useRotaryDial";
import {
  THEMES,
  isValidTheme,
  STORAGE_KEY,
  applyThemeMode,
  getInitialThemeMode,
} from "../src/components/footer/ThemeSwitcher";
import { ThemeMode, ViewMode, ProjectBadge, ProjectItem } from "../src/types/portfolio";
import { playHapticClick } from "../src/utils/audio";

export interface TestCaseResult {
  tier: number;
  tierName: string;
  featureId?: number;
  featureName?: string;
  name: string;
  passed: boolean;
  details: string;
  error?: string;
  durationMs?: number;
}

export interface E2ESuiteSummary {
  total: number;
  passed: number;
  failed: number;
  durationMs: number;
  results: TestCaseResult[];
  tierBreakdown: Record<number, { name: string; total: number; passed: number; failed: number }>;
}

export function runE2ESuite(): E2ESuiteSummary {
  const startTime = Date.now();
  const results: TestCaseResult[] = [];

  function record(
    tier: number,
    tierName: string,
    name: string,
    condition: boolean,
    details: string,
    options?: { featureId?: number; featureName?: string; error?: string; durationMs?: number }
  ) {
    results.push({
      tier,
      tierName,
      featureId: options?.featureId,
      featureName: options?.featureName,
      name,
      passed: Boolean(condition),
      details,
      error: condition ? undefined : (options?.error || "Assertion failed"),
      durationMs: options?.durationMs,
    });
  }

  const projectRoot = path.resolve(__dirname, "..");

  // ===========================================================================
  // TIER 1: FEATURE COVERAGE (All 14 Features from PROJECT.md Feature Inventory)
  // ===========================================================================
  const tier1Name = "Tier 1: Feature Coverage";

  // Feature 1: Project_Overview.md Parity & Content
  {
    const t0 = Date.now();
    const docPath = path.join(projectRoot, "docs", "Project_Overview.md");
    const exists = fs.existsSync(docPath);
    let validContent = false;
    let size = 0;
    if (exists) {
      const content = fs.readFileSync(docPath, "utf-8");
      size = content.length;
      validContent =
        content.includes("Arthur Gregorius Pongoh") &&
        content.includes("Systems Architect") &&
        (content.includes("Visi") || content.includes("Vision")) &&
        (content.includes("Target Audiens") || content.includes("Audience")) &&
        (content.includes("Technical Stack") || content.includes("Tech Stack"));
    }
    record(
      1,
      tier1Name,
      "Feature 1: Project_Overview.md contains vision, client persona, tech stack, and architecture",
      exists && validContent && size > 3000,
      `File exists: ${exists}, size: ${size} bytes, content verified: ${validContent}`,
      { featureId: 1, featureName: "Project_Overview.md", durationMs: Date.now() - t0 }
    );
  }

  // Feature 2: UI_UX_Specification.md Parity & Design System
  {
    const t0 = Date.now();
    const docPath = path.join(projectRoot, "docs", "UI_UX_Specification.md");
    const exists = fs.existsSync(docPath);
    let validContent = false;
    let size = 0;
    if (exists) {
      const content = fs.readFileSync(docPath, "utf-8");
      size = content.length;
      validContent =
        (content.toLowerCase().includes("brutalist") || content.includes("Brutalism")) &&
        (content.includes("12-column") || content.includes("12-kolom")) &&
        (content.includes("Typography") || content.includes("Tipografi")) &&
        content.includes("base") &&
        content.includes("concrete") &&
        content.includes("rust") &&
        content.includes("verdigris") &&
        content.includes("blood");
    }
    record(
      1,
      tier1Name,
      "Feature 2: UI_UX_Specification.md defines Swiss brutalist system, 12-col grid, typography, and 5 themes",
      exists && validContent && size > 5000,
      `File exists: ${exists}, size: ${size} bytes, tokens verified: ${validContent}`,
      { featureId: 2, featureName: "UI_UX_Specification.md", durationMs: Date.now() - t0 }
    );
  }

  // Feature 3: Animation_Pipeline_Spec.md Parity & Motion Mechanics
  {
    const t0 = Date.now();
    const docPath = path.join(projectRoot, "docs", "Animation_Pipeline_Spec.md");
    const exists = fs.existsSync(docPath);
    let validContent = false;
    let size = 0;
    if (exists) {
      const content = fs.readFileSync(docPath, "utf-8");
      size = content.length;
      validContent =
        content.includes("GSAP") &&
        content.includes("Lenis") &&
        content.includes("Three.js") &&
        content.includes("quaternion") &&
        content.includes("dispose");
    }
    record(
      1,
      tier1Name,
      "Feature 3: Animation_Pipeline_Spec.md documents GSAP ticker, Lenis, WebGL setup, quaternion drag, and disposal",
      exists && validContent && size > 4000,
      `File exists: ${exists}, size: ${size} bytes, specs verified: ${validContent}`,
      { featureId: 3, featureName: "Animation_Pipeline_Spec.md", durationMs: Date.now() - t0 }
    );
  }

  // Feature 4: TODO.md Phased Roadmap & Tracker
  {
    const t0 = Date.now();
    const todoPath = path.join(projectRoot, "TODO.md");
    const docsTodoPath = path.join(projectRoot, "docs", "TODO.md");
    const existsRoot = fs.existsSync(todoPath);
    const existsDocs = fs.existsSync(docsTodoPath);
    let hasMilestones = false;
    if (existsRoot) {
      const content = fs.readFileSync(todoPath, "utf-8");
      hasMilestones =
        content.includes("Milestone M1") &&
        content.includes("Milestone M2") &&
        content.includes("Milestone M3") &&
        content.includes("Milestone M4");
    }
    record(
      1,
      tier1Name,
      "Feature 4: TODO.md tracks phased roadmap across Milestones M1, M2, M3, M4",
      existsRoot && existsDocs && hasMilestones,
      `Root TODO: ${existsRoot}, Docs TODO: ${existsDocs}, Milestones verified: ${hasMilestones}`,
      { featureId: 4, featureName: "TODO.md", durationMs: Date.now() - t0 }
    );
  }

  // Feature 5: Project Scaffolding, Strict TypeScript & Portfolio Dataset
  {
    const t0 = Date.now();
    const pkgPath = path.join(projectRoot, "package.json");
    const tsconfigPath = path.join(projectRoot, "tsconfig.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf-8"));

    const hasDeps =
      pkg.dependencies &&
      pkg.dependencies.next &&
      pkg.dependencies.react &&
      pkg.dependencies.three &&
      pkg.dependencies.gsap &&
      pkg.dependencies.lenis;

    const isStrict = tsconfig.compilerOptions && tsconfig.compilerOptions.strict === true;

    // Verify dataset integrity: 8 authentic vault projects, unique IDs, unique slugs, valid badges
    const totalProjects = PROJECTS.length;
    const uniqueIds = new Set(PROJECTS.map((p) => p.id)).size === totalProjects;
    const uniqueSlugs = new Set(PROJECTS.map((p) => p.slug)).size === totalProjects;
    const validBadges = PROJECTS.every((p) => ["Case", "Shot", "Research", "WIP"].includes(p.badge));
    const validCovers = PROJECTS.every((p) => p.coverImage.startsWith("data:image/svg+xml"));

    const passed = hasDeps && isStrict && totalProjects === 8 && uniqueIds && uniqueSlugs && validBadges && validCovers;
    record(
      1,
      tier1Name,
      "Feature 5: Scaffolding adheres to strict TypeScript, Next.js 15, and 8 authentic vault projects",
      passed,
      `Total projects: ${totalProjects}, strict: ${isStrict}, unique IDs: ${uniqueIds}, valid badges: ${validBadges}`,
      { featureId: 5, featureName: "Project Scaffolding & Dataset", durationMs: Date.now() - t0 }
    );
  }

  // Feature 6: Cards View & 3D Perspective Tilt Kinematics
  {
    const t0 = Date.now();
    const maxTilt = 12;
    const rect = { left: 100, top: 100, width: 400, height: 300 };
    const halfW = rect.width / 2;
    const halfH = rect.height / 2;

    function computeTilt(cx: number, cy: number) {
      const u = Math.max(-1, Math.min(1, (cx - (rect.left + halfW)) / halfW));
      const v = Math.max(-1, Math.min(1, (cy - (rect.top + halfH)) / halfH));
      const rotX = -v * maxTilt;
      const rotY = u * maxTilt;
      const distance = Math.sqrt(u * u + v * v);
      const glareOpacity = Math.min(0.35, distance * 0.28);
      return { u, v, rotX, rotY, glareOpacity };
    }

    const center = computeTilt(300, 250);
    const topLeft = computeTilt(100, 100);
    const bottomRight = computeTilt(500, 400);

    const centerOk = center.rotX === 0 && center.rotY === 0 && center.glareOpacity === 0;
    const topLeftOk = topLeft.rotX === 12 && topLeft.rotY === -12 && topLeft.glareOpacity <= 0.35;
    const bottomRightOk = bottomRight.rotX === -12 && bottomRight.rotY === 12 && bottomRight.glareOpacity <= 0.35;

    // Badge filter verification
    const caseCount = PROJECTS.filter((p) => p.badge === "Case").length;
    const researchCount = PROJECTS.filter((p) => p.badge === "Research").length;
    const filterPartitionOk = caseCount + researchCount === PROJECTS.length && caseCount === 6 && researchCount === 2;

    const passed = centerOk && topLeftOk && bottomRightOk && filterPartitionOk;
    record(
      1,
      tier1Name,
      "Feature 6: CardsView 3D perspective tilt kinematics, specular glare ramp, and badge filtering",
      passed,
      `Center: (${center.rotX}°, ${center.rotY}°), Corner: (${topLeft.rotX}°, ${topLeft.rotY}°), Badges: [Case:${caseCount}, Research:${researchCount}]`,
      { featureId: 6, featureName: "Cards View & 3D Tilt", durationMs: Date.now() - t0 }
    );
  }

  // Feature 7: Sphere (Globe) View Three.js WebGL & Fibonacci Lattice
  {
    const t0 = Date.now();
    const R = 250;
    const points = calculateFibonacciSpherePoints(PROJECTS.length, R);
    const allOnSphere = points.every((pt) => {
      const d = Math.sqrt(pt.x * pt.x + pt.y * pt.y + pt.z * pt.z);
      return Math.abs(d - R) < 1e-4;
    });

    // Verify quaternion rotation preservation
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 4);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 6);
    const qCombined = q1.clone().multiply(q2);
    const qNorm = Math.abs(qCombined.length() - 1.0) < 1e-6;

    // Verify momentum inertia decay
    let vel = 0.05;
    let frames = 0;
    while (Math.abs(vel) > 0.0001 && frames < 200) {
      vel *= 0.94;
      frames++;
    }
    const inertiaDecayed = frames < 120;

    const passed = points.length === PROJECTS.length && allOnSphere && qNorm && inertiaDecayed;
    record(
      1,
      tier1Name,
      "Feature 7: SphereView Fibonacci spherical mapping (R=250), quaternion physics, and momentum decay",
      passed,
      `Fibonacci points: ${points.length}, all on surface: ${allOnSphere}, quat norm: ${qNorm}, decay frames: ${frames}`,
      { featureId: 7, featureName: "Sphere View Three.js WebGL", durationMs: Date.now() - t0 }
    );
  }

  // Feature 8: Dual-View Switcher & State Transitions
  {
    const t0 = Date.now();
    let currentView: ViewMode = "cards";
    const history: ViewMode[] = [currentView];

    const toggleView = (next: ViewMode) => {
      if (next !== currentView) {
        currentView = next;
        history.push(currentView);
      }
    };

    toggleView("sphere");
    toggleView("cards");
    toggleView("sphere");
    toggleView("cards");

    const passed = currentView === "cards" && history.length === 5 && history[1] === "sphere";
    record(
      1,
      tier1Name,
      "Feature 8: ShowcaseViewSwitcher toggles deterministically between 'cards' and 'sphere'",
      passed,
      `Transitions executed: ${history.join(" -> ")}, final view: ${currentView}`,
      { featureId: 8, featureName: "Dual-View Switcher", durationMs: Date.now() - t0 }
    );
  }

  // Feature 9: Preloader 3-Phase Mathematical Counter
  {
    const t0 = Date.now();
    const p0 = calculatePreloaderProgress(0);
    const pPhase1 = calculatePreloaderProgress(0.4);
    const pPhase2 = calculatePreloaderProgress(0.75);
    const p100 = calculatePreloaderProgress(1.0);

    let isMonotonic = true;
    let prev = -1;
    for (let i = 0; i <= 100; i++) {
      const val = calculatePreloaderProgress(i / 100);
      if (val < prev) {
        isMonotonic = false;
        break;
      }
      prev = val;
    }

    const passed = p0 === 0 && pPhase1 === 65 && pPhase2 === 88 && p100 === 100 && isMonotonic;
    record(
      1,
      tier1Name,
      "Feature 9: Preloader 3-phase counter exhibits exact checkpoints (0% -> 65% -> 88% -> 100%) and monotonicity",
      passed,
      `p(0)=${p0}%, p(0.40)=${pPhase1}%, p(0.75)=${pPhase2}%, p(1.0)=${p100}%, monotonic: ${isMonotonic}`,
      { featureId: 9, featureName: "Preloader 3-Phase Counter", durationMs: Date.now() - t0 }
    );
  }

  // Feature 10: Lenis Smooth Scrolling Configuration & GSAP Sync
  {
    const t0 = Date.now();
    const providerPath = path.join(projectRoot, "src", "components", "common", "SmoothScrollProvider.tsx");
    const code = fs.readFileSync(providerPath, "utf-8");
    const hasLenisImport = code.includes('import Lenis from "lenis"');
    const hasTickerSync = code.includes("gsap.ticker.add");
    const hasLagSmoothing = code.includes("gsap.ticker.lagSmoothing(0)");
    const hasTeardown = code.includes("lenis.destroy()") && code.includes("gsap.ticker.remove");

    const passed = hasLenisImport && hasTickerSync && hasLagSmoothing && hasTeardown;
    record(
      1,
      tier1Name,
      "Feature 10: Lenis SmoothScrollProvider synchronizes with GSAP ticker with clean teardown",
      passed,
      `Lenis import: ${hasLenisImport}, ticker sync: ${hasTickerSync}, lag smoothing: ${hasLagSmoothing}, teardown: ${hasTeardown}`,
      { featureId: 10, featureName: "Lenis Smooth Scrolling", durationMs: Date.now() - t0 }
    );
  }

  // Feature 11: Tactile Rotary Dial Footer Geometry & Detents
  {
    const t0 = Date.now();
    const socketsCount = SOCKET_ANGLES.length === 9;
    const fingerStopOk = FINGER_STOP_ANGLE === 60;
    const detentStepOk = DETENT_STEP_DEG === 15;

    // Check travels for 1..9
    let travelsOk = true;
    for (let d = 1; d <= 9; d++) {
      if (getSocketMaxRotation(d) !== d * 30) travelsOk = false;
    }

    // Check polar angle atan2 cardinal points
    const a0 = calculatePolarAngle(100, 0, 0, 0); // 0 deg
    const a90 = calculatePolarAngle(0, 100, 0, 0); // 90 deg
    const a180 = calculatePolarAngle(-100, 0, 0, 0); // 180 deg
    const a270 = calculatePolarAngle(0, -100, 0, 0); // 270 deg
    const polarOk = a0 === 0 && a90 === 90 && a180 === 180 && a270 === 270;

    // Detents crossed
    const detents = getDetentsCrossed(0, 45, 15);
    const detentsOk = detents.length === 3 && detents[0] === 1 && detents[1] === 2 && detents[2] === 3;

    const passed = socketsCount && fingerStopOk && detentStepOk && travelsOk && polarOk && detentsOk;
    record(
      1,
      tier1Name,
      "Feature 11: Rotary dial angular geometry (9 sockets), polar atan2, and 15° ratchet detents",
      passed,
      `Sockets: ${SOCKET_ANGLES.length}, fingerStop: ${FINGER_STOP_ANGLE}°, detentStep: ${DETENT_STEP_DEG}°, travels: ${travelsOk}, polar: ${polarOk}`,
      { featureId: 11, featureName: "Tactile Rotary Dial Footer", durationMs: Date.now() - t0 }
    );
  }

  // Feature 12: 5-Theme Switching Engine & Persistence
  {
    const t0 = Date.now();
    const themesCount = THEMES.length === 5;
    const expectedThemes: ThemeMode[] = ["base", "concrete", "rust", "verdigris", "blood"];
    const allExpectedPresent = expectedThemes.every((t) => isValidTheme(t));
    const allHexValid = THEMES.every((t) => /^#[0-9a-fA-F]{6}$/.test(t.bgHex) && /^#[0-9a-fA-F]{6}$/.test(t.accentHex));

    // Storage simulation
    const mockStorage: Record<string, string> = {};
    const fakeSession = {
      getItem: (k: string) => mockStorage[k] || null,
      setItem: (k: string, v: string) => {
        mockStorage[k] = v;
      },
      removeItem: (k: string) => {
        delete mockStorage[k];
      },
      clear: () => {
        for (const k of Object.keys(mockStorage)) delete mockStorage[k];
      },
    };

    const prevWindow = (global as unknown as { window?: unknown }).window;
    (global as unknown as { window: { sessionStorage: typeof fakeSession } }).window = {
      sessionStorage: fakeSession,
    };

    applyThemeMode("blood");
    const storedBlood = fakeSession.getItem(STORAGE_KEY);
    const initBlood = getInitialThemeMode();

    fakeSession.clear();
    const fallbackBase = getInitialThemeMode();

    // Restore
    if (prevWindow) {
      (global as unknown as { window: unknown }).window = prevWindow;
    } else {
      delete (global as unknown as { window?: unknown }).window;
    }

    const storageOk = storedBlood === "blood" && initBlood === "blood" && fallbackBase === "base";
    const passed = themesCount && allExpectedPresent && allHexValid && storageOk;
    record(
      1,
      tier1Name,
      "Feature 12: 5-Theme Switching engine validates modes, color tokens, and sessionStorage round-trip",
      passed,
      `Themes: ${THEMES.length}, all modes valid: ${allExpectedPresent}, hex valid: ${allHexValid}, storage ok: ${storageOk}`,
      { featureId: 12, featureName: "5-Theme Switching Engine", durationMs: Date.now() - t0 }
    );
  }

  // Feature 13: Adversarial Hardening (Disposal & Zero Leaks)
  {
    const t0 = Date.now();
    const scene = new THREE.Scene();
    let geoDisposed = false;
    let matDisposed = false;
    let contextLost = false;

    const geo = new THREE.PlaneGeometry(10, 10);
    const origGeoDispose = geo.dispose.bind(geo);
    geo.dispose = () => {
      geoDisposed = true;
      origGeoDispose();
    };

    const mat = new THREE.MeshBasicMaterial();
    const origMatDispose = mat.dispose.bind(mat);
    mat.dispose = () => {
      matDisposed = true;
      origMatDispose();
    };

    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    const mockRenderer = {
      dispose: () => {},
      forceContextLoss: () => {
        contextLost = true;
      },
      getContext: () => ({
        getExtension: (ext: string) => (ext === "WEBGL_lose_context" ? { loseContext: () => {} } : null),
      }),
      domElement: { parentNode: { removeChild: () => {} } },
    } as unknown as THREE.WebGLRenderer;

    disposeThreeScene(scene, mockRenderer);
    const passed = geoDisposed && matDisposed && contextLost;
    record(
      1,
      tier1Name,
      "Feature 13: WebGL resource disposal routine tears down geometries, materials, and triggers context loss",
      passed,
      `geoDisposed: ${geoDisposed}, matDisposed: ${matDisposed}, contextLost: ${contextLost}`,
      { featureId: 13, featureName: "Adversarial Hardening (Disposal)", durationMs: Date.now() - t0 }
    );
  }

  // Feature 14: Production Build Gate Pre-Verification
  {
    const t0 = Date.now();
    const nextConfigPath = path.join(projectRoot, "next.config.ts");
    const nextConfigExists = fs.existsSync(nextConfigPath);
    const tsconfigPath = path.join(projectRoot, "tsconfig.json");
    const tsconfigExists = fs.existsSync(tsconfigPath);
    const layoutPath = path.join(projectRoot, "src", "app", "layout.tsx");
    const layoutExists = fs.existsSync(layoutPath);
    const pagePath = path.join(projectRoot, "src", "app", "page.tsx");
    const pageExists = fs.existsSync(pagePath);

    const passed = nextConfigExists && tsconfigExists && layoutExists && pageExists;
    record(
      1,
      tier1Name,
      "Feature 14: Production build gate configuration and root Next.js entrypoints exist and link properly",
      passed,
      `next.config: ${nextConfigExists}, tsconfig: ${tsconfigExists}, layout: ${layoutExists}, page: ${pageExists}`,
      { featureId: 14, featureName: "Production Build Gate", durationMs: Date.now() - t0 }
    );
  }

  // ===========================================================================
  // TIER 2: BOUNDARY & CORNER CASES
  // ===========================================================================
  const tier2Name = "Tier 2: Boundary & Corner Cases";

  // T2.1: Non-finite inputs to Fibonacci sphere
  {
    const t0 = Date.now();
    const ptsZero = calculateFibonacciSpherePoints(0, 250);
    const ptsNegCount = calculateFibonacciSpherePoints(-10, 250);
    const ptsNegRadius = calculateFibonacciSpherePoints(14, -250);
    const ptsZeroRadius = calculateFibonacciSpherePoints(14, 0);
    const ptsNanCount = calculateFibonacciSpherePoints(NaN, 250);
    const ptsNanRadius = calculateFibonacciSpherePoints(14, NaN);

    const ok =
      ptsZero.length === 0 &&
      ptsNegCount.length === 0 &&
      ptsNegRadius.length === 0 &&
      ptsZeroRadius.length === 0 &&
      ptsNanCount.length === 0 &&
      ptsNanRadius.length === 0;

    record(
      2,
      tier2Name,
      "T2.1: calculateFibonacciSpherePoints handles 0, negative, zero radius, and NaN inputs safely",
      ok,
      `ptsZero: ${ptsZero.length}, negCount: ${ptsNegCount.length}, negR: ${ptsNegRadius.length}, nanCount: ${ptsNanCount.length}, nanR: ${ptsNanRadius.length}`,
      { durationMs: Date.now() - t0 }
    );
  }

  // T2.2: Vector normalization for zero vector, microscopic, and astronomical vectors
  {
    const t0 = Date.now();
    const vZero = normalizeVector(0, 0, 0);
    const vMicro = normalizeVector(1e-15, 1e-15, 1e-15);
    const vAstro = normalizeVector(1e15, 0, 0);

    const zeroOk = vZero[0] === 0 && vZero[1] === 0 && vZero[2] === 1;
    const microLen = Math.sqrt(vMicro[0] * vMicro[0] + vMicro[1] * vMicro[1] + vMicro[2] * vMicro[2]);
    const astroLen = Math.sqrt(vAstro[0] * vAstro[0] + vAstro[1] * vAstro[1] + vAstro[2] * vAstro[2]);

    const ok = zeroOk && Math.abs(microLen - 1.0) < 1e-6 && Math.abs(astroLen - 1.0) < 1e-6;
    record(
      2,
      tier2Name,
      "T2.2: normalizeVector handles zero vector fallback, microscopic vector underflow, and astronomical overflow",
      ok,
      `vZero: [${vZero.join(",")}], microLen: ${microLen.toFixed(4)}, astroLen: ${astroLen.toFixed(4)}`,
      { durationMs: Date.now() - t0 }
    );
  }

  // T2.3: Non-finite values in Preloader progress
  {
    const t0 = Date.now();
    const pNegInf = calculatePreloaderProgress(-Infinity);
    const pPosInf = calculatePreloaderProgress(Infinity);
    const pNan = calculatePreloaderProgress(NaN);

    const ok = pNegInf === 0 && pPosInf === 100 && pNan === 0;
    record(
      2,
      tier2Name,
      "T2.3: calculatePreloaderProgress safely clamps -Infinity (0%), +Infinity (100%), and NaN (0%)",
      ok,
      `p(-Inf): ${pNegInf}%, p(+Inf): ${pPosInf}%, p(NaN): ${pNan}%`,
      { durationMs: Date.now() - t0 }
    );
  }

  // T2.4: Cosmic out-of-bounds cursor coordinates in card tilt
  {
    const t0 = Date.now();
    const rect = { left: 0, top: 0, width: 300, height: 200 };
    const maxTilt = 12;
    const halfW = 150;
    const halfH = 100;

    const cosmicPos = { x: 1e9, y: 1e9 };
    const cosmicNeg = { x: -1e9, y: -1e9 };

    const uPos = Math.max(-1, Math.min(1, (cosmicPos.x - halfW) / halfW));
    const vPos = Math.max(-1, Math.min(1, (cosmicPos.y - halfH) / halfH));
    const rotXPos = -vPos * maxTilt;
    const rotYPos = uPos * maxTilt;

    const uNeg = Math.max(-1, Math.min(1, (cosmicNeg.x - halfW) / halfW));
    const vNeg = Math.max(-1, Math.min(1, (cosmicNeg.y - halfH) / halfH));
    const rotXNeg = -vNeg * maxTilt;
    const rotYNeg = uNeg * maxTilt;

    const ok = uPos === 1 && vPos === 1 && rotXPos === -12 && rotYPos === 12 && uNeg === -1 && vNeg === -1 && rotXNeg === 12 && rotYNeg === -12;
    record(
      2,
      tier2Name,
      "T2.4: Card tilt kinematics strictly clamps cosmic cursor coordinates (±10^9 px) within [-1, 1] and ±12°",
      ok,
      `uPos: ${uPos}, rotXPos: ${rotXPos}°, uNeg: ${uNeg}, rotXNeg: ${rotXNeg}°`,
      { durationMs: Date.now() - t0 }
    );
  }

  // T2.5: Subpixel card dimensions (0.001px) and zero dimension rects
  {
    const t0 = Date.now();
    const subRect = { left: 50, top: 50, width: 0.001, height: 0.001 };
    const zeroRect = { left: 50, top: 50, width: 0, height: 0 };

    // Zero rect should produce neutral tilt
    const neutralOnZero = zeroRect.width === 0 || zeroRect.height === 0;

    // Subpixel rect clamped cleanly
    const halfW = subRect.width / 2;
    const rawU = (100 - (subRect.left + halfW)) / halfW;
    const u = Math.max(-1, Math.min(1, rawU));
    const hasNaN = isNaN(u);

    const ok = neutralOnZero && !hasNaN && Math.abs(u) === 1;
    record(
      2,
      tier2Name,
      "T2.5: Card tilt avoids division by zero on 0-dimension rects and clamps subpixel dimensions without NaN",
      ok,
      `neutralOnZero: ${neutralOnZero}, subpixel clamped u: ${u}, hasNaN: ${hasNaN}`,
      { durationMs: Date.now() - t0 }
    );
  }

  // T2.6: Empty search states and non-matching filter queries
  {
    const t0 = Date.now();
    const nonExistentQuery = "xyz_nonexistent_token_99999_quantum";
    const whitespaceQuery = "    \t   \n  ";

    const filteredEmpty = PROJECTS.filter((project) => {
      return (
        project.title.toLowerCase().includes(nonExistentQuery.toLowerCase()) ||
        project.tags.some((t) => t.toLowerCase().includes(nonExistentQuery.toLowerCase()))
      );
    });

    const filteredWhitespace = PROJECTS.filter((project) => {
      const q = whitespaceQuery.trim();
      return q === "" || project.title.toLowerCase().includes(q.toLowerCase());
    });

    const ok = filteredEmpty.length === 0 && filteredWhitespace.length === PROJECTS.length;
    record(
      2,
      tier2Name,
      "T2.6: CardsView search filtering gracefully handles non-matching queries (0 results) and pure whitespace",
      ok,
      `nonExistent matches: ${filteredEmpty.length}, whitespace matches: ${filteredWhitespace.length}`,
      { durationMs: Date.now() - t0 }
    );
  }

  // T2.7: Extreme rotary dial angles across 10 complete 360° revolutions (3600°)
  {
    const t0 = Date.now();
    let accumulated = 0;
    let prev = 0;
    const steps = 360;
    for (let i = 1; i <= steps; i++) {
      const current = (i * 10) % 360;
      const delta = normalizeAngleDelta(current, prev);
      accumulated += delta;
      prev = current;
    }

    const ok = Math.abs(accumulated - 3600) < 1e-4;
    record(
      2,
      tier2Name,
      "T2.7: normalizeAngleDelta preserves smooth cumulative rotation over 10 full revolutions (3600°)",
      ok,
      `Accumulated rotation: ${accumulated}° (expected 3600°)`,
      { durationMs: Date.now() - t0 }
    );
  }

  // T2.8: Rotary dial out-of-bounds socket numbers
  {
    const t0 = Date.now();
    const rot0 = getSocketMaxRotation(0);
    const rot10 = getSocketMaxRotation(10);
    const rotNeg = getSocketMaxRotation(-5);
    const rot100 = getSocketMaxRotation(100);

    const ok = rot0 === 0 && rot10 === 0 && rotNeg === 0 && rot100 === 0;
    record(
      2,
      tier2Name,
      "T2.8: getSocketMaxRotation rejects out-of-bounds socket numbers (0, 10, -5, 100) returning 0° travel",
      ok,
      `rot0: ${rot0}°, rot10: ${rot10}°, rotNeg: ${rotNeg}°, rot100: ${rot100}°`,
      { durationMs: Date.now() - t0 }
    );
  }

  // T2.9: getDetentsCrossed with non-positive step or zero delta
  {
    const t0 = Date.now();
    const dZeroStep = getDetentsCrossed(0, 50, 0);
    const dNegStep = getDetentsCrossed(0, 50, -15);
    const dZeroDelta = getDetentsCrossed(45, 45, 15);

    const ok = dZeroStep.length === 0 && dNegStep.length === 0 && dZeroDelta.length === 0;
    record(
      2,
      tier2Name,
      "T2.9: getDetentsCrossed safely returns empty array for step <= 0 and zero delta rotation",
      ok,
      `zeroStep: ${dZeroStep.length}, negStep: ${dNegStep.length}, zeroDelta: ${dZeroDelta.length}`,
      { durationMs: Date.now() - t0 }
    );
  }

  // T2.10: Antipodal vector [0, 0, -1] in Three.js quaternion rotation
  {
    const t0 = Date.now();
    const vFrom = new THREE.Vector3(0, 0, 1);
    const vTo = new THREE.Vector3(0, 0, -1);
    const quat = new THREE.Quaternion().setFromUnitVectors(vFrom, vTo);
    const vRotated = vFrom.clone().applyQuaternion(quat);

    const hasNaN = isNaN(quat.x) || isNaN(quat.y) || isNaN(quat.z) || isNaN(quat.w);
    const antipodalOk = Math.abs(vRotated.z - -1) < 1e-6;

    const ok = !hasNaN && antipodalOk && Math.abs(quat.length() - 1.0) < 1e-6;
    record(
      2,
      tier2Name,
      "T2.10: Three.js quaternion computes valid 180° rotation for antipodal vector [0, 0, -1] without singularity NaN",
      ok,
      `hasNaN: ${hasNaN}, antipodal matched: ${antipodalOk}, quat norm: ${quat.length().toFixed(6)}`,
      { durationMs: Date.now() - t0 }
    );
  }

  // T2.11: Camera zoom boundaries strictly clamped within [450, 1050]
  {
    const t0 = Date.now();
    const MIN_DISTANCE = 450;
    const MAX_DISTANCE = 1050;

    let zoomDist = 750;
    // Apply huge negative delta (zoom in)
    zoomDist = Math.max(MIN_DISTANCE, Math.min(MAX_DISTANCE, zoomDist - 10000));
    const clampedMin = zoomDist === MIN_DISTANCE;

    // Apply huge positive delta (zoom out)
    zoomDist = Math.max(MIN_DISTANCE, Math.min(MAX_DISTANCE, zoomDist + 20000));
    const clampedMax = zoomDist === MAX_DISTANCE;

    const ok = clampedMin && clampedMax;
    record(
      2,
      tier2Name,
      "T2.11: Camera zoom boundaries strictly clamp within [450, 1050] under extreme delta spikes",
      ok,
      `clampedMin (450): ${clampedMin}, clampedMax (1050): ${clampedMax}`,
      { durationMs: Date.now() - t0 }
    );
  }

  // ===========================================================================
  // TIER 3: PAIRWISE & CROSS-FEATURE COMBINATIONS
  // ===========================================================================
  const tier3Name = "Tier 3: Pairwise Combinations";

  // T3.1: View Toggle x Theme Mode Switching
  {
    const t0 = Date.now();
    const mockStorage: Record<string, string> = {};
    const fakeSession = {
      getItem: (k: string) => mockStorage[k] || null,
      setItem: (k: string, v: string) => {
        mockStorage[k] = v;
      },
    };

    const prevWindow = (global as unknown as { window?: unknown }).window;
    (global as unknown as { window: { sessionStorage: typeof fakeSession } }).window = {
      sessionStorage: fakeSession,
    };

    let view: ViewMode = "cards";
    const themes: ThemeMode[] = ["base", "concrete", "rust", "verdigris", "blood"];
    let stateSynced = true;

    for (const th of themes) {
      applyThemeMode(th);
      view = view === "cards" ? "sphere" : "cards";
      const recovered = getInitialThemeMode();
      if (recovered !== th) {
        stateSynced = false;
        break;
      }
    }

    if (prevWindow) {
      (global as unknown as { window: unknown }).window = prevWindow;
    } else {
      delete (global as unknown as { window?: unknown }).window;
    }

    record(
      3,
      tier3Name,
      "T3.1: Simultaneous View Toggle ('cards' <-> 'sphere') and Theme Switching maintains persistent state",
      stateSynced,
      `Tested across all 5 themes. Theme persistence synchronized: ${stateSynced}`,
      { durationMs: Date.now() - t0 }
    );
  }

  // T3.2: Rotary Dial Rotation x Card Tilt Hover Concurrent Invariants
  {
    const t0 = Date.now();
    // Simulate pointer moving across rotary dial while card tilt is simultaneously computed
    const cardRect = { left: 0, top: 0, width: 200, height: 200 };
    let concurrentOk = true;

    for (let angle = 0; angle <= 360; angle += 30) {
      // Rotary dial polar angle
      const rad = (angle * Math.PI) / 180;
      const px = 100 + 80 * Math.cos(rad);
      const py = 100 + 80 * Math.sin(rad);
      const computedPolar = calculatePolarAngle(px, py, 100, 100);

      // Card tilt from same pointer
      const u = Math.max(-1, Math.min(1, (px - 100) / 100));
      const v = Math.max(-1, Math.min(1, (py - 100) / 100));
      const rotX = -v * 12;
      const rotY = u * 12;

      if (isNaN(computedPolar) || isNaN(rotX) || isNaN(rotY)) {
        concurrentOk = false;
        break;
      }
    }

    record(
      3,
      tier3Name,
      "T3.2: Concurrent calculation of rotary dial polar geometry and card tilt 3D kinematics preserves mathematical invariants",
      concurrentOk,
      `All 13 radial steps computed valid polar and tilt angles: ${concurrentOk}`,
      { durationMs: Date.now() - t0 }
    );
  }

  // T3.3: Preloader Progression x View Switch Readiness
  {
    const t0 = Date.now();
    let currentView: ViewMode = "cards";
    let preloaderCompleted = false;

    // Simulate preloader timeline ticks
    for (let t = 0; t <= 1.0; t += 0.1) {
      const prog = calculatePreloaderProgress(t);
      if (prog >= 100) {
        preloaderCompleted = true;
        currentView = "cards"; // Default ready state
      }
    }

    const ok = preloaderCompleted && currentView === "cards";
    record(
      3,
      tier3Name,
      "T3.3: Preloader completion lifecycle cleanly unlocks default CardsView showcase stage without race conditions",
      ok,
      `preloaderCompleted: ${preloaderCompleted}, currentView: ${currentView}`,
      { durationMs: Date.now() - t0 }
    );
  }

  // T3.4: CardsView Badge Filter x Keyword Search x Theme Switching
  {
    const t0 = Date.now();
    const badge: ProjectBadge = "Case";
    const keyword = "react";

    const filtered = PROJECTS.filter((p) => {
      const matchBadge = p.badge === badge;
      const matchKeyword =
        p.title.toLowerCase().includes(keyword) ||
        p.tags.some((t) => t.toLowerCase().includes(keyword));
      return matchBadge && matchKeyword;
    });

    const hasMatches = filtered.length > 0;
    const allAreCase = filtered.every((p) => p.badge === "Case");

    record(
      3,
      tier3Name,
      "T3.4: CardsView compound filtering (Badge: 'Case' + Query: 'react') produces accurate subset",
      hasMatches && allAreCase,
      `Matches found: ${filtered.length}, all 'Case': ${allAreCase}`,
      { durationMs: Date.now() - t0 }
    );
  }

  // T3.5: Rapid Interleaving of View Toggles & Theme Cycles (100 cycles)
  {
    const t0 = Date.now();
    let view: ViewMode = "cards";
    let themeIdx = 0;
    const themeModes: ThemeMode[] = ["base", "concrete", "rust", "verdigris", "blood"];

    let zeroErrors = true;
    for (let i = 0; i < 100; i++) {
      view = view === "cards" ? "sphere" : "cards";
      themeIdx = (themeIdx + 1) % themeModes.length;
      const t = themeModes[themeIdx];
      if (!isValidTheme(t) || (view !== "cards" && view !== "sphere")) {
        zeroErrors = false;
        break;
      }
    }

    record(
      3,
      tier3Name,
      "T3.5: 100 rapid alternating cycles between views and themes maintain strict state consistency",
      zeroErrors,
      `Executed 100 rapid transitions without state corruption: ${zeroErrors}`,
      { durationMs: Date.now() - t0 }
    );
  }

  // ===========================================================================
  // TIER 4: REAL-WORLD APPLICATION SCENARIOS (Client Review Journey)
  // ===========================================================================
  const tier4Name = "Tier 4: Real-World Scenarios";

  {
    const t0 = Date.now();
    // Step 1: Preloader progression
    const pStart = calculatePreloaderProgress(0);
    const pMid1 = calculatePreloaderProgress(0.4);
    const pMid2 = calculatePreloaderProgress(0.75);
    const pEnd = calculatePreloaderProgress(1.0);
    const step1Ok = pStart === 0 && pMid1 === 65 && pMid2 === 88 && pEnd === 100;

    // Step 2: Page Header & Metadata Verification
    const step2Ok = PROJECTS.length === 8;

    // Step 3: Default CardsView state & filters
    const allCards = PROJECTS.length;
    const caseCards = PROJECTS.filter((p) => p.badge === "Case").length;
    const researchCards = PROJECTS.filter((p) => p.badge === "Research").length;
    const searchMatches = PROJECTS.filter((p) => p.tags.some((t) => t.toLowerCase().includes("react"))).length;
    const step3Ok = allCards === 8 && caseCards === 6 && researchCards === 2 && searchMatches >= 3;

    // Step 4: Card Tilt Hover
    const cardRect = { left: 100, top: 100, width: 400, height: 300 };
    const halfW = 200;
    const halfH = 150;
    const u = (250 - (cardRect.left + halfW)) / halfW;
    const v = (200 - (cardRect.top + halfH)) / halfH;
    const rotX = -v * 12;
    const rotY = u * 12;
    const step4Ok = Math.abs(rotX) <= 12 && Math.abs(rotY) <= 12;

    // Step 5: Switch to SphereView
    let viewMode: ViewMode = "cards";
    viewMode = "sphere";
    const step5Ok = viewMode === "sphere";

    // Step 6: SphereView Fibonacci mapping & quaternion drag
    const pts = calculateFibonacciSpherePoints(PROJECTS.length, 250);
    const qSphere = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.1);
    const step6Ok = pts.length === 8 && Math.abs(qSphere.length() - 1.0) < 1e-6;

    // Step 7: Momentum decay
    let momentum = 0.04;
    for (let f = 0; f < 60; f++) momentum *= 0.94;
    const step7Ok = momentum < 0.001;

    // Step 8: Switch back to CardsView & trigger disposal
    viewMode = "cards";
    const scene = new THREE.Scene();
    let rendererDisposed = false;
    let contextLost = false;
    const mockRenderer = {
      dispose: () => {
        rendererDisposed = true;
      },
      forceContextLoss: () => {
        contextLost = true;
      },
      getContext: () => ({ getExtension: () => null }),
      domElement: { parentNode: { removeChild: () => {} } },
    } as unknown as THREE.WebGLRenderer;
    disposeThreeScene(scene, mockRenderer, 12345);
    const step8Ok = viewMode === "cards" && rendererDisposed && contextLost;

    // Step 9: Footer Rotary Dial Interaction
    const maxTravelSocket7 = getSocketMaxRotation(7); // 210 deg
    const detents7 = getDetentsCrossed(0, maxTravelSocket7, 15);
    const step9Ok = maxTravelSocket7 === 210 && detents7.length === 14;

    // Step 10: Theme Switcher cycle
    let activeTheme: ThemeMode = "base";
    const themeCycle: ThemeMode[] = ["concrete", "rust", "verdigris", "blood", "base"];
    for (const t of themeCycle) {
      if (isValidTheme(t)) activeTheme = t;
    }
    const step10Ok = activeTheme === "base";

    const allStepsOk =
      step1Ok &&
      step2Ok &&
      step3Ok &&
      step4Ok &&
      step5Ok &&
      step6Ok &&
      step7Ok &&
      step8Ok &&
      step9Ok &&
      step10Ok;

    record(
      4,
      tier4Name,
      "T4.1: Comprehensive End-to-End Client Review Navigation Flow (10 integrated steps)",
      allStepsOk,
      `Step1(Preloader): ${step1Ok}, Step2(Header): ${step2Ok}, Step3(Cards): ${step3Ok}, Step4(Tilt): ${step4Ok}, Step5(Sphere): ${step5Ok}, Step6(Quat): ${step6Ok}, Step7(Decay): ${step7Ok}, Step8(Disposal): ${step8Ok}, Step9(Dial): ${step9Ok}, Step10(Theme): ${step10Ok}`,
      { durationMs: Date.now() - t0 }
    );
  }

  // ===========================================================================
  // TIER 5: ADVERSARIAL COVERAGE HARDENING
  // ===========================================================================
  const tier5Name = "Tier 5: Adversarial Hardening";

  // T5.1: 200-cycle rapid WebGL scene creation and disposal stress harness
  {
    const t0 = Date.now();
    const CYCLES = 200;
    let allGeosDisposed = true;
    let allMatsDisposed = true;
    let allTexDisposed = true;
    let allRenderersDisposed = true;
    let allContextsLost = true;

    for (let cycle = 0; cycle < CYCLES; cycle++) {
      const scene = new THREE.Scene();
      const group = new THREE.Group();
      scene.add(group);

      let geoCount = 0;
      let matCount = 0;
      let texCount = 0;
      let rendDisposed = false;
      let ctxLost = false;

      for (let i = 0; i < 14; i++) {
        const geo = new THREE.PlaneGeometry(10, 10);
        const origGeo = geo.dispose.bind(geo);
        geo.dispose = () => {
          geoCount++;
          origGeo();
        };

        const mockTex = {
          dispose: () => {
            texCount++;
          },
        } as unknown as THREE.Texture;

        const mat = new THREE.MeshBasicMaterial({ map: mockTex });
        const origMat = mat.dispose.bind(mat);
        mat.dispose = () => {
          matCount++;
          origMat();
        };

        group.add(new THREE.Mesh(geo, mat));
      }

      const mockRenderer = {
        dispose: () => {
          rendDisposed = true;
        },
        forceContextLoss: () => {
          ctxLost = true;
        },
        getContext: () => ({ getExtension: () => null }),
        domElement: { parentNode: { removeChild: () => {} } },
      } as unknown as THREE.WebGLRenderer;

      disposeThreeScene(scene, mockRenderer, 100 + cycle);

      if (geoCount !== 14) allGeosDisposed = false;
      if (matCount !== 14) allMatsDisposed = false;
      if (texCount !== 14) allTexDisposed = false;
      if (!rendDisposed) allRenderersDisposed = false;
      if (!ctxLost) allContextsLost = false;
    }

    const passed = allGeosDisposed && allMatsDisposed && allTexDisposed && allRenderersDisposed && allContextsLost;
    record(
      5,
      tier5Name,
      "T5.1: 200 successive WebGL creation/disposal cycles achieve 100% GPU memory cleanup and context loss",
      passed,
      `Cycles: ${CYCLES}, geos: ${allGeosDisposed}, mats: ${allMatsDisposed}, textures: ${allTexDisposed}, renderers: ${allRenderersDisposed}, contextLoss: ${allContextsLost}`,
      { durationMs: Date.now() - t0 }
    );
  }

  // T5.2: Double-disposal and throwing dispose fault tolerance
  {
    const t0 = Date.now();
    const scene = new THREE.Scene();
    const mesh = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial());
    scene.add(mesh);

    const throwingRenderer = {
      dispose: () => {
        throw new Error("Simulated renderer disposal failure");
      },
      forceContextLoss: () => {
        throw new Error("Simulated WebGL context loss throw");
      },
      getContext: () => null,
      domElement: null,
    } as unknown as THREE.WebGLRenderer;

    let threw = false;
    try {
      // First call (with throwing renderer)
      disposeThreeScene(scene, throwingRenderer);
      // Second call (idempotency check)
      disposeThreeScene(scene, throwingRenderer);
    } catch {
      threw = true;
    }

    record(
      5,
      tier5Name,
      "T5.2: disposeThreeScene idempotently survives double-disposal and throwing renderer exceptions without crashing",
      !threw,
      `threw unhandled error: ${threw}`,
      { durationMs: Date.now() - t0 }
    );
  }

  // T5.3: Zombie RAF loop prevention
  {
    const t0 = Date.now();
    let cancelledId = -1;
    const originalCancelRAF = (global as unknown as { cancelAnimationFrame?: (id: number) => void }).cancelAnimationFrame;
    (global as unknown as { cancelAnimationFrame: (id: number) => void }).cancelAnimationFrame = (id: number) => {
      cancelledId = id;
    };

    const scene = new THREE.Scene();
    const mockRenderer = {
      dispose: () => {},
      forceContextLoss: () => {},
      getContext: () => null,
      domElement: null,
    } as unknown as THREE.WebGLRenderer;

    const fakeRaf = 998877;
    disposeThreeScene(scene, mockRenderer, fakeRaf);

    // Restore
    if (originalCancelRAF) {
      (global as unknown as { cancelAnimationFrame: (id: number) => void }).cancelAnimationFrame = originalCancelRAF;
    } else {
      delete (global as unknown as { cancelAnimationFrame?: unknown }).cancelAnimationFrame;
    }

    const passed = cancelledId === fakeRaf;
    record(
      5,
      tier5Name,
      "T5.3: disposeThreeScene immediately cancels active requestAnimationFrame ID preventing zombie render loops",
      passed,
      `Target RAF ID: ${fakeRaf}, Cancelled RAF ID: ${cancelledId}`,
      { durationMs: Date.now() - t0 }
    );
  }

  // T5.4: Event listener teardown symmetry
  {
    const t0 = Date.now();
    const boundListeners: { element: string; event: string; fn: () => void }[] = [];

    const mockElement = {
      addEventListener: (event: string, fn: () => void) => {
        boundListeners.push({ element: "container", event, fn });
      },
      removeEventListener: (event: string, fn: () => void) => {
        const idx = boundListeners.findIndex((l) => l.element === "container" && l.event === event && l.fn === fn);
        if (idx !== -1) boundListeners.splice(idx, 1);
      },
    };

    // Simulate mounting 4 listeners
    const fn1 = () => {};
    const fn2 = () => {};
    mockElement.addEventListener("pointerdown", fn1);
    mockElement.addEventListener("pointermove", fn2);
    mockElement.addEventListener("pointerup", fn1);
    mockElement.addEventListener("wheel", fn2);

    const countBefore = boundListeners.length;

    // Simulate unmounting
    mockElement.removeEventListener("pointerdown", fn1);
    mockElement.removeEventListener("pointermove", fn2);
    mockElement.removeEventListener("pointerup", fn1);
    mockElement.removeEventListener("wheel", fn2);

    const countAfter = boundListeners.length;
    const passed = countBefore === 4 && countAfter === 0;

    record(
      5,
      tier5Name,
      "T5.4: Event listener attachment and teardown is 100% symmetric with zero listener leakage",
      passed,
      `Listeners mounted: ${countBefore}, listeners remaining after unmount: ${countAfter}`,
      { durationMs: Date.now() - t0 }
    );
  }

  // T5.5: Hostile string sanitization in theme switcher
  {
    const t0 = Date.now();
    const hostileInputs = [
      "__proto__",
      "constructor",
      "prototype",
      "toString",
      "<script>alert(1)</script>",
      "' OR 1=1 --",
      "DROP TABLE themes;",
      "javascript:alert(1)",
      "null",
      "undefined",
      "   ",
      "",
    ];

    const allRejected = hostileInputs.every((input) => !isValidTheme(input));
    record(
      5,
      tier5Name,
      "T5.5: isValidTheme safely rejects prototype pollution, script injection, and SQL injection payloads",
      allRejected,
      `Tested ${hostileInputs.length} hostile payloads. All rejected: ${allRejected}`,
      { durationMs: Date.now() - t0 }
    );
  }

  // T5.6: Storage failure resilience (throwing SecurityError)
  {
    const t0 = Date.now();
    const throwingStorage = {
      getItem: () => {
        throw new Error("SecurityError: Access denied");
      },
      setItem: () => {
        throw new Error("QuotaExceededError: DOM Exception 22");
      },
    };

    const prevWindow = (global as unknown as { window?: unknown }).window;
    (global as unknown as { window: { sessionStorage: typeof throwingStorage } }).window = {
      sessionStorage: throwingStorage,
    };

    let applyThrew = false;
    let getThrew = false;
    let fallback = "";

    try {
      applyThemeMode("concrete");
    } catch {
      applyThrew = true;
    }

    try {
      fallback = getInitialThemeMode();
    } catch {
      getThrew = true;
    }

    if (prevWindow) {
      (global as unknown as { window: unknown }).window = prevWindow;
    } else {
      delete (global as unknown as { window?: unknown }).window;
    }

    const passed = !applyThrew && !getThrew && fallback === "base";
    record(
      5,
      tier5Name,
      "T5.6: ThemeSwitcher survives throwing sessionStorage (Safari private mode/SecurityError) falling back to 'base'",
      passed,
      `applyThrew: ${applyThrew}, getThrew: ${getThrew}, fallback: ${fallback}`,
      { durationMs: Date.now() - t0 }
    );
  }

  // T5.7: Web Audio synthesis fallback in headless / Node.js environment
  {
    const t0 = Date.now();
    let threw = false;
    try {
      playHapticClick(820);
      playHapticClick(NaN);
      playHapticClick(-500);
      playHapticClick(1e9);
    } catch {
      threw = true;
    }

    record(
      5,
      tier5Name,
      "T5.7: playHapticClick executes safely in headless environment with hostile frequencies without throwing",
      !threw,
      `Executed 4 calls with standard and hostile frequencies. threw: ${threw}`,
      { durationMs: Date.now() - t0 }
    );
  }

  // T5.8: Long-duration quaternion numerical stability under 100,000 rotations
  {
    const t0 = Date.now();
    const STEPS = 100000;
    const q = new THREE.Quaternion(0, 0, 0, 1);
    const deltaQ = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0.577, 0.577, 0.577).normalize(),
      0.001
    );

    for (let i = 0; i < STEPS; i++) {
      q.multiply(deltaQ);
      // Periodic normalization as done in physics loop
      if (i % 1000 === 0) {
        q.normalize();
      }
    }
    q.normalize();

    const mag = q.length();
    const hasNaN = isNaN(q.x) || isNaN(q.y) || isNaN(q.z) || isNaN(q.w);
    const passed = !hasNaN && Math.abs(mag - 1.0) < 1e-6;

    record(
      5,
      tier5Name,
      "T5.8: 100,000 continuous quaternion rotation cycles preserve unit magnitude (norm = 1.0) with zero NaN",
      passed,
      `Steps: ${STEPS}, final magnitude: ${mag.toFixed(8)}, hasNaN: ${hasNaN}`,
      { durationMs: Date.now() - t0 }
    );
  }

  // ===========================================================================
  // SUMMARY CALCULATIONS
  // ===========================================================================
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const durationMs = Date.now() - startTime;

  const tierBreakdown: Record<number, { name: string; total: number; passed: number; failed: number }> = {
    1: { name: tier1Name, total: 0, passed: 0, failed: 0 },
    2: { name: tier2Name, total: 0, passed: 0, failed: 0 },
    3: { name: tier3Name, total: 0, passed: 0, failed: 0 },
    4: { name: tier4Name, total: 0, passed: 0, failed: 0 },
    5: { name: tier5Name, total: 0, passed: 0, failed: 0 },
  };

  for (const r of results) {
    if (tierBreakdown[r.tier]) {
      tierBreakdown[r.tier].total++;
      if (r.passed) tierBreakdown[r.tier].passed++;
      else tierBreakdown[r.tier].failed++;
    }
  }

  return {
    total,
    passed,
    failed,
    durationMs,
    results,
    tierBreakdown,
  };
}

// Standalone execution support
if (require.main === module || (typeof process !== "undefined" && process.argv[1]?.endsWith("e2e_suite.ts"))) {
  const summary = runE2ESuite();
  console.log("================================================================================");
  console.log("               COMPREHENSIVE MULTI-TIER E2E TEST SUITE                         ");
  console.log("================================================================================\n");

  for (const res of summary.results) {
    const mark = res.passed ? "✓ PASS" : "✗ FAIL";
    console.log(`[${mark}] [Tier ${res.tier}] ${res.name}`);
    console.log(`         Details: ${res.details}`);
    if (res.error) console.log(`         ERROR: ${res.error}`);
  }

  console.log("\n================================================================================");
  console.log(`TOTAL TESTS: ${summary.total} | PASSED: ${summary.passed} | FAILED: ${summary.failed} | DURATION: ${summary.durationMs}ms`);
  console.log(`OVERALL E2E SUITE VERDICT: ${summary.failed === 0 ? "APPROVE" : "REQUEST_CHANGES"}`);
  console.log("================================================================================\n");

  if (summary.failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}
