/**
 * Adversarial Stress-Test Suite for Milestone M3 (Motion & Micro-Interaction Suite)
 * Author: Reviewer M3 (Reviewer & Critic)
 *
 * Focus areas:
 * 1. Preloader mathematical curve boundary continuity, floating point fuzzing, and monotonicity
 * 2. Rotary dial polar atan2 singularity at center (dx=0, dy=0), multi-turn wrapping, detent boundary conditions
 * 3. Theme switcher security: injection attack strings, prototype pollution, sessionStorage access exception handling
 * 4. GSAP ticker and Lenis integration parameters validation
 * 5. Audio synthesis parameter limits and graceful error handling
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
import { playHapticClick } from "../src/utils/audio";

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
console.log("   ADVERSARIAL STRESS TEST SUITE: MILESTONE M3 MOTION & TACTILE (CRITIC)       ");
console.log("================================================================================\n");

// =============================================================================
// CHALLENGE 1: Preloader Math Fuzzing & C0 Continuity across Phase Boundaries
// =============================================================================
const suitePreloader = "Adversarial: Preloader Mathematical Curve";

// Test 1: Boundary point C0 continuity at t = 0.40
{
  const eps = 1e-7;
  const left = calculatePreloaderProgress(0.40 - eps);
  const mid = calculatePreloaderProgress(0.40);
  const right = calculatePreloaderProgress(0.40 + eps);
  const deltaLeft = Math.abs(mid - left);
  const deltaRight = Math.abs(right - mid);

  assert(
    suitePreloader,
    "Phase 1 -> Phase 2 boundary at t=0.40 exhibits C0 continuity (step <= 1)",
    deltaLeft <= 1 && deltaRight <= 1 && mid === 65,
    `left: ${left}, mid: ${mid}, right: ${right}, deltaLeft: ${deltaLeft}, deltaRight: ${deltaRight}`
  );
}

// Test 2: Boundary point C0 continuity at t = 0.75
{
  const eps = 1e-7;
  const left = calculatePreloaderProgress(0.75 - eps);
  const mid = calculatePreloaderProgress(0.75);
  const right = calculatePreloaderProgress(0.75 + eps);
  const deltaLeft = Math.abs(mid - left);
  const deltaRight = Math.abs(right - mid);

  assert(
    suitePreloader,
    "Phase 2 -> Phase 3 boundary at t=0.75 exhibits C0 continuity (step <= 1)",
    deltaLeft <= 1 && deltaRight <= 1 && mid === 88,
    `left: ${left}, mid: ${mid}, right: ${right}, deltaLeft: ${deltaLeft}, deltaRight: ${deltaRight}`
  );
}

// Test 3: Floating point fuzzing with 10,000 sub-steps
{
  let nonMonotonicCount = 0;
  let nanCount = 0;
  let outOfBoundsCount = 0;
  let last = 0;
  const STEPS = 10000;

  for (let i = 0; i <= STEPS; i++) {
    const t = i / STEPS;
    const val = calculatePreloaderProgress(t);
    if (Number.isNaN(val)) nanCount++;
    if (val < 0 || val > 100) outOfBoundsCount++;
    if (val < last) nonMonotonicCount++;
    last = val;
  }

  assert(
    suitePreloader,
    "10,000-step sub-millisecond fuzzer confirms zero NaN, zero out-of-bounds, zero negative jumps",
    nanCount === 0 && outOfBoundsCount === 0 && nonMonotonicCount === 0,
    `NaN: ${nanCount}, OOB: ${outOfBoundsCount}, NonMonotonic: ${nonMonotonicCount}, Final: ${last}%`
  );
}

// Test 4: Extreme inputs (+/- Infinity, NaN)
{
  const negInf = calculatePreloaderProgress(-Infinity);
  const posInf = calculatePreloaderProgress(Infinity);

  assert(
    suitePreloader,
    "calculatePreloaderProgress handles -Infinity (clamps to 0) and +Infinity (clamps to 100)",
    negInf === 0 && posInf === 100,
    `negInf: ${negInf}, posInf: ${posInf}`
  );
}

// =============================================================================
// CHALLENGE 2: Rotary Dial Singularity, Extreme Coordinates & Multi-Turn Wrapping
// =============================================================================
const suiteDial = "Adversarial: Rotary Dial Kinematics & Polar Geometry";

// Test 5: Exact Center Singularity (dx=0, dy=0)
{
  const cx = 150;
  const cy = 150;
  const angleCenter = calculatePolarAngle(cx, cy, cx, cy);

  assert(
    suiteDial,
    "calculatePolarAngle handles exact center coordinates (dx=0, dy=0) without NaN or crash",
    !Number.isNaN(angleCenter) && angleCenter >= 0 && angleCenter < 360,
    `angleCenter: ${angleCenter}°`
  );
}

// Test 6: Extreme Astronomical Coordinates (+/- 10^12 px)
{
  const cx = 150;
  const cy = 150;
  const aLargeX = calculatePolarAngle(cx + 1e12, cy, cx, cy);
  const aLargeY = calculatePolarAngle(cx, cy + 1e12, cx, cy);
  const aLargeNegX = calculatePolarAngle(cx - 1e12, cy, cx, cy);
  const aLargeNegY = calculatePolarAngle(cx, cy - 1e12, cx, cy);

  const ok =
    Math.abs(aLargeX - 0) < 1e-3 &&
    Math.abs(aLargeY - 90) < 1e-3 &&
    Math.abs(aLargeNegX - 180) < 1e-3 &&
    Math.abs(aLargeNegY - 270) < 1e-3;

  assert(
    suiteDial,
    "calculatePolarAngle computes correct angles under astronomical coordinate scale (10^12 px)",
    ok,
    `aLargeX: ${aLargeX}°, aLargeY: ${aLargeY}°, aLargeNegX: ${aLargeNegX}°, aLargeNegY: ${aLargeNegY}°`
  );
}

// Test 7: Multi-Turn Angle Wrapping Continuous Tracking (10 clockwise loops)
{
  let currentAngle = 0;
  let totalAccumulated = 0;
  let wrappingDiscontinuity = false;

  for (let step = 1; step <= 3600; step++) {
    const nextAngle = step % 360;
    const delta = normalizeAngleDelta(nextAngle, currentAngle);
    if (delta !== 1 && !(currentAngle === 359 && nextAngle === 0 && delta === 1)) {
      wrappingDiscontinuity = true;
    }
    totalAccumulated += delta;
    currentAngle = nextAngle;
  }

  assert(
    suiteDial,
    "normalizeAngleDelta preserves continuous cumulative rotation over 10 full 360° revolutions (3600°)",
    !wrappingDiscontinuity && totalAccumulated === 3600,
    `totalAccumulated: ${totalAccumulated}°, discontinuity: ${wrappingDiscontinuity}`
  );
}

// Test 8: Multi-Turn Counter-Clockwise Rotation Tracking (-10 loops)
{
  let currentAngle = 0;
  let totalAccumulated = 0;
  let wrappingDiscontinuity = false;

  for (let step = 1; step <= 3600; step++) {
    const nextAngle = (360 - (step % 360)) % 360;
    const delta = normalizeAngleDelta(nextAngle, currentAngle);
    if (delta !== -1 && !(currentAngle === 0 && nextAngle === 359 && delta === -1)) {
      wrappingDiscontinuity = true;
    }
    totalAccumulated += delta;
    currentAngle = nextAngle;
  }

  assert(
    suiteDial,
    "normalizeAngleDelta preserves continuous cumulative counter-clockwise rotation over 10 revolutions (-3600°)",
    !wrappingDiscontinuity && totalAccumulated === -3600,
    `totalAccumulated: ${totalAccumulated}°, discontinuity: ${wrappingDiscontinuity}`
  );
}

// Test 9: Detent Crossing Stress (Zero Step, Negative Step, Microscopic Step)
{
  const zeroStep = getDetentsCrossed(0, 50, 0);
  const negStep = getDetentsCrossed(0, 50, -5);
  const microCrossed = getDetentsCrossed(14.999, 15.001, 15);

  assert(
    suiteDial,
    "getDetentsCrossed rejects zero/negative steps safely and detects exact 15° threshold crossing",
    zeroStep.length === 0 && negStep.length === 0 && microCrossed.length === 1 && microCrossed[0] === 1,
    `zeroStep: ${zeroStep.length}, negStep: ${negStep.length}, microCrossed: [${microCrossed.join(",")}]`
  );
}

// Test 10: Rotary Dial Socket 9 Max Travel (270°) and Digit 9 Scroll-to-Top Trigger
{
  const maxRot9 = getSocketMaxRotation(9);
  const dialThreshold = maxRot9 - 18; // 252 degrees

  assert(
    suiteDial,
    "Socket 9 travel is exactly 270° and reaches dial completion threshold at >= 252°",
    maxRot9 === 270 && dialThreshold === 252,
    `maxRot9: ${maxRot9}°, threshold: ${dialThreshold}°`
  );
}

// =============================================================================
// CHALLENGE 3: Theme Switcher Security & Hostile Input Resilience
// =============================================================================
const suiteSecurity = "Adversarial: Theme Switcher Security & Input Sanitization";

// Test 11: Hostile injection strings rejected by isValidTheme
{
  const maliciousInputs = [
    "<script>alert(1)</script>",
    "javascript:void(0)",
    "__proto__",
    "constructor",
    "toString",
    "base; DROP TABLE themes;",
    "' OR '1'='1",
    "base\nconcrete",
    " ",
    "\0",
  ];

  const allRejected = maliciousInputs.every((input) => !isValidTheme(input));

  assert(
    suiteSecurity,
    "isValidTheme rejects prototype pollution and injection strings without throwing",
    allRejected,
    `All ${maliciousInputs.length} malicious inputs safely rejected: ${allRejected}`
  );
}

// Test 12: SessionStorage throwing SecurityError / QuotaExceededError
{
  // Mock window with hostile throwing sessionStorage
  const throwingStorage = {
    getItem: (_key: string): string | null => {
      throw new Error("SecurityError: Access is denied for this document");
    },
    setItem: (_key: string, _val: string): void => {
      throw new Error("QuotaExceededError: DOM Exception 22");
    },
  };

  (global as unknown as { window: { sessionStorage: typeof throwingStorage } }).window = {
    sessionStorage: throwingStorage,
  };

  let threwApply = false;
  let threwGet = false;
  let fallback: string | null = null;

  try {
    applyThemeMode("rust");
  } catch {
    threwApply = true;
  }

  try {
    fallback = getInitialThemeMode();
  } catch {
    threwGet = true;
  }

  assert(
    suiteSecurity,
    "applyThemeMode and getInitialThemeMode gracefully survive throwing sessionStorage (SecurityError/Private Mode)",
    !threwApply && !threwGet && fallback === "base",
    `threwApply: ${threwApply}, threwGet: ${threwGet}, fallback: ${fallback}`
  );
}

// =============================================================================
// CHALLENGE 4: Web Audio Procedural Synthesis Graceful Fallback
// =============================================================================
const suiteAudio = "Adversarial: Web Audio Synthesis & Policy Fallback";

// Test 13: playHapticClick in Headless Node.js Environment
{
  // In Node.js environment without window or AudioContext, must execute silently without throwing
  let audioThrew = false;
  try {
    playHapticClick(820);
    playHapticClick(440);
    playHapticClick(-100); // Hostile frequency
    playHapticClick(0);
    playHapticClick(100000);
  } catch {
    audioThrew = true;
  }

  assert(
    suiteAudio,
    "playHapticClick survives headless / non-browser environment and hostile frequencies without throwing",
    !audioThrew,
    `audioThrew: ${audioThrew}`
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
console.log(`TOTAL ADVERSARIAL TESTS: ${results.length} | PASSED: ${totalPassed} | FAILED: ${totalFailed}`);
console.log(`ADVERSARIAL SUITE VERDICT: ${totalFailed === 0 ? "APPROVE" : "REQUEST_CHANGES"}`);
console.log("================================================================================\n");

if (totalFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
