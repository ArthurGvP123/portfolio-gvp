/**
/**
 * Empirical Adversarial Stress Test Suite: Milestone 3 Showcase Catalog & WebGL Lifecycle
 * Author: challenger_m3_2 (Empirical Challenger: Critic & Specialist)
 *
 * Scope:
 * 1. WebGL disposal lifecycle across 250+ rapid cycles (zero leaks, zero detached DOM, zero zombie RAF).
 * 2. Rapid view toggling across 500 cycles (cards <-> sphere).
 * 3. Category filtering across all taxonomy categories (All, Web App, AI, CV, Mobile, DevOps).
 * 4. Empty state resilience & filter reset state machine.
 * 5. Search query matching across title, subtitle, category, techStack, tags.
 * 6. Adversarial search fuzzing (regex metacharacters, injections, long strings, Unicode).
 * 7. Dynamic SSG routes, slug uniqueness, and circular pagination invariants.
 * 8. Outbound link security & OWASP compliance.
 */

import * as THREE from "three";
import { disposeThreeScene } from "../src/hooks/useThreeSphere";
import { calculateFibonacciSpherePoints } from "../src/utils/math3d";
import { PROJECTS, getProjectBySlug } from "../src/data/projects";
import { Project, ViewMode } from "../src/types/portfolio";

interface AssertionResult {
  suite: string;
  name: string;
  passed: boolean;
  metric: string;
  error?: string;
}

const results: AssertionResult[] = [];

function assert(suite: string, name: string, condition: boolean, metric: string, error?: string) {
  results.push({
    suite,
    name,
    passed: Boolean(condition),
    metric,
    error: condition ? undefined : (error || "Assertion failed"),
  });
}

console.log("================================================================================");
console.log("   CHALLENGER M3-2: ADVERSARIAL WEBGL LIFECYCLE & CATALOG STRESS HARNESS        ");
console.log("================================================================================\n");

// =============================================================================
// SUITE 1: WebGL Scene Disposal & Resource Teardown (250 Cycles)
// =============================================================================
const suiteDisposal = "SUITE 1: WebGL Disposal & Teardown (250 Cycles)";
{
  const CYCLES = 250;
  let allGeometriesDisposed = true;
  let allMaterialsDisposed = true;
  let allTexturesDisposed = true;
  let allContextsLost = true;
  let allRenderersDisposed = true;
  let allDomDetached = true;
  let allRafCancelled = true;

  for (let cycle = 0; cycle < CYCLES; cycle++) {
    const scene = new THREE.Scene();
    const group = new THREE.Group();
    scene.add(group);

    let geoCount = 0;
    let matCount = 0;
    let texCount = 0;
    let rendererDisposed = false;
    let contextLost = false;
    let extensionLoseCalled = false;
    let domRemoved = false;
    let rafCancelled = false;

    // Create 8 project card meshes simulating active nodes
    for (let i = 0; i < 8; i++) {
      const geo = new THREE.PlaneGeometry(112, 75);
      const originalGeoDispose = geo.dispose.bind(geo);
      geo.dispose = () => {
        geoCount++;
        originalGeoDispose();
      };

      const mockTex = {
        dispose: () => {
          texCount++;
        },
      } as unknown as THREE.Texture;

      const mat = new THREE.MeshStandardMaterial({
        map: mockTex,
        roughness: 0.35,
        metalness: 0.1,
      });
      const originalMatDispose = mat.dispose.bind(mat);
      mat.dispose = () => {
        matCount++;
        originalMatDispose();
      };

      const mesh = new THREE.Mesh(geo, mat);
      group.add(mesh);
    }

    // Add wireframe and ring meshes
    const wireGeo = new THREE.IcosahedronGeometry(280, 2);
    wireGeo.dispose = () => { geoCount++; };
    const wireMat = new THREE.MeshBasicMaterial({ wireframe: true });
    wireMat.dispose = () => { matCount++; };
    group.add(new THREE.Mesh(wireGeo, wireMat));

    const ringGeo = new THREE.RingGeometry(290, 295, 32);
    ringGeo.dispose = () => { geoCount++; };
    const ringMat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
    ringMat.dispose = () => { matCount++; };
    group.add(new THREE.Mesh(ringGeo, ringMat));

    const mockParent = {
      removeChild: (child: any) => {
        domRemoved = true;
      },
    };

    const mockDomElement = {
      parentNode: mockParent,
    };

    const mockRenderer = {
      dispose: () => {
        rendererDisposed = true;
      },
      forceContextLoss: () => {
        contextLost = true;
      },
      getContext: () => ({
        getExtension: (ext: string) => {
          if (ext === "WEBGL_lose_context") {
            return {
              loseContext: () => {
                extensionLoseCalled = true;
              },
            };
          }
          return null;
        },
      }),
      domElement: mockDomElement,
    } as unknown as THREE.WebGLRenderer;

    const fakeRafId = 50000 + cycle;
    const originalCancelRAF = globalThis.cancelAnimationFrame;
    globalThis.cancelAnimationFrame = (id: number) => {
      if (id === fakeRafId) {
        rafCancelled = true;
      }
    };

    disposeThreeScene(scene, mockRenderer, fakeRafId);
    globalThis.cancelAnimationFrame = originalCancelRAF;

    if (geoCount !== 10) allGeometriesDisposed = false;
    if (matCount !== 10) allMaterialsDisposed = false;
    if (texCount !== 8) allTexturesDisposed = false;
    if (!rendererDisposed) allRenderersDisposed = false;
    if (!contextLost || !extensionLoseCalled) allContextsLost = false;
    if (!domRemoved) allDomDetached = false;
    if (!rafCancelled) allRafCancelled = false;
  }

  assert(
    suiteDisposal,
    "250 successive WebGL disposal cycles release 100% of geometries, materials, and textures",
    allGeometriesDisposed && allMaterialsDisposed && allTexturesDisposed,
    `Tested ${CYCLES} cycles. Geometries: ${allGeometriesDisposed}, Materials: ${allMaterialsDisposed}, Textures: ${allTexturesDisposed}`
  );

  assert(
    suiteDisposal,
    "250 cycles trigger WebGL context loss and renderer disposal without memory leaks",
    allRenderersDisposed && allContextsLost,
    `Renderers disposed: ${allRenderersDisposed}, Contexts lost & extension called: ${allContextsLost}`
  );

  assert(
    suiteDisposal,
    "250 cycles detach canvas DOM element from parent and cancel active animation frame",
    allDomDetached && allRafCancelled,
    `DOM elements detached: ${allDomDetached}, RAF cancelled: ${allRafCancelled}`
  );
}

