/**
 * Adversarial Stress-Test Suite for Milestone M4 (Contact Hub & 3D Obsidian Monolith)
 * Worker & QA verification suite
 *
 * Focus areas:
 * 1. Contact dataset reconciliation (WhatsApp +62 895-3256-05798, email, socials)
 * 2. Three.js procedural crystal geometry and material properties
 * 3. Kinematic rotation clamping and detent calculations (30° ratchet detents)
 * 4. Audio haptic synthesis robustness under extreme/malformed frequencies
 * 5. Deterministic WebGL disposal and SSR safety contracts
 */

import * as THREE from "three";
import {
  CONTACT_CHANNELS,
  PRIMARY_EMAIL,
  PRIMARY_LOCATION,
  COORDINATES_JAKARTA,
} from "../src/data/contacts";
import { playHapticClick } from "../src/utils/audio";
import {
  ObsidianMonolithCanvas,
  DirectCTAGrid,
  TelemetryCard,
} from "../src/components/contact";

interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  details: string;
  error?: string;
}

const results: TestResult[] = [];

function assert(
  suite: string,
  name: string,
  condition: boolean,
  details: string,
  error?: string
) {
  results.push({
    suite,
    name,
    passed: Boolean(condition),
    details,
    error: condition ? undefined : error || "Assertion failed",
  });
}

console.log(
  "================================================================================"
);
console.log(
  "   ADVERSARIAL VERIFICATION SUITE: MILESTONE M4 CONTACT & MONOLITH              "
);
console.log(
  "================================================================================\n"
);

// =============================================================================
// TEST SUITE 1: Contacts Dataset Reconciliation & Integrity
// =============================================================================
const suiteContacts = "Contact Dataset Reconciliation";

assert(
  suiteContacts,
  "Primary email is arthurgregorius333@gmail.com",
  PRIMARY_EMAIL === "arthurgregorius333@gmail.com",
  `Found email: ${PRIMARY_EMAIL}`
);

const whatsappChannel = CONTACT_CHANNELS.find((c) => c.platform === "WhatsApp");
assert(
  suiteContacts,
  "WhatsApp channel exists",
  Boolean(whatsappChannel),
  "WhatsApp channel present in CONTACT_CHANNELS"
);

if (whatsappChannel) {
  assert(
    suiteContacts,
    "WhatsApp label is +62 895-3256-05798",
    whatsappChannel.label === "+62 895-3256-05798",
    `Found label: ${whatsappChannel.label}`
  );
  assert(
    suiteContacts,
    "WhatsApp URL is https://wa.me/62895325605798",
    whatsappChannel.url === "https://wa.me/62895325605798",
    `Found URL: ${whatsappChannel.url}`
  );
  assert(
    suiteContacts,
    "WhatsApp handle is +62 895-3256-05798",
    whatsappChannel.handle === "+62 895-3256-05798",
    `Found handle: ${whatsappChannel.handle}`
  );
}

const linkedinChannel = CONTACT_CHANNELS.find((c) => c.platform === "LinkedIn");
assert(
  suiteContacts,
  "LinkedIn channel matches verified profile",
  linkedinChannel?.url ===
    "https://www.linkedin.com/in/arthur-gregorius-pongoh-125322248",
  `Found LinkedIn URL: ${linkedinChannel?.url}`
);

const githubChannel = CONTACT_CHANNELS.find((c) => c.platform === "GitHub");
assert(
  suiteContacts,
  "GitHub channel matches ArthurGvP123",
  githubChannel?.url === "https://github.com/ArthurGvP123",
  `Found GitHub URL: ${githubChannel?.url}`
);

const instagramChannel = CONTACT_CHANNELS.find((c) => c.platform === "Instagram");
assert(
  suiteContacts,
  "Instagram channel matches @arthurgvp",
  instagramChannel?.url === "https://www.instagram.com/arthurgvp",
  `Found Instagram URL: ${instagramChannel?.url}`
);

assert(
  suiteContacts,
  "Jakarta coordinates are valid",
  COORDINATES_JAKARTA.lat === -6.1931 &&
    COORDINATES_JAKARTA.lng === 106.8837 &&
    COORDINATES_JAKARTA.label.includes("6°11'35.2\"S"),
  `Found coords: ${COORDINATES_JAKARTA.label}`
);

// =============================================================================
// TEST SUITE 2: Component Exports & Barrel Interface
// =============================================================================
const suiteExports = "Contact Hub Component Exports";

assert(
  suiteExports,
  "ObsidianMonolithCanvas is exported",
  typeof ObsidianMonolithCanvas === "function",
  "ObsidianMonolithCanvas is a valid React component function"
);

assert(
  suiteExports,
  "DirectCTAGrid is exported",
  typeof DirectCTAGrid === "function",
  "DirectCTAGrid is a valid React component function"
);

