/**
 * Official E2E Test Suite Runner
 * Executes Comprehensive Multi-Tier E2E Test Suite for Interactive Portfolio Website
 * Usage: npx tsx tests/e2e_runner.ts
 */

import { runE2ESuite, E2ESuiteSummary, TestCaseResult } from "./e2e_suite";

function formatStatus(passed: boolean): string {
  return passed ? "\x1b[32m✓ PASS\x1b[0m" : "\x1b[31m✗ FAIL\x1b[0m";
}

function main() {
  console.log("\x1b[36m================================================================================\x1b[0m");
  console.log("\x1b[1m\x1b[37m  ARTHUR GREGORIUS PONGOH PORTFOLIO — COMPREHENSIVE MULTI-TIER E2E TEST RUNNER  \x1b[0m");
  console.log("\x1b[36m================================================================================\x1b[0m\n");

  const startTime = Date.now();
  const summary: E2ESuiteSummary = runE2ESuite();

  // Group by Tier
  const tierGroups: Record<number, TestCaseResult[]> = {};
  for (const r of summary.results) {
    if (!tierGroups[r.tier]) tierGroups[r.tier] = [];
    tierGroups[r.tier].push(r);
  }

  for (const tierNum of [1, 2, 3, 4, 5]) {
    const tierInfo = summary.tierBreakdown[tierNum];
    const tests = tierGroups[tierNum] || [];
    if (tests.length === 0) continue;

    console.log(`\x1b[1m\x1b[34m--- ${tierInfo.name.toUpperCase()} (${tierInfo.passed}/${tierInfo.total} Passed) ---\x1b[0m`);

    for (const test of tests) {
      console.log(`  ${formatStatus(test.passed)} ${test.name}`);
      console.log(`         \x1b[90mDetails: ${test.details}\x1b[0m`);
      if (test.error) {
        console.log(`         \x1b[31mERROR: ${test.error}\x1b[0m`);
      }
    }
    console.log("");
  }

  // Feature Coverage Table (matching PROJECT.md 14-Feature Inventory)
  console.log("\x1b[36m--------------------------------------------------------------------------------\x1b[0m");
  console.log("\x1b[1m\x1b[37mFEATURE COVERAGE MAPPING (PROJECT.MD FEATURE INVENTORY):\x1b[0m");
  console.log("\x1b[36m--------------------------------------------------------------------------------\x1b[0m");

  const tier1Tests = tierGroups[1] || [];
  const featureInventory = [
    { id: 1, name: "Project_Overview.md", req: "ORIGINAL_REQUEST §R1.1" },
    { id: 2, name: "UI_UX_Specification.md", req: "ORIGINAL_REQUEST §R1.2" },
    { id: 3, name: "Animation_Pipeline_Spec.md", req: "ORIGINAL_REQUEST §R1.3" },
    { id: 4, name: "TODO.md", req: "ORIGINAL_REQUEST §R1.4" },
    { id: 5, name: "Project Workspace Scaffolding", req: "ORIGINAL_REQUEST §R4.1-2" },
    { id: 6, name: "Cards View & 3D Perspective Tilt", req: "ORIGINAL_REQUEST §R2.1" },
    { id: 7, name: "Sphere (Globe) View Three.js WebGL", req: "ORIGINAL_REQUEST §R2.2" },
    { id: 8, name: "Dual-View Switcher", req: "ORIGINAL_REQUEST §R2" },
    { id: 9, name: "Preloader & Kinetic Split-Text", req: "ORIGINAL_REQUEST §R3.1" },
    { id: 10, name: "Lenis Smooth Scrolling", req: "ORIGINAL_REQUEST §R3.2" },
    { id: 11, name: "Tactile Rotary Dial Footer", req: "ORIGINAL_REQUEST §R3.3" },
    { id: 12, name: "5-Theme Switching Engine", req: "ORIGINAL_REQUEST §R3.3" },
    { id: 13, name: "Adversarial Coverage Hardening", req: "Dual Track Tier 5" },
    { id: 14, name: "Production Build Gate", req: "ORIGINAL_REQUEST §R4 & AC" },
  ];

  for (const feat of featureInventory) {
    const matchingTest = tier1Tests.find((t) => t.featureId === feat.id);
    const passed = matchingTest ? matchingTest.passed : false;
    const status = passed ? "\x1b[32m[COVERED]\x1b[0m" : "\x1b[31m[MISSING]\x1b[0m";
    const padId = String(feat.id).padStart(2, " ");
    const padName = feat.name.padEnd(36, " ");
    console.log(`  ${status} #${padId} ${padName} | ${feat.req}`);
  }

  // Summary Metrics Table
  console.log("\n\x1b[36m================================================================================\x1b[0m");
  console.log("\x1b[1m\x1b[37mTIER COVERAGE SUMMARY:\x1b[0m");
  console.log("\x1b[36m--------------------------------------------------------------------------------\x1b[0m");
  for (const tierNum of [1, 2, 3, 4, 5]) {
    const t = summary.tierBreakdown[tierNum];
    const rate = ((t.passed / t.total) * 100).toFixed(1);
    const passColor = t.failed === 0 ? "\x1b[32m" : "\x1b[31m";
    console.log(`  ${t.name.padEnd(35, " ")}: ${passColor}${t.passed}/${t.total} (${rate}%)\x1b[0m`);
  }

  const overallRate = ((summary.passed / summary.total) * 100).toFixed(1);
  const totalElapsed = Date.now() - startTime;

  console.log("\x1b[36m--------------------------------------------------------------------------------\x1b[0m");
  console.log(
    `\x1b[1mTOTAL TESTS: ${summary.total} | \x1b[32mPASSED: ${summary.passed}\x1b[0m\x1b[1m | \x1b[31mFAILED: ${summary.failed}\x1b[0m\x1b[1m | PASS RATE: ${overallRate}% | DURATION: ${totalElapsed}ms\x1b[0m`
  );
  console.log(
    `\x1b[1mOVERALL E2E SUITE VERDICT: ${
      summary.failed === 0 ? "\x1b[32mAPPROVE (100% PASS)\x1b[0m" : "\x1b[31mREQUEST_CHANGES\x1b[0m"
    }\x1b[0m`
  );
  console.log("\x1b[36m================================================================================\x1b[0m\n");

  if (summary.failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main();