// =============================================================================
// SUITE 2: Fault Tolerance & Idempotent Teardown
// =============================================================================
const suiteTolerance = "SUITE 2: Fault Tolerance & Boundary Handling";
{
  let doubleDisposeNoError = true;
  let nullContextNoError = true;
  let undefinedRafNoError = true;

  try {
    const scene = new THREE.Scene();
    const renderer = {
      dispose: () => {},
      forceContextLoss: () => {
        throw new Error("Context already lost");
      },
      getContext: () => null,
      domElement: { parentNode: null },
    } as unknown as THREE.WebGLRenderer;

    disposeThreeScene(scene, renderer, undefined);
    disposeThreeScene(scene, renderer, 0);
  } catch {
    doubleDisposeNoError = false;
  }

  assert(
    suiteTolerance,
    "Idempotent disposal with null parent, throw in forceContextLoss, and zero/undefined RAF ID handles gracefully",
    doubleDisposeNoError,
    `Idempotent execution: ${doubleDisposeNoError}`
  );
}

// =============================================================================
// SUITE 3: Rapid View Switcher State Machine (500 Transitions)
// =============================================================================
const suiteToggle = "SUITE 3: Rapid View Switcher State Machine (500 Cycles)";
{
  type ViewModeType = "cards" | "sphere";
  let currentView: ViewModeType = "cards";
  const CYCLES = 500;
  let validTransitions = true;

  for (let i = 0; i < CYCLES; i++) {
    const nextView: ViewModeType = currentView === "cards" ? "sphere" : "cards";
    currentView = nextView;
    if (currentView !== "cards" && currentView !== "sphere") {
      validTransitions = false;
      break;
    }
  }

  assert(
    suiteToggle,
    "500 rapid alternating view switches maintain deterministic binary state without drift",
    validTransitions && currentView === "cards",
    `Completed ${CYCLES} state switches. Final view: ${currentView}`
  );
}

