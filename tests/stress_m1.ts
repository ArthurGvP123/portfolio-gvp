/**
 * Comprehensive Empirical Stress-Test Suite for Milestone M1
 * math3d.ts and projects.ts
 */

import { calculateFibonacciSpherePoints, normalizeVector } from "../src/utils/math3d";
import { PROJECTS } from "../src/data/projects";
import { ProjectBadge } from "../src/types/portfolio";

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
console.log("       EMPIRICAL STRESS TEST SUITE: MILESTONE M1 (MATH3D & PROJECTS)          ");
console.log("================================================================================\n");

// -----------------------------------------------------------------------------
// SUITE 1: Fibonacci Sphere Points Mathematics (math3d.ts)
// -----------------------------------------------------------------------------
const suiteMath = "math3d - calculateFibonacciSpherePoints";

// Test N = 0
{
  const pts = calculateFibonacciSpherePoints(0, 300);
  assert(
    suiteMath,
    "N = 0 returns empty array",
    Array.isArray(pts) && pts.length === 0,
    `Returned ${pts.length} points for N=0`
  );
}

// Test N = 1
{
  const R = 300;
  const pts = calculateFibonacciSpherePoints(1, R);
  const len = pts.length;
  let distOk = false;
  let maxDelta = 0;
  if (len === 1) {
    const p = pts[0];
    const dist = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
    maxDelta = Math.abs(dist - R);
    distOk = maxDelta <= 1e-4;
  }
  assert(
    suiteMath,
    "N = 1 returns exactly 1 point on sphere surface",
    len === 1 && distOk,
    `Points count: ${len}, max distance delta from R: ${maxDelta.toExponential(4)}`
  );
}

// Test N = 14 (Default project count)
{
  const R = 300;
  const pts = calculateFibonacciSpherePoints(14, R);
  const len = pts.length;
  let maxDelta = 0;
  let allOnSphere = true;
  for (let i = 0; i < len; i++) {
    const p = pts[i];
    const dist = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
    const delta = Math.abs(dist - R);
    if (delta > maxDelta) maxDelta = delta;
    if (delta > 1e-4) allOnSphere = false;
  }
  assert(
    suiteMath,
    "N = 14 points all lie on sphere surface (|dist - R| <= 1e-4)",
    len === 14 && allOnSphere,
    `Points count: ${len}, max distance delta: ${maxDelta.toExponential(4)}`
  );
}

// Test N = 100
{
  const R = 250;
  const pts = calculateFibonacciSpherePoints(100, R);
  const len = pts.length;
  let maxDelta = 0;
  let allOnSphere = true;
  for (let i = 0; i < len; i++) {
    const p = pts[i];
    const dist = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
    const delta = Math.abs(dist - R);
    if (delta > maxDelta) maxDelta = delta;
    if (delta > 1e-4) allOnSphere = false;
  }
  assert(
    suiteMath,
    "N = 100 points all lie on sphere surface (|dist - R| <= 1e-4)",
    len === 100 && allOnSphere,
    `Points count: ${len}, max distance delta: ${maxDelta.toExponential(4)}`
  );
}

// Test N = 1000
{
  const R = 500;
  const pts = calculateFibonacciSpherePoints(1000, R);
  const len = pts.length;
  let maxDelta = 0;
  let allOnSphere = true;
  for (let i = 0; i < len; i++) {
    const p = pts[i];
    const dist = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
    const delta = Math.abs(dist - R);
    if (delta > maxDelta) maxDelta = delta;
    if (delta > 1e-4) allOnSphere = false;
  }
  assert(
    suiteMath,
    "N = 1000 points all lie on sphere surface (|dist - R| <= 1e-4)",
    len === 1000 && allOnSphere,
    `Points count: ${len}, max distance delta: ${maxDelta.toExponential(4)}`
  );
}

