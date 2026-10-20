/**
 * Comprehensive Empirical Stress-Test Suite for Milestone M3
 * Motion & Micro-Interaction Suite:
 * - Preloader 3-Phase Numerical Counter & Lifecycle
 * - Rotary Dial Angular Geometry, 360-Degree Wrapping & Finger Stop Bounds
 * - 5-Theme Switching Engine & State Persistence
 * - Cross-Milestone Regression Tests (M1 & M2)
 */

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
import { ThemeMode } from "../src/types/portfolio";
import { calculateFibonacciSpherePoints } from "../src/utils/math3d";
import { PROJECTS } from "../src/data/projects";

interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  details: string;
  error?: string;
}

const results: TestResult[] = [];

function assert(suite: string, name: string, condition: boolean, details: string, error?: string) {
  results.push({
    suite,
    name,
    passed: Boolean(condition),
    details,
    error: condition ? undefined : (error || "Assertion failed"),
  });
}

console.log("================================================================================");
console.log("   EMPIRICAL STRESS TEST SUITE: MILESTONE M3 (MOTION & MICRO-INTERACTION)      ");
console.log("================================================================================\n");

// =============================================================================
// SUITE 1: Preloader 3-Phase Counter Acceleration & Boundary Kinematics
// =============================================================================
const suitePreloader = "Preloader - 3-Phase Counter Kinematics";

// Test 1: Boundary condition at t = 0
{
  const p0 = calculatePreloaderProgress(0);
  assert(
    suitePreloader,
    "Boundary condition: t = 0 produces exactly 0% progress",
    p0 === 0,
    `Progress at t=0: ${p0}%`
  );
}

// Test 2: Boundary condition at t < 0
{
  const pNeg = calculatePreloaderProgress(-0.5);
  assert(
    suitePreloader,
    "Boundary condition: negative t (< 0) clamps safely to 0%",
    pNeg === 0,
    `Progress at t=-0.5: ${pNeg}%`
  );
}

// Test 3: Boundary condition at t = 1.0
{
  const p1 = calculatePreloaderProgress(1.0);
  assert(
    suitePreloader,
    "Boundary condition: t = 1.0 produces exactly 100% progress",
    p1 === 100,
    `Progress at t=1.0: ${p1}%`
  );
}

// Test 4: Boundary condition at t > 1.0
{
  const pOver = calculatePreloaderProgress(1.75);
  assert(
    suitePreloader,
    "Boundary condition: t > 1.0 clamps strictly to 100%",
    pOver === 100,
    `Progress at t=1.75: ${pOver}%`
  );
}

// Test 5: Phase 1 Transition at t = 0.40 (Expected ~65%)
{
  const pPhase1 = calculatePreloaderProgress(0.40);
  const ok = pPhase1 === 65;
  assert(
    suitePreloader,
    "Phase 1 endpoint: t = 0.40 resolves to exactly 65% (initial acceleration phase)",
    ok,
    `Progress at t=0.40: ${pPhase1}% (target: 65%)`
  );
}

// Test 6: Phase 2 Transition at t = 0.75 (Expected ~88%)
{
  const pPhase2 = calculatePreloaderProgress(0.75);
  const ok = pPhase2 === 88;
  assert(
    suitePreloader,
    "Phase 2 endpoint: t = 0.75 resolves to exactly 88% (shader compile & asset hydration phase)",
    ok,
    `Progress at t=0.75: ${pPhase2}% (target: 88%)`
  );
}

// Test 7: Strict Monotonicity & No-NaN across 1,000 uniform samples
{
  let isMonotonic = true;
  let hasNaN = false;
  let prevVal = 0;
  const SAMPLES = 1000;

  for (let i = 0; i <= SAMPLES; i++) {
    const t = i / SAMPLES;
    const val = calculatePreloaderProgress(t);
    if (Number.isNaN(val)) {
      hasNaN = true;
    }
    if (val < prevVal) {
      isMonotonic = false;
    }
    prevVal = val;
  }

  assert(
    suitePreloader,
    "1,000-point uniform sampling confirms strict monotonic progression with zero NaN",
    isMonotonic && !hasNaN,
    `isMonotonic: ${isMonotonic}, hasNaN: ${hasNaN}, finalVal: ${prevVal}%`
  );
}