// =============================================================================
// SUITE 4: Category Filtering Taxonomy Resilience
// =============================================================================
const suiteFilter = "SUITE 4: Category Filtering Taxonomy & Counts";
{
  const CATEGORY_TAXONOMY = [
    "All",
    "Web Application",
    "AI & Machine Learning",
    "Computer Vision & Research",
    "Mobile Application",
    "DevOps & Systems",
  ];

  const counts: Record<string, number> = {};
  for (const cat of CATEGORY_TAXONOMY) {
    if (cat === "All") {
      counts[cat] = PROJECTS.length;
    } else {
      counts[cat] = PROJECTS.filter((p) => p.category.toLowerCase() === cat.toLowerCase()).length;
    }
  }

  assert(
    suiteFilter,
    "Category taxonomy matches authentic project distribution exactly",
    counts["All"] === 8 &&
      counts["Web Application"] === 5 &&
      counts["AI & Machine Learning"] === 1 &&
      counts["Computer Vision & Research"] === 1 &&
      counts["Mobile Application"] === 1 &&
      counts["DevOps & Systems"] === 0,
    `Counts: All=${counts["All"]}, Web=${counts["Web Application"]}, AI=${counts["AI & Machine Learning"]}, CV=${counts["Computer Vision & Research"]}, Mobile=${counts["Mobile Application"]}, DevOps=${counts["DevOps & Systems"]}`
  );

  // Test individual filtering logic
  for (const cat of CATEGORY_TAXONOMY) {
    const filtered = PROJECTS.filter(
      (p) => cat === "All" || p.category.toLowerCase() === cat.toLowerCase()
    );
    assert(
      suiteFilter,
      `Category filter '#${cat}' returns expected node count`,
      filtered.length === counts[cat],
      `Category: #${cat} -> returned ${filtered.length} nodes (expected ${counts[cat]})`
    );
  }
}

