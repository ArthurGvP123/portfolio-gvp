/**
 * Empirical Adversarial & Verification Suite for Milestone M1
 * Tests:
 * 1. globals.css strict Obsidian Dark Luxury palette & CSS selector integrity.
 * 2. tailwind.config.ts CSS variable bindings.
 * 3. navStore / useNavStore state predictability, idempotency, multi-subscriber synchronization, and stress harness.
 * 4. Structural integration of Header, KineticNavbarOverlay, and Layout.
 */

import fs from "fs";
import path from "path";
import { navStore } from "../src/hooks/useNavStore";

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
console.log("     EMPIRICAL ADVERSARIAL TEST SUITE: MILESTONE M1 (THEME & NAV SHELL)       ");
console.log("================================================================================\n");

const ROOT_DIR = path.resolve(__dirname, "..");

// -----------------------------------------------------------------------------
// SUITE 1: globals.css Palette & CSS Architecture
// -----------------------------------------------------------------------------
const suiteCss = "CSS - globals.css & Obsidian Dark Luxury Palette";

const globalsCssPath = path.join(ROOT_DIR, "src", "app", "globals.css");
const cssContent = fs.readFileSync(globalsCssPath, "utf-8");

// Test 1: Verify presence of all required Obsidian Dark Luxury color tokens
const requiredTokens: Record<string, string> = {
  "--bg-primary": "#050505",
  "--bg-secondary": "#0e0e0e",
  "--bg-tertiary": "#141414",
  "--fg-primary": "#f5f5f5",
  "--fg-secondary": "#888888",
  "--fg-muted": "#525252",
  "--border-hairline": "#1a1a1a",
  "--accent-primary": "#ffffff",
  "--accent-contrast": "#050505",
};

for (const [token, expectedVal] of Object.entries(requiredTokens)) {
  const tokenRegex = new RegExp(`${token}\\s*:\\s*${expectedVal}`, "i");
  const found = tokenRegex.test(cssContent);
  assert(
    suiteCss,
    `Token ${token} equals ${expectedVal}`,
    found,
    found ? `Token verified: ${token}: ${expectedVal}` : `Missing or incorrect token: ${token}`
  );
}

// Test 2: Verify badge tokens
const badgeTokens = [
  "--badge-case-bg",
  "--badge-case-fg",
  "--badge-shot-bg",
  "--badge-shot-fg",
  "--badge-wip-bg",
  "--badge-wip-fg",
];

for (const token of badgeTokens) {
  const exists = cssContent.includes(token);
  assert(
    suiteCss,
    `Badge token ${token} declared`,
    exists,
    exists ? `Badge token declared: ${token}` : `Missing badge token: ${token}`
  );
}

// Test 3: Absence of non-Obsidian theme selectors
const forbiddenThemeSelectors = [
  '[data-theme="concrete"]',
  '[data-theme="rust"]',
  '[data-theme="verdigris"]',
  '[data-theme="blood"]',
  '[data-theme="emerald"]',
  '[data-theme="cyber"]',
  '[data-theme="light"]',
];

for (const forbidden of forbiddenThemeSelectors) {
  const found = cssContent.includes(forbidden);
  assert(
    suiteCss,
    `No legacy theme selector "${forbidden}" in globals.css`,
    !found,
    !found ? "Forbidden selector absent" : `Found forbidden legacy selector: ${forbidden}`
  );
}

// Test 4: CSS delimiter balancing (check braces { and } count)
{
  const openBraces = (cssContent.match(/\{/g) || []).length;
  const closeBraces = (cssContent.match(/\}/g) || []).length;
  assert(
    suiteCss,
    "CSS block braces are balanced",
    openBraces === closeBraces && openBraces > 0,
    `Open braces: ${openBraces}, Close braces: ${closeBraces}`
  );
}

// Test 5: Check for broken or orphan selectors
{
  // Detect trailing commas before closing braces or empty selectors
  const emptyBlockRegex = /[^{};]+\s*\{\s*\}/g;
  const emptyMatches = cssContent.match(emptyBlockRegex) || [];
  assert(
    suiteCss,
    "No empty or broken orphan CSS rule blocks in globals.css",
    emptyMatches.length === 0,
    emptyMatches.length === 0 ? "All CSS rules populated" : `Empty blocks: ${emptyMatches.join(", ")}`
  );
}