// Coordinate Range & No NaN checks across N = 14
{
  const pts = calculateFibonacciSpherePoints(14, 300);
  let hasNaN = false;
  let phiValid = true;
  let thetaValid = true;
  for (const p of pts) {
    if (Number.isNaN(p.x) || Number.isNaN(p.y) || Number.isNaN(p.z) || Number.isNaN(p.phi) || Number.isNaN(p.theta)) {
      hasNaN = true;
    }
    if (p.phi < 0 || p.phi > Math.PI + 1e-6) phiValid = false;
    if (p.theta < 0 || p.theta > 2 * Math.PI + 1e-6) thetaValid = false;
  }
  assert(
    suiteMath,
    "N = 14 points have valid spherical coordinates (phi in [0, pi], theta in [0, 2pi], zero NaN)",
    !hasNaN && phiValid && thetaValid,
    `hasNaN: ${hasNaN}, phiValid: ${phiValid}, thetaValid: ${thetaValid}`
  );
}

// Point Distinctness Check (No two points occupy the exact same coordinate)
{
  const pts = calculateFibonacciSpherePoints(14, 300);
  let duplicates = 0;
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[i].x - pts[j].x;
      const dy = pts[i].y - pts[j].y;
      const dz = pts[i].z - pts[j].z;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (d < 1e-3) duplicates++;
    }
  }
  assert(
    suiteMath,
    "N = 14 all points are spatially distinct (minimum inter-point distance > 0)",
    duplicates === 0,
    `Duplicate points found: ${duplicates}`
  );
}

// Extreme / Invalid Inputs: Negative Count
{
  const pts = calculateFibonacciSpherePoints(-10, 300);
  assert(
    suiteMath,
    "total = -10 (negative count) returns empty array",
    Array.isArray(pts) && pts.length === 0,
    `Returned ${pts.length} points`
  );
}

// Extreme / Invalid Inputs: Negative Radius
{
  const pts = calculateFibonacciSpherePoints(14, -300);
  assert(
    suiteMath,
    "radius = -300 (negative radius) returns empty array",
    Array.isArray(pts) && pts.length === 0,
    `Returned ${pts.length} points`
  );
}

// Extreme / Invalid Inputs: Zero Radius
{
  const pts = calculateFibonacciSpherePoints(14, 0);
  assert(
    suiteMath,
    "radius = 0 (zero radius) returns empty array",
    Array.isArray(pts) && pts.length === 0,
    `Returned ${pts.length} points`
  );
}

// Extreme / Invalid Inputs: NaN Radius
{
  const pts = calculateFibonacciSpherePoints(14, NaN);
  // An adversarial test: does it produce points with NaN or gracefully reject?
  const safe = pts.length === 0 || pts.every(p => !Number.isNaN(p.x));
  assert(
    suiteMath,
    "radius = NaN does not corrupt output or crash",
    pts.length === 0,
    `Points returned for NaN radius: ${pts.length} (expected 0 for strict validation)`
  );
}

// Extreme / Invalid Inputs: NaN Total
{
  const pts = calculateFibonacciSpherePoints(NaN, 300);
  assert(
    suiteMath,
    "total = NaN returns empty array",
    pts.length === 0,
    `Points returned for NaN total: ${pts.length}`
  );
}

// -----------------------------------------------------------------------------
// SUITE 2: Vector Normalization (math3d.ts)
// -----------------------------------------------------------------------------
const suiteVec = "math3d - normalizeVector";

// Zero vector
{
  const norm = normalizeVector(0, 0, 0);
  const isGraceful = norm[0] === 0 && norm[1] === 0 && norm[2] === 1;
  const noNaN = !norm.some(Number.isNaN);
  assert(
    suiteVec,
    "Zero vector [0, 0, 0] normalizes gracefully without NaN to fallback unit vector",
    isGraceful && noNaN,
    `Result: [${norm.join(", ")}]`
  );
}

