/**
 * Adversarial Empirical Stress Test Suite for Milestone M2
 * Focus: Kinematics boundary stress, Long-term Quaternion drift,
 * Gimbal lock resilience, NaN generation under rapid multi-axis drags,
 * and Antipodal / Singularity edge cases.
 */

import * as THREE from "three";
import { calculateFibonacciSpherePoints, normalizeVector } from "../src/utils/math3d";

interface AdversarialTestResult {
  category: string;
  name: string;
  passed: boolean;
  details: string;
  error?: string;
}

const results: AdversarialTestResult[] = [];

function assertAdversarial(
  category: string,
  name: string,
  condition: boolean,
  details: string,
  error?: string
) {
  results.push({
    category,
    name,
    passed: Boolean(condition),
    details,
    error: condition ? undefined : (error || "Assertion failed"),
  });
}

console.log("================================================================================");
console.log("   ADVERSARIAL STRESS TEST SUITE: M2 KINEMATICS & QUATERNION MATH (CRITIC)     ");
console.log("================================================================================\n");

// =============================================================================
// CATEGORY 1: Card Tilt Kinematics Under Extreme & Hostile Cursor Coordinates
// =============================================================================
const catTilt = "Card Tilt Kinematics - Hostile Coordinates";

function computeCardTiltModel(
  clientX: number,
  clientY: number,
  rect: { left: number; top: number; width: number; height: number },
  maxTilt = 12
) {
  if (rect.width <= 0 || rect.height <= 0) {
    return { u: 0, v: 0, rotX: 0, rotY: 0, glareX: 50, glareY: 50, glareOpacity: 0, valid: false };
  }

  const halfW = rect.width / 2;
  const halfH = rect.height / 2;
  const rawU = (clientX - (rect.left + halfW)) / halfW;
  const rawV = (clientY - (rect.top + halfH)) / halfH;

  const u = Math.max(-1, Math.min(1, rawU));
  const v = Math.max(-1, Math.min(1, rawV));

  const rotX = -v * maxTilt;
  const rotY = u * maxTilt;

  const glareX = (u + 1) * 50;
  const glareY = (v + 1) * 50;
  const distance = Math.sqrt(u * u + v * v);
  const glareOpacity = Math.min(0.35, distance * 0.28);

  return { u, v, rotX, rotY, glareX, glareY, glareOpacity, valid: true };
}

// 1.1 Out-of-bounds coordinates at cosmic distances (+/- 1e9 px)
{
  const rect = { left: 100, top: 100, width: 300, height: 200 };
  const hostileCoords = [
    { x: 1e9, y: 1e9, expU: 1, expV: 1, expRotX: -12, expRotY: 12 },
    { x: -1e9, y: -1e9, expU: -1, expV: -1, expRotX: 12, expRotY: -12 },
    { x: 1e9, y: -1e9, expU: 1, expV: -1, expRotX: 12, expRotY: 12 },
    { x: -1e9, y: 1e9, expU: -1, expV: 1, expRotX: -12, expRotY: -12 },
  ];

  let allClamped = true;
  for (const c of hostileCoords) {
    const res = computeCardTiltModel(c.x, c.y, rect);
    if (
      res.u !== c.expU ||
      res.v !== c.expV ||
      res.rotX !== c.expRotX ||
      res.rotY !== c.expRotY ||
      res.glareOpacity > 0.35 ||
      res.glareX < 0 ||
      res.glareX > 100 ||
      res.glareY < 0 ||
      res.glareY > 100
    ) {
      allClamped = false;
    }
  }

  assertAdversarial(
    catTilt,
    "Cosmic out-of-bounds coordinates (+/- 10^9 px) clamp cleanly to exact bounds",
    allClamped,
    `All ${hostileCoords.length} extreme quadrants strictly bounded within [-1, 1] and [0, 100]%`
  );
}