// -----------------------------------------------------------------------------
// SUITE 2: Tailwind Config Binding Verification
// -----------------------------------------------------------------------------
const suiteTailwind = "Tailwind - Variable Mappings";

const tailwindConfigPath = path.join(ROOT_DIR, "tailwind.config.ts");
const tailwindContent = fs.readFileSync(tailwindConfigPath, "utf-8");

const requiredTailwindBindings = [
  { key: "background", varName: "var(--bg-primary)" },
  { key: "background-secondary", varName: "var(--bg-secondary)" },
  { key: "background-tertiary", varName: "var(--bg-tertiary)" },
  { key: "foreground", varName: "var(--fg-primary)" },
  { key: "foreground-secondary", varName: "var(--fg-secondary)" },
  { key: "foreground-muted", varName: "var(--fg-muted)" },
  { key: "border", varName: "var(--border-hairline)" },
  { key: "border-strong", varName: "var(--border-strong)" },
  { key: "accent.DEFAULT", varName: "var(--accent-primary)" },
  { key: "accent.contrast", varName: "var(--accent-contrast)" },
];

for (const binding of requiredTailwindBindings) {
  const hasVar = tailwindContent.includes(binding.varName);
  assert(
    suiteTailwind,
    `Tailwind maps ${binding.key} to ${binding.varName}`,
    hasVar,
    hasVar ? `Binding found: ${binding.varName}` : `Missing binding: ${binding.varName}`
  );
}

// -----------------------------------------------------------------------------
// SUITE 3: useNavStore / navStore State Machine & Concurrency Stress
// -----------------------------------------------------------------------------
const suiteNav = "navStore - State Machine & Synchronization";

// Reset store to known state (closeNav)
navStore.closeNav();

// Test 1: Initial state & server snapshot
{
  const initial = navStore.getSnapshot();
  const server = navStore.getServerSnapshot();
  assert(
    suiteNav,
    "navStore initial state is closed (false) and SSR snapshot is false",
    initial === false && server === false,
    `initial: ${initial}, serverSnapshot: ${server}`
  );
}

// Test 2: Idempotency of closeNav when already closed
{
  let notified = false;
  const unsubscribe = navStore.subscribe(() => {
    notified = true;
  });

  navStore.closeNav();
  assert(
    suiteNav,
    "closeNav() is idempotent: does not trigger listener when already closed",
    !notified && navStore.getSnapshot() === false,
    `notified: ${notified}, snapshot: ${navStore.getSnapshot()}`
  );
  unsubscribe();
}

// Test 3: Open transition
{
  let notified = false;
  const unsubscribe = navStore.subscribe(() => {
    notified = true;
  });

  navStore.openNav();
  assert(
    suiteNav,
    "openNav() transitions state to true and notifies listener",
    notified && navStore.getSnapshot() === true,
    `notified: ${notified}, snapshot: ${navStore.getSnapshot()}`
  );
  unsubscribe();
}

// Test 4: Idempotency of openNav when already open
{
  let notified = false;
  const unsubscribe = navStore.subscribe(() => {
    notified = true;
  });

  navStore.openNav();
  assert(
    suiteNav,
    "openNav() is idempotent: does not trigger listener when already open",
    !notified && navStore.getSnapshot() === true,
    `notified: ${notified}, snapshot: ${navStore.getSnapshot()}`
  );
  unsubscribe();
}

// Test 5: Toggle transition from open to close and back
{
  let notifyCount = 0;
  const unsubscribe = navStore.subscribe(() => {
    notifyCount++;
  });

  navStore.toggleNav();
  const stateAfterFirstToggle = navStore.getSnapshot();

  navStore.toggleNav();
  const stateAfterSecondToggle = navStore.getSnapshot();

  assert(
    suiteNav,
    "toggleNav() cleanly inverts state twice and triggers listeners each time",
    notifyCount === 2 && stateAfterFirstToggle === false && stateAfterSecondToggle === true,
    `notifyCount: ${notifyCount}, state1: ${stateAfterFirstToggle}, state2: ${stateAfterSecondToggle}`
  );
  unsubscribe();
  navStore.closeNav();
}