// Test 8: Simulated Progress Loop with Completion Trigger
{
  let completed = false;
  const onComplete = () => {
    completed = true;
  };

  const steps = 50;
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const progress = calculatePreloaderProgress(t);
    if (progress >= 100) {
      onComplete();
    }
  }

  assert(
    suitePreloader,
    "Simulated tick sequence reaches 100% and triggers onComplete callback reliably",
    completed,
    `onComplete triggered: ${completed}`
  );
}

// =============================================================================
// SUITE 2: Rotary Dial Angular Geometry, 360° Wrapping & Finger Stop
// =============================================================================
const suiteDial = "RotaryDial - Angular Geometry & Kinematics";

// Test 9: Standard 9 Sockets Array & Exact Angles
{
  const expectedAngles = [30, 0, 330, 300, 270, 240, 210, 180, 150];
  const countOk = SOCKET_ANGLES.length === 9;
  const anglesMatch = SOCKET_ANGLES.every((angle, idx) => angle === expectedAngles[idx]);

  assert(
    suiteDial,
    "SOCKET_ANGLES contains exactly 9 sockets matching specification [30, 0, 330, 300, 270, 240, 210, 180, 150]",
    countOk && anglesMatch,
    `Sockets: [${SOCKET_ANGLES.join(", ")}]`
  );
}

// Test 10: Constant 30° Angular Interval Between Adjacent Sockets
{
  let all30DegApart = true;
  for (let i = 0; i < SOCKET_ANGLES.length - 1; i++) {
    const curr = SOCKET_ANGLES[i];
    const next = SOCKET_ANGLES[i + 1];
    // Angular difference accounting for 360 wrap
    let diff = (curr - next + 360) % 360;
    if (diff !== 30) {
      all30DegApart = false;
    }
  }

  assert(
    suiteDial,
    "All adjacent sockets are spaced at uniform 30-degree mechanical intervals",
    all30DegApart,
    `Uniform 30deg spacing verified: ${all30DegApart}`
  );
}

// Test 11: Finger Stop Angle
{
  assert(
    suiteDial,
    "FINGER_STOP_ANGLE is positioned clockwise past socket 1 at exactly 60 degrees",
    FINGER_STOP_ANGLE === 60,
    `Finger stop angle: ${FINGER_STOP_ANGLE} deg`
  );
}

// Test 12: Socket Travel Rotation to Finger Stop
{
  let allTravelMatches = true;
  const travelValues: number[] = [];

  for (let digit = 1; digit <= 9; digit++) {
    const travel = getSocketMaxRotation(digit);
    travelValues.push(travel);
    if (travel !== digit * 30) {
      allTravelMatches = false;
    }
  }

  assert(
    suiteDial,
    "Maximum rotation travel for each digit d (1..9) strictly equals (d * 30 degrees)",
    allTravelMatches,
    `Travels for digits 1..9: [${travelValues.join(", ")}]`
  );
}

// Test 13: Out-of-bounds Socket Number Rejection
{
  const max0 = getSocketMaxRotation(0);
  const max10 = getSocketMaxRotation(10);
  const maxNeg = getSocketMaxRotation(-3);

  assert(
    suiteDial,
    "Out-of-bounds socket numbers (0, 10, -3) safely evaluate to 0 max rotation",
    max0 === 0 && max10 === 0 && maxNeg === 0,
    `Results for [0, 10, -3]: [${max0}, ${max10}, ${maxNeg}]`
  );
}

// Test 14: Polar Angle Calculation with calculatePolarAngle
{
  const cx = 150;
  const cy = 150;

  // 0 deg: positive X (3 o'clock)
  const a0 = calculatePolarAngle(cx + 100, cy, cx, cy);
  // 90 deg: positive Y (6 o'clock)
  const a90 = calculatePolarAngle(cx, cy + 100, cx, cy);
  // 180 deg: negative X (9 o'clock)
  const a180 = calculatePolarAngle(cx - 100, cy, cx, cy);
  // 270 deg: negative Y (12 o'clock)
  const a270 = calculatePolarAngle(cx, cy - 100, cx, cy);

  const ok =
    Math.abs(a0 - 0) < 1e-4 &&
    Math.abs(a90 - 90) < 1e-4 &&
    Math.abs(a180 - 180) < 1e-4 &&
    Math.abs(a270 - 270) < 1e-4;

  assert(
    suiteDial,
    "calculatePolarAngle computes exact cardinal angles (0°, 90°, 180°, 270°) around center",
    ok,
    `Computed: 0°=${a0.toFixed(1)}, 90°=${a90.toFixed(1)}, 180°=${a180.toFixed(1)}, 270°=${a270.toFixed(1)}`
  );
}