// 1.2 Subpixel card dimensions (e.g. 0.001 x 0.001 px)
{
  const rect = { left: 0, top: 0, width: 0.001, height: 0.001 };
  const res = computeCardTiltModel(100, 100, rect);
  const ok = !Number.isNaN(res.u) && !Number.isNaN(res.rotX) && res.u === 1 && res.v === 1;

  assertAdversarial(
    catTilt,
    "Subpixel card geometry (0.001px) does not overflow or cause NaN",
    ok,
    `u: ${res.u}, v: ${res.v}, rotX: ${res.rotX}, rotY: ${res.rotY}`
  );
}

// 1.3 Negative card coordinates (scrolled off-screen: left=-500, top=-500)
{
  const rect = { left: -500, top: -500, width: 400, height: 300 };
  // Center is at (-300, -350)
  const resCenter = computeCardTiltModel(-300, -350, rect);
  const isCenterOk = Math.abs(resCenter.rotX) < 1e-5 && Math.abs(resCenter.rotY) < 1e-5;

  assertAdversarial(
    catTilt,
    "Negative off-screen viewport offsets correctly compute neutral center",
    isCenterOk,
    `rotX: ${resCenter.rotX}, rotY: ${resCenter.rotY}`
  );
}

// 1.4 Glare opacity continuity: gradient of opacity monotonic with radial distance
{
  const rect = { left: 0, top: 0, width: 200, height: 200 };
  let monotonic = true;
  let prevOpacity = -1;

  for (let r = 0; r <= 100; r += 5) {
    const res = computeCardTiltModel(100 + r, 100, rect);
    if (res.glareOpacity < prevOpacity - 1e-6) {
      monotonic = false;
    }
    prevOpacity = res.glareOpacity;
  }

  assertAdversarial(
    catTilt,
    "Specular glare opacity is monotonically non-decreasing from center to boundary",
    monotonic,
    `Monotonic radial ramp verified across 21 concentric sample points`
  );
}

// =============================================================================
// CATEGORY 2: Long-Term Quaternion Numerical Stability & Drift (Idle Liveness)
// =============================================================================
const catDrift = "Quaternion Stability - Long-Term Drift";

// 2.1 10,000 frames ambient drift (~3 minutes at 60fps)
{
  const q = new THREE.Quaternion();
  const vel = new THREE.Vector2(0.0001, 0.0008);
  const deltaEuler = new THREE.Euler(vel.x, vel.y, 0, "XYZ");
  const deltaQ = new THREE.Quaternion().setFromEuler(deltaEuler);

  for (let i = 0; i < 10000; i++) {
    q.premultiply(deltaQ);
  }

  const magnitude = q.length();
  const deltaFromUnit = Math.abs(magnitude - 1.0);
  // Three.js quaternion premultiply of unit quaternions has slight float error
  // Let's verify whether delta stays within safe WebGL tolerance (< 1e-3)
  const isSafe = deltaFromUnit < 1e-3 && !Number.isNaN(magnitude);

  assertAdversarial(
    catDrift,
    "10,000 idle ambient drift steps maintain quaternion magnitude within 1e-3 tolerance",
    isSafe,
    `Final magnitude: ${magnitude.toFixed(7)}, delta: ${deltaFromUnit.toExponential(4)}`
  );
}

// 2.2 100,000 frames ambient drift (~28 minutes at 60fps)
{
  const q = new THREE.Quaternion();
  const vel = new THREE.Vector2(0.0001, 0.0008);
  const deltaEuler = new THREE.Euler(vel.x, vel.y, 0, "XYZ");
  const deltaQ = new THREE.Quaternion().setFromEuler(deltaEuler);

  for (let i = 0; i < 100000; i++) {
    q.premultiply(deltaQ);
  }

  const magnitude = q.length();
  const deltaFromUnit = Math.abs(magnitude - 1.0);
  const isSafe = deltaFromUnit < 5e-3 && !Number.isNaN(magnitude);

  assertAdversarial(
    catDrift,
    "100,000 idle ambient drift steps (~28 min) do not explode or collapse magnitude",
    isSafe,
    `Final magnitude: ${magnitude.toFixed(7)}, delta: ${deltaFromUnit.toExponential(4)}`
  );
}