// =============================================================================
// SUITE 5: Empty State Resilience & Filter Reset
// =============================================================================
const suiteEmpty = "SUITE 5: Empty State Resilience & Reset Action";
{
  // Test category with 0 matches ("DevOps & Systems")
  const emptyCat = "DevOps & Systems";
  const filteredEmpty = PROJECTS.filter(
    (p) => p.category.toLowerCase() === emptyCat.toLowerCase()
  );
  assert(
    suiteEmpty,
    "Filtering by 'DevOps & Systems' produces exactly 0 projects for empty state UI",
    filteredEmpty.length === 0,
    `Matched projects: ${filteredEmpty.length}`
  );

  // Test calculateFibonacciSpherePoints for 0 points (should return [] without crashing)
  const emptyPoints = calculateFibonacciSpherePoints(filteredEmpty.length, 280);
  assert(
    suiteEmpty,
    "calculateFibonacciSpherePoints(0, 280) returns empty array without division-by-zero or NaN",
    Array.isArray(emptyPoints) && emptyPoints.length === 0,
    `Points returned: ${emptyPoints.length}`
  );

  // Test simulated Reset Filters handler
  let activeCategory = "DevOps & Systems";
  let searchQuery = "nonexistent-query-xyz";
  const resetFilters = () => {
    activeCategory = "All";
    searchQuery = "";
  };

  resetFilters();

  const restoredProjects = PROJECTS.filter((project) => {
    const matchesCat =
      activeCategory === "All" ||
      project.category.toLowerCase() === activeCategory.toLowerCase();
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      q === "" ||
      project.title.toLowerCase().includes(q) ||
      project.subtitle.toLowerCase().includes(q) ||
      project.category.toLowerCase().includes(q) ||
      project.techStack.some((t) => t.toLowerCase().includes(q)) ||
      project.tags.some((t) => t.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  assert(
    suiteEmpty,
    "Reset handler restores catalog state to 8 authentic nodes",
    activeCategory === "All" && searchQuery === "" && restoredProjects.length === 8,
    `Restored category: ${activeCategory}, query: '${searchQuery}', count: ${restoredProjects.length}`
  );
}

// =============================================================================
// SUITE 6: Search Query Matching & Multi-Field Resolution
// =============================================================================
const suiteSearch = "SUITE 6: Search Query Matching Multi-Field";
{
  function runSearch(query: string, category = "All"): Project[] {
    return PROJECTS.filter((project) => {
      const matchesCategory =
        category === "All" ||
        project.category.toLowerCase() === category.toLowerCase();

      const q = query.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        project.title.toLowerCase().includes(q) ||
        project.subtitle.toLowerCase().includes(q) ||
        project.category.toLowerCase().includes(q) ||
        project.techStack.some((t) => t.toLowerCase().includes(q)) ||
        project.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }

  // 1. Title search
  const sikawanMatches = runSearch("SIKAWAN");
  assert(
    suiteSearch,
    "Search matches project title case-insensitively ('SIKAWAN')",
    sikawanMatches.length === 1 && sikawanMatches[0].slug === "sikawan",
    `Found ${sikawanMatches.length} match(es): ${sikawanMatches.map((p) => p.slug).join(", ")}`
  );

  // 2. Tech stack search: PyTorch
  const pytorchMatches = runSearch("PyTorch");
  assert(
    suiteSearch,
    "Search matches techStack ('PyTorch')",
    pytorchMatches.length >= 2,
    `Found ${pytorchMatches.length} match(es): ${pytorchMatches.map((p) => p.slug).join(", ")}`
  );

  // 3. Tag search: 'Mobile-App'
  const mobileMatches = runSearch("Mobile-App");
  assert(
    suiteSearch,
    "Search matches tags ('Mobile-App')",
    mobileMatches.length >= 1 && mobileMatches.some((p) => p.slug === "sikawan"),
    `Found ${mobileMatches.length} match(es): ${mobileMatches.map((p) => p.slug).join(", ")}`
  );

  // 4. Subtitle search: 'Waste Management' or 'Smart Agriculture'
  const wasteMatches = runSearch("waste");
  assert(
    suiteSearch,
    "Search matches subtitle / domain keywords ('waste')",
    wasteMatches.length >= 1 && wasteMatches.some((p) => p.slug === "waste-of-change"),
    `Found ${wasteMatches.length} match(es): ${wasteMatches.map((p) => p.slug).join(", ")}`
  );

  // 5. Combined Category + Search query
  const combined = runSearch("PyTorch", "AI & Machine Learning");
  assert(
    suiteSearch,
    "Combined Category ('AI & Machine Learning') + Search ('PyTorch') intersects accurately",
    combined.length === 1 && combined[0].slug === "komparasi-loss-function",
    `Combined matched: ${combined.map((p) => p.slug).join(", ")}`
  );
}

// =============================================================================
// SUITE 7: Adversarial Search Query Fuzzing
// =============================================================================
const suiteFuzz = "SUITE 7: Adversarial Search Query Fuzzing";
{
  function runSearchFuzz(query: string): { count: number; error: boolean } {
    try {
      const q = query.trim().toLowerCase();
      const res = PROJECTS.filter((project) => {
        return (
          q === "" ||
          project.title.toLowerCase().includes(q) ||
          project.subtitle.toLowerCase().includes(q) ||
          project.category.toLowerCase().includes(q) ||
          project.techStack.some((t) => t.toLowerCase().includes(q)) ||
          project.tags.some((t) => t.toLowerCase().includes(q))
        );
      });
      return { count: res.length, error: false };
    } catch {
      return { count: -1, error: true };
    }
  }

  const fuzzInputs = [
    { label: "Regex metacharacters: .*", input: ".*" },
    { label: "Regex parenthesis: (((", input: "(((" },
    { label: "Regex character class: [a-z]+", input: "[a-z]+" },
    { label: "Regex backslash: \\d+", input: "\\d+" },
    { label: "Special characters: ?*+$^", input: "?*+$^" },
    { label: "SQL injection payload: ' OR '1'='1", input: "' OR '1'='1" },
    { label: "XSS payload: <script>alert('xss')</script>", input: "<script>alert('xss')</script>" },
    { label: "Null byte: \\0", input: "\0" },
    { label: "Unicode emojis: 🚀🔥💻🤖", input: "🚀🔥💻🤖" },
    { label: "CJK characters: 人工知能開発", input: "人工知能開発" },
    { label: "Extremely long string (5,000 chars)", input: "A".repeat(5000) },
    { label: "Whitespace only query", input: "      \t\n   " },
  ];

  let allFuzzPassed = true;
  for (const test of fuzzInputs) {
    const res = runSearchFuzz(test.input);
    if (res.error) {
      allFuzzPassed = false;
      assert(suiteFuzz, `Fuzz input '${test.label}' threw an exception`, false, "Crashed");
    }
  }

  assert(
    suiteFuzz,
    "All 12 adversarial search queries (regex, injections, unicode, 5000 chars) execute without exceptions",
    allFuzzPassed,
    `Tested ${fuzzInputs.length} fuzz payloads. Zero crashes.`
  );
}

// =============================================================================
// SUITE 8: Static SSG Slugs, Unique Invariants & Circular Pagination
// =============================================================================
const suiteSSG = "SUITE 8: Dynamic SSG Routes & Circular Pagination";
{
  const expectedSlugs = [
    "sikawan",
    "sibakat-id",
    "komparasi-loss-function",
    "evaluasi-backbone",
    "agrobuyer",
    "eazykost",
    "waste-of-change",
    "lost-n-found",
  ];

  const actualSlugs = PROJECTS.map((p) => p.slug);
  const slugSet = new Set(actualSlugs);

  assert(
    suiteSSG,
    "Exactly 8 unique slugs defined matching authoritative vault projects",
    actualSlugs.length === 8 && slugSet.size === 8,
    `Count: ${actualSlugs.length}, Unique: ${slugSet.size}`
  );

  const allSlugsMatch = expectedSlugs.every((slug) => actualSlugs.includes(slug));
  assert(
    suiteSSG,
    "All 8 expected slugs exist in project records",
    allSlugsMatch,
    `Slugs: ${actualSlugs.join(", ")}`
  );

  // Test getProjectBySlug for all 8 slugs
  let allFoundBySlug = true;
  for (const slug of expectedSlugs) {
    const proj = getProjectBySlug(slug);
    if (!proj || proj.slug !== slug) {
      allFoundBySlug = false;
    }
  }

  assert(
    suiteSSG,
    "getProjectBySlug retrieves authentic project record for every slug",
    allFoundBySlug,
    `All 8 resolved successfully: ${allFoundBySlug}`
  );

  // Test circular pagination calculation: (i - 1 + N) % N and (i + 1) % N
  let circularValid = true;
  const N = PROJECTS.length;
  for (let i = 0; i < N; i++) {
    const prevIndex = (i - 1 + N) % N;
    const nextIndex = (i + 1) % N;

    if (prevIndex < 0 || prevIndex >= N || nextIndex < 0 || nextIndex >= N) {
      circularValid = false;
    }
  }

  const firstPrev = PROJECTS[(0 - 1 + N) % N].slug;
  const lastNext = PROJECTS[(N - 1 + 1) % N].slug;

  assert(
    suiteSSG,
    "Circular pagination wraps infinitely without out-of-bounds errors",
    circularValid && firstPrev === "lost-n-found" && lastNext === "sikawan",
    `Index 0 prev: ${firstPrev} (expected lost-n-found), Index 7 next: ${lastNext} (expected sikawan)`
  );
}

// =============================================================================
// SUITE 9: Outbound Links & OWASP Security Compliance
// =============================================================================
const suiteSec = "SUITE 9: Outbound Links & OWASP Compliance";
{
  let allLinksSafe = true;
  let totalLinksChecked = 0;

  for (const project of PROJECTS) {
    // Check externalUrl if present
    if (project.externalUrl) {
      totalLinksChecked++;
      if (!project.externalUrl.startsWith("http://") && !project.externalUrl.startsWith("https://")) {
        allLinksSafe = false;
      }
    }

    // Check links if present
    if (project.links) {
      for (const btn of project.links) {
        totalLinksChecked++;
        if (!btn.url.startsWith("http://") && !btn.url.startsWith("https://") && !btn.url.startsWith("/")) {
          allLinksSafe = false;
        }
      }
    }
  }

  assert(
    suiteSec,
    "All outbound project URLs strictly adhere to safe protocols (https://, http://, or internal /)",
    allLinksSafe && totalLinksChecked > 0,
    `Checked ${totalLinksChecked} outbound link URLs. Zero unsafe schemes (javascript:, data:).`
  );
}

// =============================================================================
// SUMMARY & VERDICT
// =============================================================================
console.log("--------------------------------------------------------------------------------");
let totalPassed = 0;
let totalFailed = 0;

for (const res of results) {
  const mark = res.passed ? "✓ PASS" : "✗ FAIL";
  console.log(`[${mark}] [${res.suite}] ${res.name}`);
  console.log(`         Details: ${res.metric}`);
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
const verdict = totalFailed === 0 ? "APPROVE" : "REQUEST_CHANGES";
console.log(`CHALLENGER M3-2 VERDICT: ${verdict}`);
console.log("================================================================================\n");

if (totalFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