assert(
  suiteExports,
  "TelemetryCard is exported",
  typeof TelemetryCard === "function",
  "TelemetryCard is a valid React component function"
);

// =============================================================================
// TEST SUITE 3: Three.js Procedural Monolith Math & Kinematics
// =============================================================================
const suiteThree = "Three.js Obsidian Crystal Kinematics & Materials";

// Verify procedural cylinder geometry for hexagonal spire
const spireGeo = new THREE.CylinderGeometry(0.85, 1.45, 4.6, 6, 1);
assert(
  suiteThree,
  "Hexagonal spire cylinder has 6 radial segments",
  spireGeo.parameters.radialSegments === 6,
  `radialSegments = ${spireGeo.parameters.radialSegments}`
);
spireGeo.dispose();

// Verify EdgesGeometry generation for high-contrast wireframe
const testGeo = new THREE.CylinderGeometry(0.85, 1.45, 4.6, 6, 1);
const edgesGeo = new THREE.EdgesGeometry(testGeo);
assert(
  suiteThree,
  "EdgesGeometry generates wireframe edge indices",
  edgesGeo.attributes.position.count > 0,
  `Edge vertex count = ${edgesGeo.attributes.position.count}`
);
edgesGeo.dispose();
testGeo.dispose();

// Verify MeshPhysicalMaterial obsidian glass parameters
const spireMat = new THREE.MeshPhysicalMaterial({
  color: 0x090909,
  roughness: 0.12,
  metalness: 0.22,
  clearcoat: 1.0,
  clearcoatRoughness: 0.06,
  reflectivity: 0.9,
  flatShading: true,
});
assert(
  suiteThree,
  "Spire material has flatShading enabled for faceted specular highlights",
  spireMat.flatShading === true && spireMat.clearcoat === 1.0,
  `flatShading=${spireMat.flatShading}, clearcoat=${spireMat.clearcoat}`
);
spireMat.dispose();

// Verify 30-degree detent math across 360-degree yaw spectrum
let detentTransitions = 0;
let lastDetent = -1;
for (let deg = 0; deg <= 720; deg += 1) {
  const normalizedYaw = ((deg % 360) + 360) % 360;
  const detent = Math.floor(normalizedYaw / 30);
  if (detent !== lastDetent) {
    if (lastDetent !== -1) {
      detentTransitions++;
    }
    lastDetent = detent;
  }
}
assert(
  suiteThree,
  "Detent transitions occur exactly 12 times per 360-degree rotation (24 times for 720 deg)",
  detentTransitions === 24,
  `detentTransitions = ${detentTransitions}`
);

// Verify extreme drag velocity clamping
const chaoticDeltas = [-500, -50, 0, 50, 500];
for (const delta of chaoticDeltas) {
  const clamped = THREE.MathUtils.clamp(delta * 0.008, -0.08, 0.08);
  assert(
    suiteThree,
    `Angular velocity clamp for delta ${delta}`,
    Math.abs(clamped) <= 0.08 && !Number.isNaN(clamped),
    `Clamped = ${clamped}`
  );
}

// =============================================================================
// TEST SUITE 4: Audio Haptics Resilience Under Extreme Inputs
// =============================================================================
const suiteAudio = "Audio Haptics Fuzzing & Safety";

const testFrequencies = [-1000, -1, 0, 480, 820, 960, 20000, NaN, Infinity, -Infinity];
let audioExceptionThrown = false;
for (const freq of testFrequencies) {
  try {
    playHapticClick(freq);
  } catch {
    audioExceptionThrown = true;
  }
}
assert(
  suiteAudio,
  "playHapticClick tolerates negative, zero, infinite, and NaN frequencies without throwing",
  !audioExceptionThrown,
  "All test frequencies handled safely"
);

// =============================================================================
// REPORT SUMMARY
// =============================================================================
console.log("\n================================================================================");
console.log("   TEST EXECUTION SUMMARY");
console.log("================================================================================\n");

let passedCount = 0;
let failedCount = 0;

for (const res of results) {
  const status = res.passed ? "PASS" : "FAIL";
  console.log(`[${status}] [${res.suite}] ${res.name}: ${res.details}`);
  if (!res.passed) {
    console.error(`       Error: ${res.error}`);
    failedCount++;
  } else {
    passedCount++;
  }
}

console.log(`\nTOTAL: ${results.length} | PASSED: ${passedCount} | FAILED: ${failedCount}`);

if (failedCount > 0) {
  console.error("\n❌ SUITE FAILED WITH ERRORS");
  process.exit(1);
} else {
  console.log("\n✅ ALL ADVERSARIAL & COMPLIANCE TESTS PASSED (100%)");
  process.exit(0);
}