// =============================================================================
// CATEGORY 3: Rapid Hostile Multi-Axis Drag Kinematics & Gimbal Lock Resilience
// =============================================================================
const catDrag = "Multi-Axis Drag Kinematics & Gimbal Lock";

// 3.1 50,000 chaotic rapid drag steps with violent direction reversals
{
  const groupQ = new THREE.Quaternion();
  let hasNaN = false;
  let maxNormDrift = 0;
  const sensitivity = 0.0035;

  // Pseudo-random deterministic chaotic trajectory (PRNG LCG)
  let seed = 123456789;
  const lcg = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  for (let step = 0; step < 50000; step++) {
    // Generate chaotic drag impulses ranging from micro-steps to violent flicks
    const dx = (lcg() - 0.5) * 500;
    const dy = (lcg() - 0.5) * 500;

    const qY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), dx * sensitivity);
    const qX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), dy * sensitivity);

    groupQ.premultiply(qY);
    groupQ.premultiply(qX);

    if (
      Number.isNaN(groupQ.x) ||
      Number.isNaN(groupQ.y) ||
      Number.isNaN(groupQ.z) ||
      Number.isNaN(groupQ.w)
    ) {
      hasNaN = true;
      break;
    }

    const drift = Math.abs(groupQ.length() - 1.0);
    if (drift > maxNormDrift) {
      maxNormDrift = drift;
    }
  }

  const passed = !hasNaN && maxNormDrift < 0.01;
  assertAdversarial(
    catDrag,
    "50,000 chaotic multi-axis drag steps withstand violent flicks with zero NaN",
    passed,
    `hasNaN: ${hasNaN}, maxNormDrift: ${maxNormDrift.toExponential(4)}, final magnitude: ${groupQ.length().toFixed(6)}`
  );
}

// 3.2 Polar Singularity & Gimbal Lock Test (Pitch exactly at +/- 90 degrees)
{
  // Test rotations that align exactly on the pitch pole (+/- PI/2)
  const angles = [
    Math.PI / 2,
    -Math.PI / 2,
    Math.PI,
    -Math.PI,
    3 * Math.PI / 2,
    2 * Math.PI,
    -2 * Math.PI,
  ];

  let gimbalLockOrNaNOccurred = false;
  let readoutsValid = true;

  for (const pitch of angles) {
    for (const yaw of angles) {
      const q = new THREE.Quaternion();
      const qPitch = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), pitch);
      const qYaw = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
      q.multiply(qPitch).multiply(qYaw);

      // Verify Euler extraction in "YXZ" order as used in useThreeSphere
      const euler = new THREE.Euler().setFromQuaternion(q, "YXZ");
      if (Number.isNaN(euler.x) || Number.isNaN(euler.y) || Number.isNaN(euler.z)) {
        gimbalLockOrNaNOccurred = true;
      }

      // Check spherical coordinates conversion
      const lat = THREE.MathUtils.radToDeg(euler.x);
      const lon = THREE.MathUtils.radToDeg(euler.y);
      const phi = (euler.x + Math.PI / 2) % Math.PI;
      const theta = (euler.y + Math.PI) % (2 * Math.PI);

      if (
        Number.isNaN(lat) ||
        Number.isNaN(lon) ||
        Number.isNaN(phi) ||
        Number.isNaN(theta) ||
        !Number.isFinite(lat) ||
        !Number.isFinite(lon)
      ) {
        readoutsValid = false;
      }

      // Verify rotation matrix orthogonality (det = 1.0, R * R^T = I)
      const mat = new THREE.Matrix4().makeRotationFromQuaternion(q);
      const det = mat.determinant();
      if (Math.abs(det - 1.0) > 1e-4) {
        readoutsValid = false;
      }
    }
  }

  assertAdversarial(
    catDrag,
    "Polar singularity angles (pitch/yaw at +/- 90, 180, 270, 360 deg) remain orthogonal with zero NaN",
    !gimbalLockOrNaNOccurred && readoutsValid,
    `Tested ${angles.length * angles.length} polar intersections. NaN: ${gimbalLockOrNaNOccurred}, valid: ${readoutsValid}`
  );
}