// Test 6: Multi-subscriber desynchronization challenge (50 subscribers, 500 state flips)
{
  const SUBSCRIBER_COUNT = 50;
  const MUTATION_ROUNDS = 500;

  const subscriberState = new Array(SUBSCRIBER_COUNT).fill(false);
  const subscriberCalls = new Array(SUBSCRIBER_COUNT).fill(0);
  const unsubs: Array<() => void> = [];

  for (let i = 0; i < SUBSCRIBER_COUNT; i++) {
    const idx = i;
    const unsub = navStore.subscribe(() => {
      subscriberCalls[idx]++;
      subscriberState[idx] = navStore.getSnapshot();
    });
    unsubs.push(unsub);
  }

  let desyncDetected = false;
  let expectedState = false;

  for (let step = 0; step < MUTATION_ROUNDS; step++) {
    const action = step % 3; // 0 = toggle, 1 = open, 2 = close
    if (action === 0) {
      expectedState = !expectedState;
      navStore.toggleNav();
    } else if (action === 1) {
      expectedState = true;
      navStore.openNav();
    } else {
      expectedState = false;
      navStore.closeNav();
    }

    const currentSnapshot = navStore.getSnapshot();
    if (currentSnapshot !== expectedState) {
      desyncDetected = true;
      break;
    }

    // Verify all subscribers are synchronized
    for (let i = 0; i < SUBSCRIBER_COUNT; i++) {
      if (subscriberState[i] !== expectedState) {
        desyncDetected = true;
        break;
      }
    }
    if (desyncDetected) break;
  }

  // Cleanup all subscribers
  for (const unsub of unsubs) {
    unsub();
  }

  assert(
    suiteNav,
    `50 concurrent subscribers remain 100% synchronized over ${MUTATION_ROUNDS} state transitions`,
    !desyncDetected,
    desyncDetected
      ? "Desynchronization detected among subscribers"
      : `All 50 subscribers synchronized across ${MUTATION_ROUNDS} operations`
  );
}

// Test 7: Unsubscribe isolation
{
  navStore.closeNav();
  let activeCalls = 0;
  let detachedCalls = 0;

  const unsub1 = navStore.subscribe(() => {
    activeCalls++;
  });
  const unsub2 = navStore.subscribe(() => {
    detachedCalls++;
  });

  // Detach unsub2
  unsub2();

  navStore.openNav();
  navStore.closeNav();

  assert(
    suiteNav,
    "Unsubscribed listener is never invoked on subsequent state changes",
    activeCalls === 2 && detachedCalls === 0,
    `activeCalls: ${activeCalls}, detachedCalls: ${detachedCalls}`
  );

  unsub1();
}

// Test 8: Self-unsubscribing listener during notification broadcast
{
  let unregisterSelfDidRun = false;
  let secondListenerDidRun = false;

  let unsubSelf: (() => void) | null = null;
  unsubSelf = navStore.subscribe(() => {
    unregisterSelfDidRun = true;
    if (unsubSelf) unsubSelf();
  });

  const unsubOther = navStore.subscribe(() => {
    secondListenerDidRun = true;
  });

  navStore.toggleNav();

  assert(
    suiteNav,
    "Self-unsubscribing listener completes cleanly without throwing or dropping peer notifications",
    unregisterSelfDidRun && secondListenerDidRun,
    `selfRun: ${unregisterSelfDidRun}, peerRun: ${secondListenerDidRun}`
  );

  unsubOther();
  navStore.closeNav();
}

// -----------------------------------------------------------------------------
// SUITE 4: Navigation Shell & Layout Integration
// -----------------------------------------------------------------------------
const suiteIntegration = "Integration - Navigation Shell & Layout";

// Check RootLayout integration
const layoutPath = path.join(ROOT_DIR, "src", "app", "layout.tsx");
const layoutContent = fs.readFileSync(layoutPath, "utf-8");

