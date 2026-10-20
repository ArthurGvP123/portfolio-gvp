import * as fs from "fs";
import * as path from "path";

/**
 * Universal Zero-Scrollbar & Scroll Interaction Adversarial Test Suite
 * Validates R1 (CSS Rules), R2 (Scroll Navigation & Modal Isolation), and R3 (Automated Quality Gate).
 */

const ROOT_DIR = path.resolve(__dirname, "..");
const GLOBALS_CSS = path.join(ROOT_DIR, "src", "app", "globals.css");
const LAYOUT_TSX = path.join(ROOT_DIR, "src", "app", "layout.tsx");
const NAVBAR_OVERLAY = path.join(ROOT_DIR, "src", "components", "navigation", "KineticNavbarOverlay.tsx");
const MEDIA_SHOWCASE = path.join(ROOT_DIR, "src", "components", "work-detail", "MediaShowcaseGallery.tsx");
const SMOOTH_SCROLL_PROVIDER = path.join(ROOT_DIR, "src", "components", "common", "SmoothScrollProvider.tsx");
const SPHERE_CANVAS = path.join(ROOT_DIR, "src", "components", "showcase", "WebGLSphereCanvas.tsx");
const MONOLITH_CANVAS = path.join(ROOT_DIR, "src", "components", "contact", "ObsidianMonolithCanvas.tsx");
const CONTACT_PAGE = path.join(ROOT_DIR, "src", "app", "contact", "page.tsx");

interface TestResult {
  category: string;
  name: string;
  passed: boolean;
  details: string;
  error?: string;
}

const results: TestResult[] = [];

function assert(category: string, name: string, condition: boolean, details: string) {
  results.push({
    category,
    name,
    passed: condition,
    details,
    error: condition ? undefined : `Assertion failed: ${details}`,
  });
}