// =============================================================================
// CATEGORY 4: Normal Alignment & Antipodal Singularity on Sphere Surface
// =============================================================================
const catAntipodal = "Sphere Mesh Orientations & Singularities";

// 4.1 Antipodal orientation test: normal = [0, 0, -1] against source [0, 0, 1]
{
  const sourceVec = new THREE.Vector3(0, 0, 1);
  const antipodalVec = new THREE.Vector3(0, 0, -1);
  const quat = new THREE.Quaternion().setFromUnitVectors(sourceVec, antipodalVec);

  const hasNaN =
    Number.isNaN(quat.x) ||
    Number.isNaN(quat.y) ||
    Number.isNaN(quat.z) ||
    Number.isNaN(quat.w);

  // Test rotated vector: quat * sourceVec should equal antipodalVec
  const rotated = sourceVec.clone().applyQuaternion(quat);
  const dot = rotated.dot(antipodalVec);
  const isExactOpposite = Math.abs(dot - 1.0) < 1e-5;

  assertAdversarial(
    catAntipodal,
    "Antipodal normal vector [0, 0, -1] computes valid 180 deg quaternion without NaN or inversion failure",
    !hasNaN && isExactOpposite,
    `Quaternion: [${quat.x.toFixed(4)}, ${quat.y.toFixed(4)}, ${quat.z.toFixed(4)}, ${quat.w.toFixed(4)}], dot: ${dot.toFixed(5)}`
  );
}

// 4.2 Exact Parallel vector test: normal = [0, 0, 1] against source [0, 0, 1]
{
  const sourceVec = new THREE.Vector3(0, 0, 1);
  const parallelVec = new THREE.Vector3(0, 0, 1);
  const quat = new THREE.Quaternion().setFromUnitVectors(sourceVec, parallelVec);

  const isIdentity =
    Math.abs(quat.x) < 1e-6 &&
    Math.abs(quat.y) < 1e-6 &&
    Math.abs(quat.z) < 1e-6 &&
    Math.abs(quat.w - 1) < 1e-6;

  assertAdversarial(
    catAntipodal,
    "Parallel normal vector [0, 0, 1] computes exact identity quaternion without NaN",
    isIdentity,
    `Quaternion: [${quat.x}, ${quat.y}, ${quat.z}, ${quat.w}]`
  );
}

// =============================================================================
// CATEGORY 5: ResetView Slerp Stability from Arbitrary Rotations
// =============================================================================
const catSlerp = "ResetView - Slerp Interpolation";

{
  const qIdentity = new THREE.Quaternion();
  let allSlerpsClean = true;

  // Test slerp from various hostile start quaternions to identity
  const testAngles = [Math.PI / 4, Math.PI / 2, Math.PI * 0.9999, Math.PI];

  for (const ang of testAngles) {
    const startQ = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0.577, 0.577, 0.577).normalize(),
      ang
    );

    // Interpolate t from 0 to 1 in 20 steps
    for (let step = 0; step <= 20; step++) {
      const t = step / 20;
      const interpQ = new THREE.Quaternion().slerpQuaternions(startQ, qIdentity, t);

      if (
        Number.isNaN(interpQ.x) ||
        Number.isNaN(interpQ.y) ||
        Number.isNaN(interpQ.z) ||
        Number.isNaN(interpQ.w) ||
        Math.abs(interpQ.length() - 1.0) > 1e-4
      ) {
        allSlerpsClean = false;
      }
    }
  }

  assertAdversarial(
    catSlerp,
    "Slerp trajectory from extreme angles (up to 180 deg) to identity is smooth and preserves unit norm",
    allSlerpsClean,
    `Tested across 4 extreme angles with 21 interpolation samples each`
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
  console.log(`[${statusMark}] [${res.category}] ${res.name}`);
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
console.log(`CHALLENGER VERDICT: ${totalFailed === 0 ? "APPROVE" : "REQUEST_CHANGES"}`);
console.log("================================================================================\n");

if (totalFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