// Unit axis vectors
{
  const vX = normalizeVector(1, 0, 0);
  const vY = normalizeVector(0, 1, 0);
  const vZ = normalizeVector(0, 0, 1);
  const vNegX = normalizeVector(-1, 0, 0);
  const ok =
    vX[0] === 1 && vX[1] === 0 && vX[2] === 0 &&
    vY[0] === 0 && vY[1] === 1 && vY[2] === 0 &&
    vZ[0] === 0 && vZ[1] === 0 && vZ[2] === 1 &&
    vNegX[0] === -1 && vNegX[1] === 0 && vNegX[2] === 0;
  assert(
    suiteVec,
    "Standard unit axis vectors preserve direction and exact magnitude 1.0",
    ok,
    `Unit axes passed: ${ok}`
  );
}

// Arbitrary vector
{
  const norm = normalizeVector(3, 4, 0);
  const len = Math.sqrt(norm[0] ** 2 + norm[1] ** 2 + norm[2] ** 2);
  const ok = Math.abs(len - 1.0) < 1e-6 && Math.abs(norm[0] - 0.6) < 1e-6 && Math.abs(norm[1] - 0.8) < 1e-6;
  assert(
    suiteVec,
    "Vector [3, 4, 0] normalizes to [0.6, 0.8, 0] with unit magnitude",
    ok,
    `Result: [${norm.map(n => n.toFixed(4)).join(", ")}], len: ${len}`
  );
}

// Microscopic magnitude vector (Subnormal / near-zero float)
{
  const norm = normalizeVector(1e-15, 1e-15, 1e-15);
  const len = Math.sqrt(norm[0] ** 2 + norm[1] ** 2 + norm[2] ** 2);
  const ok = Math.abs(len - 1.0) < 1e-4 && !norm.some(Number.isNaN);
  assert(
    suiteVec,
    "Microscopic vector [1e-15, 1e-15, 1e-15] normalizes to unit length without underflow NaN",
    ok,
    `Result: [${norm.map(n => n.toFixed(4)).join(", ")}], len: ${len}`
  );
}

// Astronomical magnitude vector
{
  const norm = normalizeVector(1e15, 0, 0);
  const ok = Math.abs(norm[0] - 1.0) < 1e-6 && !norm.some(Number.isNaN);
  assert(
    suiteVec,
    "Astronomical vector [1e15, 0, 0] normalizes to [1, 0, 0] without overflow NaN",
    ok,
    `Result: [${norm.map(n => n.toFixed(4)).join(", ")}]`
  );
}

// -----------------------------------------------------------------------------
// SUITE 3: Project Data Model Integrity & Edge Testing (projects.ts)
// -----------------------------------------------------------------------------
const suiteData = "projects - Data Model & Coverage";

// Project count
{
  assert(
    suiteData,
    "Total projects count >= 8 (meets authentic portfolio vault)",
    PROJECTS.length >= 8,
    `Actual count: ${PROJECTS.length}`
  );
}

// ID Uniqueness
{
  const idSet = new Set<string>();
  const duplicates: string[] = [];
  for (const p of PROJECTS) {
    if (idSet.has(p.id)) {
      duplicates.push(p.id);
    }
    idSet.add(p.id);
  }
  assert(
    suiteData,
    "All project IDs are strictly unique",
    duplicates.length === 0,
    duplicates.length === 0 ? `All ${PROJECTS.length} IDs unique` : `Duplicates: ${duplicates.join(", ")}`
  );
}

// Slug Uniqueness
{
  const slugSet = new Set<string>();
  const duplicates: string[] = [];
  for (const p of PROJECTS) {
    if (slugSet.has(p.slug)) {
      duplicates.push(p.slug);
    }
    slugSet.add(p.slug);
  }
  assert(
    suiteData,
    "All project slugs are strictly unique and URL-safe",
    duplicates.length === 0,
    duplicates.length === 0 ? `All ${PROJECTS.length} slugs unique` : `Duplicates: ${duplicates.join(", ")}`
  );
}

// Slug format (kebab-case URL-safe)
{
  const invalidSlugs = PROJECTS.filter(p => !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug)).map(p => p.slug);
  assert(
    suiteData,
    "All project slugs follow strict kebab-case format",
    invalidSlugs.length === 0,
    invalidSlugs.length === 0 ? "All slugs valid kebab-case" : `Invalid slugs: ${invalidSlugs.join(", ")}`
  );
}