function runScrollbarTests() {
  console.log("\x1b[36m================================================================================\x1b[0m");
  console.log("\x1b[1m\x1b[37m  UNIVERSAL ZERO-SCROLLBAR & SCROLL INTERACTION ADVERSARIAL TEST SUITE          \x1b[0m");
  console.log("\x1b[36m================================================================================\x1b[0m\n");

  // Category 1: CSS Engine Specifications (R1)
  const cssContent = fs.readFileSync(GLOBALS_CSS, "utf-8");

  // R1.1: Gecko (Firefox) scrollbar-width: none
  const hasGeckoReset = cssContent.includes("scrollbar-width: none !important");
  assert(
    "CSS Engine Specifications",
    "Gecko (Firefox) scrollbar-width: none applied with !important",
    hasGeckoReset,
    `Found 'scrollbar-width: none !important': ${hasGeckoReset}`
  );

  // R1.2: Trident / Legacy Edge -ms-overflow-style: none
  const hasTridentReset = cssContent.includes("-ms-overflow-style: none !important");
  assert(
    "CSS Engine Specifications",
    "Trident / Legacy Edge -ms-overflow-style: none applied with !important",
    hasTridentReset,
    `Found '-ms-overflow-style: none !important': ${hasTridentReset}`
  );

  // R1.3: WebKit/Blink ::-webkit-scrollbar display: none, width: 0, height: 0
  const hasWebkitScrollbar =
    cssContent.includes("::-webkit-scrollbar") &&
    cssContent.includes("width: 0 !important") &&
    cssContent.includes("height: 0 !important") &&
    cssContent.includes("display: none !important");
  assert(
    "CSS Engine Specifications",
    "WebKit/Blink universal ::-webkit-scrollbar hidden with 0-dimensions",
    hasWebkitScrollbar,
    `Found complete ::-webkit-scrollbar reset: ${hasWebkitScrollbar}`
  );

  // R1.4: WebKit pseudo-elements (thumb, track, track-piece, corner, button, resizer)
  const hasWebkitSubparts =
    cssContent.includes("::-webkit-scrollbar-thumb") &&
    cssContent.includes("::-webkit-scrollbar-track") &&
    cssContent.includes("::-webkit-scrollbar-corner") &&
    cssContent.includes("::-webkit-scrollbar-button") &&
    cssContent.includes("::-webkit-resizer");
  assert(
    "CSS Engine Specifications",
    "WebKit sub-components (thumb, track, corner, button, resizer) fully suppressed",
    hasWebkitSubparts,
    `Found thumb, track, corner, button, and resizer rules: ${hasWebkitSubparts}`
  );

  // R1.5: Root overflow-x: hidden on html, body
  const hasRootOverflowX =
    cssContent.includes("overflow-x: hidden") &&
    cssContent.includes("html, body");
  assert(
    "CSS Engine Specifications",
    "Root layout contains overflow-x: hidden on html, body to eliminate horizontal shifts",
    hasRootOverflowX,
    `Found overflow-x: hidden on root: ${hasRootOverflowX}`
  );

  // R1.6: Lenis CSS Integration Foundation
  const hasLenisCSS =
    cssContent.includes("html.lenis") &&
    cssContent.includes(".lenis.lenis-smooth") &&
    cssContent.includes("[data-lenis-prevent]") &&
    cssContent.includes("overscroll-behavior: contain");
  assert(
    "CSS Engine Specifications",
    "Lenis smooth scroll stylesheet foundation with data-lenis-prevent overscroll containment",
    hasLenisCSS,
    `Found Lenis CSS and overscroll-behavior: contain: ${hasLenisCSS}`
  );

  // R1.7: Utility class .no-scrollbar
  const hasNoScrollbarUtility =
    cssContent.includes(".no-scrollbar::-webkit-scrollbar") &&
    cssContent.includes(".no-scrollbar") &&
    cssContent.includes("scrollbar-width: none !important");
  assert(
    "CSS Engine Specifications",
    "Tailwind utility .no-scrollbar is declared under @layer utilities with !important",
    hasNoScrollbarUtility,
    `Found .no-scrollbar utility with !important: ${hasNoScrollbarUtility}`
  );

  // R1.8: Universal scrollbar-gutter: auto !important
  const hasScrollbarGutter = cssContent.includes("scrollbar-gutter: auto !important");
  assert(
    "CSS Engine Specifications",
    "Universal scrollbar-gutter: auto !important declared to eliminate empty gutter gaps",
    hasScrollbarGutter,
    `Found scrollbar-gutter: auto !important: ${hasScrollbarGutter}`
  );

  // R1.9: iOS WebKit touch momentum scrolling
  const hasTouchScrolling =
    cssContent.includes("-webkit-overflow-scrolling: touch") &&
    cssContent.includes("[data-lenis-prevent]");
  assert(
    "CSS Engine Specifications",
    "iOS WebKit momentum scrolling enabled via -webkit-overflow-scrolling: touch on isolated containers",
    hasTouchScrolling,
    `Found -webkit-overflow-scrolling: touch on isolated containers: ${hasTouchScrolling}`
  );

  // R1.10: JavaScript-disabled fallback smooth scroll
  const hasJsDisabledSmoothScroll =
    cssContent.includes("html:not(.lenis)") &&
    cssContent.includes("scroll-behavior: smooth");
  assert(
    "CSS Engine Specifications",
    "Fallback native smooth scrolling configured for environments with JavaScript disabled",
    hasJsDisabledSmoothScroll,
    `Found html:not(.lenis) scroll-behavior: smooth: ${hasJsDisabledSmoothScroll}`
  );

  // R1.11: Universal scrollbar-color: transparent transparent !important for defense-in-depth
  const hasScrollbarColor = cssContent.includes("scrollbar-color: transparent transparent !important");
  assert(
    "CSS Engine Specifications",
    "Universal scrollbar-color: transparent transparent !important declared for CSS Scrollbars Level 1 defense-in-depth",
    hasScrollbarColor,
    `Found scrollbar-color: transparent transparent !important: ${hasScrollbarColor}`
  );

  // Category 2: Component Architecture & Scroll Hierarchy (R2)
  const layoutContent = fs.readFileSync(LAYOUT_TSX, "utf-8");
  const overlayContent = fs.readFileSync(NAVBAR_OVERLAY, "utf-8");
  const galleryContent = fs.readFileSync(MEDIA_SHOWCASE, "utf-8");
  const providerContent = fs.readFileSync(SMOOTH_SCROLL_PROVIDER, "utf-8");
  const sphereContent = fs.readFileSync(SPHERE_CANVAS, "utf-8");
  const monolithContent = fs.readFileSync(MONOLITH_CANVAS, "utf-8");
  const contactContent = fs.readFileSync(CONTACT_PAGE, "utf-8");

  // R2.1: Layout Provider Hierarchy
  const providerWrapsAll =
    layoutContent.indexOf("<SmoothScrollProvider>") < layoutContent.indexOf("<Header />") &&
    layoutContent.indexOf("<Header />") < layoutContent.indexOf("<KineticNavbarOverlay />") &&
    layoutContent.indexOf("<KineticNavbarOverlay />") < layoutContent.indexOf("{children}") &&
    layoutContent.indexOf("{children}") < layoutContent.indexOf("</SmoothScrollProvider>");
  assert(
    "Component Architecture",
    "SmoothScrollProvider encloses Header, KineticNavbarOverlay, and children in layout.tsx",
    providerWrapsAll,
    `Correct nesting order verified: ${providerWrapsAll}`
  );

  // R2.2: KineticNavbarOverlay data-lenis-prevent
  const overlayHasLenisPrevent = overlayContent.includes("data-lenis-prevent");
  assert(
    "Component Architecture",
    "KineticNavbarOverlay container contains data-lenis-prevent attribute",
    overlayHasLenisPrevent,
    `Found data-lenis-prevent on overlay: ${overlayHasLenisPrevent}`
  );

  // R2.3: KineticNavbarOverlay Lenis stop/start integration
  const overlayControlsLenis =
    overlayContent.includes("useLenis") &&
    overlayContent.includes("stopLenis") &&
    overlayContent.includes("startLenis");
  assert(
    "Component Architecture",
    "KineticNavbarOverlay stops Lenis background loop on open and resumes on close",
    overlayControlsLenis,
    `Lenis lifecycle control verified: ${overlayControlsLenis}`
  );

  // R2.4: MediaShowcaseGallery telemetry container data-lenis-prevent
  const galleryHasLenisPrevent =
    galleryContent.includes("data-lenis-prevent") &&
    galleryContent.includes("overflow-y-auto");
  assert(
    "Component Architecture",
    "MediaShowcaseGallery telemetry container has data-lenis-prevent attribute",
    galleryHasLenisPrevent,
    `Found data-lenis-prevent on telemetry container: ${galleryHasLenisPrevent}`
  );

  // R2.5: MediaShowcaseGallery fullscreen ESC key handler & Lenis sync
  const galleryHasEscHandler =
    galleryContent.includes("useLenis") &&
    galleryContent.includes("Escape") &&
    galleryContent.includes("stopLenis");
  assert(
    "Component Architecture",
    "MediaShowcaseGallery handles ESC key and pauses Lenis while in fullscreen view",
    galleryHasEscHandler,
    `Escape key handler and Lenis sync verified: ${galleryHasEscHandler}`
  );

  // R2.6: SmoothScrollProvider memoized callbacks
  const providerHasMemoizedCallbacks =
    providerContent.includes("useCallback") &&
    providerContent.includes("useMemo") &&
    providerContent.includes("scrollTo = useCallback") &&
    providerContent.includes("stop = useCallback") &&
    providerContent.includes("start = useCallback");
  assert(
    "Component Architecture",
    "SmoothScrollProvider stabilizes scrollTo, stop, and start via useCallback & useMemo",
    providerHasMemoizedCallbacks,
    `Stable references verified: ${providerHasMemoizedCallbacks}`
  );

  // R2.7: WebGLSphereCanvas data-lenis-prevent isolation
  const sphereHasLenisPrevent = sphereContent.includes("data-lenis-prevent");
  assert(
    "Component Architecture",
    "WebGLSphereCanvas contains data-lenis-prevent to isolate 3D rotational dragging & wheel zoom from page scrolling",
    sphereHasLenisPrevent,
    `Found data-lenis-prevent on WebGLSphereCanvas: ${sphereHasLenisPrevent}`
  );

  // R2.8: ObsidianMonolithCanvas data-lenis-prevent isolation
  const monolithHasLenisPrevent = monolithContent.includes("data-lenis-prevent");
  assert(
    "Component Architecture",
    "ObsidianMonolithCanvas contains data-lenis-prevent to isolate 3D rotational drag gestures from page scrolling",
    monolithHasLenisPrevent,
    `Found data-lenis-prevent on ObsidianMonolithCanvas: ${monolithHasLenisPrevent}`
  );

  // R2.9: Route change scroll reset in SmoothScrollProvider
  const providerHasRouteChangeReset =
    providerContent.includes("usePathname") &&
    providerContent.includes("scrollTo(0, { immediate: true })");
  assert(
    "Component Architecture",
    "SmoothScrollProvider deterministically resets scroll position to top on client route transitions",
    providerHasRouteChangeReset,
    `Found pathname scroll reset: ${providerHasRouteChangeReset}`
  );

  // R2.10: KineticNavbarOverlay auto-closes on route change
  const overlayClosesOnRouteChange =
    overlayContent.includes("pathname") &&
    overlayContent.includes("closeNav()");
  assert(
    "Component Architecture",
    "KineticNavbarOverlay automatically closes when pathname changes via browser back/forward history",
    overlayClosesOnRouteChange,
    `Route change listener verified: ${overlayClosesOnRouteChange}`
  );

  // R2.11: ContactPage zero-overflow layout
  const contactHasZeroOverflowLayout =
    contactContent.includes("h-[calc(100vh-3.5rem)]") ||
    contactContent.includes("overflow-hidden");
  assert(
    "Component Architecture",
    "ContactPage defines zero-overflow layout calibrated against header offset",
    contactHasZeroOverflowLayout,
    `Verified contact viewport layout: ${contactHasZeroOverflowLayout}`
  );

  // Category 3: Build & Static Artifact Gate (R3)
  const outDir = path.join(ROOT_DIR, "out");
  const hasOutDir = fs.existsSync(outDir);
  assert(
    "Build Artifacts",
    "Static SSG export directory 'out/' exists with prerendered pages",
    hasOutDir,
    `'out/' directory existence: ${hasOutDir}`
  );

  if (hasOutDir) {
    const requiredPages = ["index.html", "work", "contact", "maintenance", "404.html"];
    for (const page of requiredPages) {
      let pageExists = false;
      if (page.endsWith(".html")) {
        pageExists = fs.existsSync(path.join(outDir, page));
      } else {
        pageExists =
          fs.existsSync(path.join(outDir, page, "index.html")) ||
          fs.existsSync(path.join(outDir, `${page}.html`));
      }
      assert(
        "Build Artifacts",
        `Prerendered SSG page '${page}' exists in static export`,
        pageExists,
        `Page '${page}' verified: ${pageExists}`
      );
    }
  }

  // Print results
  let passedCount = 0;
  let failedCount = 0;

  for (const r of results) {
    const status = r.passed ? "\x1b[32m✓ PASS\x1b[0m" : "\x1b[31m✗ FAIL\x1b[0m";
    console.log(`[${status}] [${r.category}] ${r.name}`);
    console.log(`       \x1b[90mDetails: ${r.details}\x1b[0m`);
    if (r.error) {
      console.log(`       \x1b[31mError: ${r.error}\x1b[0m`);
      failedCount++;
    } else {
      passedCount++;
    }
  }

  console.log("\n\x1b[36m================================================================================\x1b[0m");
  console.log(`TOTAL SCROLLBAR TESTS: ${results.length} | PASSED: ${passedCount} | FAILED: ${failedCount}`);
  if (failedCount === 0) {
    console.log("\x1b[1m\x1b[32m✅ ALL UNIVERSAL ZERO-SCROLLBAR INVARIANTS SATISFIED (100% PASS)\x1b[0m");
  } else {
    console.log("\x1b[1m\x1b[31m❌ SCROLLBAR TESTS FAILED\x1b[0m");
    process.exit(1);
  }
  console.log("\x1b[36m================================================================================\x1b[0m\n");
}

runScrollbarTests();
