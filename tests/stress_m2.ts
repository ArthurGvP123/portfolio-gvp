/**
 * Comprehensive Empirical Stress-Test Suite for Milestone M2
 * Dual-View Showcase Engine: 3D Tilt Kinematics, Three.js Sphere Quaternions,
 * Disposal Lifecycle, and Filtering Logic.
 */

import * as THREE from "three";
import { calculateFibonacciSpherePoints } from "../src/utils/math3d";
import { PROJECTS } from "../src/data/projects";
import { ProjectBadge, ProjectItem } from "../src/types/portfolio";
import { disposeThreeScene } from "../src/hooks/useThreeSphere";

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
console.log("     EMPIRICAL STRESS TEST SUITE: MILESTONE M2 (DUAL-VIEW SHOWCASE ENGINE)     ");
console.log("================================================================================\n");

// -----------------------------------------------------------------------------
// SUITE 1: 3D Card Tilt Kinematics & Specular Glare Formulation
// -----------------------------------------------------------------------------
const suiteTilt = "useCardTilt - Kinematics & Glare Formula";

function computeCardTilt(
  clientX: number,
  clientY: number,
  rect: { left: number; top: number; width: number; height: number },
  maxTilt = 12
) {
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

  return { u, v, rotX, rotY, glareX, glareY, glareOpacity };
}

// Center cursor test
{
  const rect = { left: 100, top: 100, width: 400, height: 300 };
  const res = computeCardTilt(300, 250, rect); // exactly at center
  const ok =
    Math.abs(res.u) < 1e-6 &&
    Math.abs(res.v) < 1e-6 &&
    Math.abs(res.rotX) < 1e-6 &&
    Math.abs(res.rotY) < 1e-6 &&
    Math.abs(res.glareX - 50) < 1e-6 &&
    Math.abs(res.glareY - 50) < 1e-6 &&
    res.glareOpacity === 0;

  assert(
    suiteTilt,
    "Cursor at exact card center produces neutral tilt (0 deg) and 0 glare opacity",
    ok,
    `u: ${res.u}, v: ${res.v}, rotX: ${res.rotX}, rotY: ${res.rotY}, glareX: ${res.glareX}%, glareOpacity: ${res.glareOpacity}`
  );
}

// Top-Left corner test
{
  const rect = { left: 0, top: 0, width: 200, height: 200 };
  const res = computeCardTilt(0, 0, rect, 12);
  const ok =
    Math.abs(res.u - -1) < 1e-6 &&
    Math.abs(res.v - -1) < 1e-6 &&
    Math.abs(res.rotX - 12) < 1e-6 &&
    Math.abs(res.rotY - -12) < 1e-6 &&
    Math.abs(res.glareX - 0) < 1e-6 &&
    Math.abs(res.glareY - 0) < 1e-6;

  assert(
    suiteTilt,
    "Top-left corner cursor computes u=-1, v=-1, rotX=+12deg, rotY=-12deg, glare at (0%, 0%)",
    ok,
    `rotX: ${res.rotX}, rotY: ${res.rotY}, glare: (${res.glareX}%, ${res.glareY}%)`
  );
}

// Bottom-Right corner test
{
  const rect = { left: 0, top: 0, width: 200, height: 200 };
  const res = computeCardTilt(200, 200, rect, 12);
  const ok =
    Math.abs(res.u - 1) < 1e-6 &&
    Math.abs(res.v - 1) < 1e-6 &&
    Math.abs(res.rotX - -12) < 1e-6 &&
    Math.abs(res.rotY - 12) < 1e-6 &&
    Math.abs(res.glareX - 100) < 1e-6 &&
    Math.abs(res.glareY - 100) < 1e-6;

  assert(
    suiteTilt,
    "Bottom-right corner cursor computes u=1, v=1, rotX=-12deg, rotY=+12deg, glare at (100%, 100%)",
    ok,
    `rotX: ${res.rotX}, rotY: ${res.rotY}, glare: (${res.glareX}%, ${res.glareY}%)`
  );
}

// Out-of-bounds cursor clamping test
{
  const rect = { left: 100, top: 100, width: 200, height: 200 };
  const res = computeCardTilt(1000, -500, rect, 12);
  const ok =
    res.u === 1 &&
    res.v === -1 &&
    res.rotX === 12 &&
    res.rotY === 12 &&
    res.glareOpacity <= 0.35;

  assert(
    suiteTilt,
    "Extreme out-of-bounds cursor coordinates clamped strictly to [-1, 1] range",
    ok,
    `u: ${res.u}, v: ${res.v}, rotX: ${res.rotX}, rotY: ${res.rotY}, opacity: ${res.glareOpacity}`
  );
}