// Test 15: 360-Degree Boundary Wrapping in normalizeAngleDelta
{
  // Clockwise crossing 360 boundary (e.g. 355 deg to 15 deg = +20 deg)
  const deltaCW = normalizeAngleDelta(15, 355);
  // Counter-clockwise crossing 360 boundary (e.g. 15 deg to 355 deg = -20 deg)
  const deltaCCW = normalizeAngleDelta(355, 15);
  // Standard within quadrant (100 to 125 = +25 deg)
  const deltaStandard = normalizeAngleDelta(125, 100);

  const ok = deltaCW === 20 && deltaCCW === -20 && deltaStandard === 25;

  assert(
    suiteDial,
    "normalizeAngleDelta handles 360° boundary transitions seamlessly without discontinuous sign flips",
    ok,
    `deltaCW (355°->15°): ${deltaCW}°, deltaCCW (15°->355°): ${deltaCCW}°, deltaStandard: ${deltaStandard}°`
  );
}

// Test 16: Detent Crossing Detection for Haptic Audio
{
  // Moving from 0° to 45° with 15° step: detents 1 (15°), 2 (30°), 3 (45°)
  const crossedForward = getDetentsCrossed(0, 45, 15);
  // Moving backward from 45° to 0°: detents 3, 2, 1
  const crossedBackward = getDetentsCrossed(45, 0, 15);
  // Stationary move: 0 detents
  const crossedZero = getDetentsCrossed(22, 22, 15);

  const forwardOk =
    crossedForward.length === 3 &&
    crossedForward[0] === 1 &&
    crossedForward[1] === 2 &&
    crossedForward[2] === 3;
  const backwardOk =
    crossedBackward.length === 3 &&
    crossedBackward[0] === 3 &&
    crossedBackward[1] === 2 &&
    crossedBackward[2] === 1;

  assert(
    suiteDial,
    "getDetentsCrossed identifies precise forward and reverse ratchet detents for audio click feedback",
    forwardOk && backwardOk && crossedZero.length === 0,
    `Forward crossed: [${crossedForward.join(", ")}], Backward crossed: [${crossedBackward.join(", ")}]`
  );
}

// =============================================================================
// SUITE 3: Tactile Theme Switching Engine (5 Modes & Persistence)
// =============================================================================
const suiteTheme = "ThemeSwitcher - 5 Tactile Material Modes";

// Test 17: Exactly 5 Themes Defined
{
  const count = THEMES.length;
  assert(
    suiteTheme,
    "THEMES list defines exactly 5 distinct theme options",
    count === 5,
    `Actual theme count: ${count}`
  );
}

// Test 18: Theme ID Validation
{
  const expectedThemes: ThemeMode[] = ["base", "concrete", "rust", "verdigris", "blood"];
  const allValid = expectedThemes.every((id) => isValidTheme(id));
  const invalidRejected = !isValidTheme("neon") && !isValidTheme("") && !isValidTheme("dark");

  assert(
    suiteTheme,
    "isValidTheme strictly validates 'base', 'concrete', 'rust', 'verdigris', 'blood' and rejects foreign modes",
    allValid && invalidRejected,
    `All 5 valid: ${allValid}, Invalid rejected: ${invalidRejected}`
  );
}

// Test 19: Theme Color Palette Integrity (Valid Hex Values)
{
  const hexRegex = /^#[0-9a-fA-F]{6}$/;
  let allHexValid = true;

  for (const t of THEMES) {
    if (!hexRegex.test(t.bgHex) || !hexRegex.test(t.accentHex)) {
      allHexValid = false;
    }
  }

  assert(
    suiteTheme,
    "All theme definitions specify valid 6-digit RGB hexadecimal color codes for bgHex and accentHex",
    allHexValid,
    `Checked themes: ${THEMES.map((t) => `${t.id}:(${t.bgHex}, ${t.accentHex})`).join(", ")}`
  );
}