assert(
  suiteIntegration,
  "layout.tsx mounts <Header />",
  layoutContent.includes("<Header />") && layoutContent.includes("from \"@/components/navigation/Header\""),
  "Header component correctly imported and mounted"
);

assert(
  suiteIntegration,
  "layout.tsx mounts <KineticNavbarOverlay />",
  layoutContent.includes("<KineticNavbarOverlay />") && layoutContent.includes("from \"@/components/navigation/KineticNavbarOverlay\""),
  "KineticNavbarOverlay component correctly imported and mounted"
);

assert(
  suiteIntegration,
  "layout.tsx contains no legacy theme restore script or data-theme attribute",
  !layoutContent.includes("sessionStorage.getItem('portfolio-theme')") && !layoutContent.includes("data-theme="),
  "Legacy theme script and attribute fully purged from layout"
);

// Check Header implementation
const headerPath = path.join(ROOT_DIR, "src", "components", "navigation", "Header.tsx");
const headerContent = fs.readFileSync(headerPath, "utf-8");

assert(
  suiteIntegration,
  "Header uses useNavStore hook and binds toggleNav",
  headerContent.includes("useNavStore()") && headerContent.includes("toggleNav"),
  "Header correctly binds store toggleNav action"
);

assert(
  suiteIntegration,
  "Header renders brand mark ARTHUR GvP // SYS.ARCH",
  headerContent.includes("ARTHUR GvP") && headerContent.includes("// SYS.ARCH"),
  "Brand monogram mark correctly rendered"
);

// Check KineticNavbarOverlay implementation
const overlayPath = path.join(ROOT_DIR, "src", "components", "navigation", "KineticNavbarOverlay.tsx");
const overlayContent = fs.readFileSync(overlayPath, "utf-8");

assert(
  suiteIntegration,
  "KineticNavbarOverlay renders all 4 numbered links: 01 HOME, 02 WORK, 03 CONTACT, 04 MAINTENANCE",
  overlayContent.includes('num: "01"') &&
  overlayContent.includes('num: "02"') &&
  overlayContent.includes('num: "03"') &&
  overlayContent.includes('num: "04"'),
  "Numbered links 01-04 defined"
);

assert(
  suiteIntegration,
  "KineticNavbarOverlay includes JakartaClock",
  overlayContent.includes("<JakartaClock />") && overlayContent.includes("from \"./JakartaClock\""),
  "JakartaClock imported and mounted"
);

assert(
  suiteIntegration,
  "KineticNavbarOverlay binds email copy arthurgregorius333@gmail.com",
  overlayContent.includes("arthurgregorius333@gmail.com") && overlayContent.includes("navigator.clipboard.writeText"),
  "Email copy trigger properly configured"
);

assert(
  suiteIntegration,
  "KineticNavbarOverlay implements Escape key handling and focus trap",
  overlayContent.includes("Escape") && overlayContent.includes("Tab") && overlayContent.includes("shiftKey"),
  "Keyboard navigation and focus trapping implemented"
);

// Check TactileFooter & RotaryDial decoupling
const footerPath = path.join(ROOT_DIR, "src", "components", "footer", "TactileFooter.tsx");
const footerContent = fs.readFileSync(footerPath, "utf-8");

assert(
  suiteIntegration,
  "TactileFooter has zero references to ThemeSwitcher or applyThemeMode",
  !footerContent.includes("ThemeSwitcher") && !footerContent.includes("applyThemeMode"),
  "Theme switcher completely decoupled from TactileFooter"
);

const rotaryPath = path.join(ROOT_DIR, "src", "components", "footer", "RotaryDial.tsx");
const rotaryContent = fs.readFileSync(rotaryPath, "utf-8");

assert(
  suiteIntegration,
  "RotaryDial has zero references to THEMES array or theme switching",
  !rotaryContent.includes("THEMES") && !rotaryContent.includes("onDialTheme("),
  "RotaryDial decoupled from theme switching"
);

// -----------------------------------------------------------------------------
// SUMMARY & RESULTS
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
const verdict = totalFailed === 0 ? "APPROVE" : "REQUEST_CHANGES";
console.log(`OVERALL EMPIRICAL VERDICT: ${verdict}`);
console.log("================================================================================\n");

if (totalFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