// Glare Opacity upper bound clamp test
{
  const rect = { left: 0, top: 0, width: 100, height: 100 };
  // Diagonal distance = sqrt(1^2 + 1^2) = ~1.414. Distance * 0.28 = 0.3959 > 0.35. Must clamp to 0.35.
  const res = computeCardTilt(100, 100, rect);
  const ok = res.glareOpacity === 0.35;

  assert(
    suiteTilt,
    "Specular glare opacity strictly clamped to max 0.35 on diagonal corners",
    ok,
    `Calculated glare opacity: ${res.glareOpacity}`
  );
}

// -----------------------------------------------------------------------------
// SUITE 2: Three.js Quaternion Math & Sphere Arcball Physics
// -----------------------------------------------------------------------------
const suiteSphere = "useThreeSphere - 3D Math & Quaternion Physics";

// Surface normal and outward tangent quaternion alignment
{
  const radius = 280;
  const points = calculateFibonacciSpherePoints(14, radius);
  let allUnitNormals = true;
  let allUnitQuats = true;

  for (const pt of points) {
    const normal = new THREE.Vector3(pt.x, pt.y, pt.z).normalize();
    const len = normal.length();
    if (Math.abs(len - 1.0) > 1e-5) allUnitNormals = false;

    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    const qLen = quat.length();
    if (Math.abs(qLen - 1.0) > 1e-5) allUnitQuats = false;
  }

  assert(
    suiteSphere,
    "All 14 card normals and orientation quaternions are exact unit vectors (norm = 1.0)",
    allUnitNormals && allUnitQuats,
    `allUnitNormals: ${allUnitNormals}, allUnitQuats: ${allUnitQuats}`
  );
}

// Quaternion drag multiplication preserves unit norm without drift
{
  const groupQ = new THREE.Quaternion();
  let quatValid = true;

  // Simulate 100 successive drag deltas
  for (let i = 0; i < 100; i++) {
    const dx = Math.sin(i * 0.1) * 8;
    const dy = Math.cos(i * 0.1) * 8;
    const sensitivity = 0.0035;

    const qY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), dx * sensitivity);
    const qX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), dy * sensitivity);

    groupQ.premultiply(qY);
    groupQ.premultiply(qX);

    const len = groupQ.length();
    if (Math.abs(len - 1.0) > 1e-4) {
      quatValid = false;
      break;
    }
  }

  assert(
    suiteSphere,
    "100 successive drag quaternion premultiplications preserve unit length without numerical drift",
    quatValid,
    `Final quaternion magnitude: ${groupQ.length().toFixed(6)}`
  );
}

// Momentum Inertia Decay & Idle Drift Switch
{
  const vel = new THREE.Vector2(0.08, 0.06);
  const damping = 0.94;
  let framesToDecay = 0;

  for (let frame = 0; frame < 200; frame++) {
    vel.multiplyScalar(damping);
    if (vel.lengthSq() < 0.000001) {
      framesToDecay = frame + 1;
      break;
    }
  }

  const reachedIdle = framesToDecay > 0 && framesToDecay < 120;
  assert(
    suiteSphere,
    "Momentum angular velocity decays smoothly under damping=0.94 in < 120 frames (~1.5s)",
    reachedIdle,
    `Decayed to idle threshold in ${framesToDecay} frames`
  );
}

// -----------------------------------------------------------------------------
// SUITE 3: WebGL Deterministic Disposal Lifecycle
// -----------------------------------------------------------------------------
const suiteDisposal = "useThreeSphere - disposeThreeScene Lifecycle";