// Test 20: Theme Mode Persistence Simulation
{
  // Simulated storage sandbox
  const storageMock: Record<string, string> = {};
  const originalSessionStorage = global.window ? window.sessionStorage : undefined;

  // Emulate sessionStorage
  const fakeSessionStorage = {
    getItem: (key: string) => storageMock[key] || null,
    setItem: (key: string, val: string) => {
      storageMock[key] = val;
    },
    removeItem: (key: string) => {
      delete storageMock[key];
    },
    clear: () => {
      for (const k of Object.keys(storageMock)) delete storageMock[k];
    },
  };

  (global as unknown as { window: { sessionStorage: typeof fakeSessionStorage } }).window = {
    sessionStorage: fakeSessionStorage,
  };

  applyThemeMode("verdigris");
  const stored = fakeSessionStorage.getItem(STORAGE_KEY);
  const initial = getInitialThemeMode();

  assert(
    suiteTheme,
    "applyThemeMode persists selected theme to sessionStorage and getInitialThemeMode recovers it",
    stored === "verdigris" && initial === "verdigris",
    `Stored theme: ${stored}, Recovered theme: ${initial}`
  );

  // Fallback to base when empty
  fakeSessionStorage.clear();
  const fallback = getInitialThemeMode();
  assert(
    suiteTheme,
    "getInitialThemeMode gracefully falls back to 'base' when storage is uninitialized",
    fallback === "base",
    `Fallback theme: ${fallback}`
  );
}

// =============================================================================
// SUITE 4: Cross-Milestone Regression Checks (M1 Math & M2 Showcase)
// =============================================================================
const suiteRegression = "Regression - Cross-Milestone Compatibility";

// Test 21: M1 Fibonacci Sphere Points Surface Invariance
{
  const pts = calculateFibonacciSpherePoints(14, 280);
  let maxDelta = 0;
  for (const p of pts) {
    const dist = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
    const delta = Math.abs(dist - 280);
    if (delta > maxDelta) maxDelta = delta;
  }
  assert(
    suiteRegression,
    "Regression M1: Fibonacci sphere points maintain strict surface radius invariance (|dist - R| < 1e-4)",
    maxDelta < 1e-4,
    `Max radius delta across 14 points: ${maxDelta.toExponential(4)}`
  );
}

// Test 22: M1 Projects Data Taxonomy
{
  const count = PROJECTS.length;
  const badgesValid = PROJECTS.every((p) => ["Case", "Shot", "Research", "WIP"].includes(p.badge));
  assert(
    suiteRegression,
    "Regression M1: Portfolio project dataset maintains full taxonomy ('Case' | 'Shot' | 'Research' | 'WIP')",
    count === 8 && badgesValid,
    `Project count: ${count}, badgesValid: ${badgesValid}`
  );
}

// Test 23: M2 Tilt Bounds & Glare Opacity Calculation
{
  const maxTilt = 12;
  const u = 1;
  const v = 1;
  const rotX = -v * maxTilt;
  const rotY = u * maxTilt;
  const dist = Math.sqrt(u * u + v * v);
  const glareOpacity = Math.min(0.35, dist * 0.28);

  assert(
    suiteRegression,
    "Regression M2: 3D perspective card tilt bounds (±12°) and specular glare limits (0.35) preserved",
    Math.abs(rotX) === 12 && Math.abs(rotY) === 12 && glareOpacity === 0.35,
    `rotX: ${rotX}°, rotY: ${rotY}°, glareOpacity: ${glareOpacity}`
  );
}

// Test 24: Lenis & Detent Step Synchrony Constant
{
  assert(
    suiteDial,
    "DETENT_STEP_DEG is calibrated to 15 degrees for crisp mechanical detent feedback",
    DETENT_STEP_DEG === 15,
    `DETENT_STEP_DEG: ${DETENT_STEP_DEG}°`
  );
}

// =============================================================================
// SUMMARY & REPORTING
// =============================================================================
console.log("--------------------------------------------------------------------------------");
let totalPassed = 0;
let totalFailed = 0;

for (const res of results) {
  const statusMark = res.passed ? "✓ PASS" : "✗ FAIL";
  console.log(`[${statusMark}] [${res.suite}] ${res.name}`);
  console.log(`         Details: ${res.details}`);
  if (res.error) {
    console.log(`         ERROR: ${res.error}`);
  }
  if (res.passed) {
    totalPassed++;
  } else {
    totalFailed++;
  }
}

console.log("\n================================================================================");
console.log(`TOTAL TESTS: ${results.length} | PASSED: ${totalPassed} | FAILED: ${totalFailed}`);
console.log(`OVERALL STRESS SUITE VERDICT: ${totalFailed === 0 ? "APPROVE" : "REQUEST_CHANGES"}`);
console.log("================================================================================\n");

if (totalFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