// Badge Taxonomy Compliance
{
  const allowedBadges: ProjectBadge[] = ["Case", "Shot", "Research", "WIP"];
  const invalidBadges = PROJECTS.filter(p => !allowedBadges.includes(p.badge)).map(p => `${p.id}: ${p.badge}`);
  assert(
    suiteData,
    "All project badges strictly conform to taxonomy ('Case' | 'Shot' | 'Research' | 'WIP')",
    invalidBadges.length === 0,
    invalidBadges.length === 0 ? `All badges valid: ${Array.from(new Set(PROJECTS.map(p => p.badge))).join(", ")}` : `Invalid badges: ${invalidBadges.join(", ")}`
  );
}

// Non-empty Fields (Title, Subtitle, Description, Category, Tags, Year)
{
  const emptyFields: string[] = [];
  for (const p of PROJECTS) {
    if (!p.title || p.title.trim().length === 0) emptyFields.push(`${p.id}.title`);
    if (!p.subtitle || p.subtitle.trim().length === 0) emptyFields.push(`${p.id}.subtitle`);
    if (!p.description || p.description.trim().length === 0) emptyFields.push(`${p.id}.description`);
    if (!p.category || p.category.trim().length === 0) emptyFields.push(`${p.id}.category`);
    if (!Array.isArray(p.tags) || p.tags.length === 0) emptyFields.push(`${p.id}.tags`);
    if (typeof p.year !== "number" || p.year < 2000 || p.year > 2030) emptyFields.push(`${p.id}.year`);
  }
  assert(
    suiteData,
    "All projects have non-empty titles, subtitles, descriptions, categories, tags, and valid years",
    emptyFields.length === 0,
    emptyFields.length === 0 ? "All required text fields populated" : `Empty/invalid fields: ${emptyFields.join(", ")}`
  );
}

// Cover Image Data URI & SVG Structure Validation
{
  const invalidCovers: string[] = [];
  for (const p of PROJECTS) {
    const cover = p.coverImage;
    if (!cover.startsWith("data:image/svg+xml;utf8,")) {
      invalidCovers.push(`${p.id}: Missing SVG data URI header`);
      continue;
    }
    const encodedSvg = cover.slice("data:image/svg+xml;utf8,".length);
    const decodedSvg = decodeURIComponent(encodedSvg);

    // Verify well-formed SVG markers
    if (!decodedSvg.includes("<svg") || !decodedSvg.includes("</svg>")) {
      invalidCovers.push(`${p.id}: Missing root <svg> tags`);
    }
    if (!decodedSvg.includes('viewBox="0 0 1280 720"')) {
      invalidCovers.push(`${p.id}: Missing standard 1280x720 viewBox`);
    }
  }
  assert(
    suiteData,
    "All projects have valid, well-formed SVG data-URI cover images with correct viewBox",
    invalidCovers.length === 0,
    invalidCovers.length === 0 ? `All ${PROJECTS.length} cover images valid SVG data URIs` : `Invalid covers: ${invalidCovers.join(", ")}`
  );
}

// Project Stats Validation
{
  const invalidStats: string[] = [];
  for (const p of PROJECTS) {
    if (p.stats) {
      if (!Array.isArray(p.stats) || p.stats.length === 0) {
        invalidStats.push(`${p.id}: Empty stats array`);
      }
      for (const stat of p.stats) {
        if (!stat.label || stat.label.trim().length === 0 || !stat.value || stat.value.trim().length === 0) {
          invalidStats.push(`${p.id}: Malformed stat item (${stat.label}:${stat.value})`);
        }
      }
    }
  }
  assert(
    suiteData,
    "All project stats items (when present) contain non-empty label and value",
    invalidStats.length === 0,
    invalidStats.length === 0 ? "All project stats valid" : `Invalid stats: ${invalidStats.join(", ")}`
  );
}

// -----------------------------------------------------------------------------
// SUMMARY & REPORTING
// -----------------------------------------------------------------------------
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