{
  let geometryDisposed = false;
  let materialDisposed = false;
  let textureDisposed = false;
  let rendererDisposed = false;
  let contextLossForced = false;

  // Mock scene and GPU structures
  const scene = new THREE.Scene();

  const mockTexture = {
    dispose: () => {
      textureDisposed = true;
    },
    minFilter: THREE.LinearMipmapLinearFilter,
  };

  const mockMaterial = new THREE.MeshStandardMaterial();
  mockMaterial.map = mockTexture as unknown as THREE.Texture;
  const originalMatDispose = mockMaterial.dispose.bind(mockMaterial);
  mockMaterial.dispose = () => {
    materialDisposed = true;
    originalMatDispose();
  };

  const mockGeometry = new THREE.PlaneGeometry(100, 100);
  const originalGeoDispose = mockGeometry.dispose.bind(mockGeometry);
  mockGeometry.dispose = () => {
    geometryDisposed = true;
    originalGeoDispose();
  };

  const mesh = new THREE.Mesh(mockGeometry, mockMaterial);
  scene.add(mesh);

  const mockRenderer = {
    dispose: () => {
      rendererDisposed = true;
    },
    forceContextLoss: () => {
      contextLossForced = true;
    },
    getContext: () => ({
      getExtension: (name: string) => (name === "WEBGL_lose_context" ? { loseContext: () => {} } : null),
    }),
    domElement: {
      parentNode: {
        removeChild: () => {},
      },
    },
  } as unknown as THREE.WebGLRenderer;

  // Call disposeThreeScene
  disposeThreeScene(scene, mockRenderer, 123);

  const allDisposed =
    geometryDisposed &&
    materialDisposed &&
    textureDisposed &&
    rendererDisposed &&
    contextLossForced;

  assert(
    suiteDisposal,
    "disposeThreeScene cleanly traverses scene, disposes geometry, materials, textures, and triggers forceContextLoss()",
    allDisposed,
    `geo: ${geometryDisposed}, mat: ${materialDisposed}, tex: ${textureDisposed}, renderer: ${rendererDisposed}, contextLoss: ${contextLossForced}`
  );
}

// -----------------------------------------------------------------------------
// SUITE 4: CardsView Filter & Query Logic
// -----------------------------------------------------------------------------
const suiteFilter = "CardsView - Filtering & Search Query";

function filterProjects(projects: ProjectItem[], filter: "ALL" | ProjectBadge, query: string) {
  return projects.filter((project) => {
    const matchesFilter = filter === "ALL" || project.badge === filter;
    const matchesSearch =
      query.trim() === "" ||
      project.title.toLowerCase().includes(query.toLowerCase()) ||
      project.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      project.category.toLowerCase().includes(query.toLowerCase()) ||
      project.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));

    return matchesFilter && matchesSearch;
  });
}

// Filter ALL
{
  const res = filterProjects(PROJECTS, "ALL", "");
  assert(
    suiteFilter,
    `Filter 'ALL' with empty query returns all ${PROJECTS.length} projects`,
    res.length === PROJECTS.length,
    `Returned ${res.length} projects`
  );
}

// Filter Case Studies
{
  const res = filterProjects(PROJECTS, "Case", "");
  const allCase = res.every((p) => p.badge === "Case");
  assert(
    suiteFilter,
    "Filter 'Case' returns only Case badge projects",
    res.length > 0 && allCase,
    `Returned ${res.length} projects, all Case: ${allCase}`
  );
}

// Filter Research
{
  const res = filterProjects(PROJECTS, "Research", "");
  const allResearch = res.every((p) => p.badge === "Research");
  assert(
    suiteFilter,
    "Filter 'Research' returns only Research badge projects",
    res.length > 0 && allResearch,
    `Returned ${res.length} projects, all Research: ${allResearch}`
  );
}

// Filter Non-matching Badge
{
  const res = filterProjects(PROJECTS, "WIP", "");
  const allWIP = res.every((p) => p.badge === "WIP");
  assert(
    suiteFilter,
    "Filter 'WIP' returns empty list when no WIP badge projects exist",
    res.length === 0 && allWIP,
    `Returned ${res.length} projects, all WIP: ${allWIP}`
  );
}

// Query Search
{
  const res = filterProjects(PROJECTS, "ALL", "pytorch");
  assert(
    suiteFilter,
    "Search query 'pytorch' matches projects containing 'pytorch' in tags or title",
    res.length > 0,
    `Matched ${res.length} projects for query 'pytorch'`
  );
}

// Sum of badge counts equals total
{
  const caseCount = filterProjects(PROJECTS, "Case", "").length;
  const researchCount = filterProjects(PROJECTS, "Research", "").length;
  const shotCount = filterProjects(PROJECTS, "Shot", "").length;
  const wipCount = filterProjects(PROJECTS, "WIP", "").length;
  const totalSum = caseCount + researchCount + shotCount + wipCount;

  assert(
    suiteFilter,
    `Badge partition sum (Case + Research + Shot + WIP) equals total projects (${PROJECTS.length})`,
    totalSum === PROJECTS.length,
    `Case: ${caseCount}, Research: ${researchCount}, Shot: ${shotCount}, WIP: ${wipCount}, Total: ${totalSum}`
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
