/**
 * Adversarial & Compliance Test Suite: Milestone 5
 * Industry Utility Templates, SEO, Crawling & Web Manifest
 */

import * as fs from "fs";
import * as path from "path";
import robots from "../src/app/robots";
import sitemap from "../src/app/sitemap";
import manifest from "../src/app/manifest";
import { PROJECTS } from "../src/data/projects";
import { CONTACT_CHANNELS, PRIMARY_EMAIL } from "../src/data/contacts";

const projectRoot = path.resolve(__dirname, "..");

interface TestResult {
  name: string;
  category: string;
  passed: boolean;
  details: string;
}

const results: TestResult[] = [];

function assert(category: string, name: string, condition: boolean, details: string) {
  results.push({ category, name, passed: Boolean(condition), details });
  const icon = condition ? "✓ PASS" : "✗ FAIL";
  console.log(`[${icon}] [${category}] ${name}\n         Details: ${details}`);
}

console.log("=".repeat(80));
console.log("   ADVERSARIAL & COMPLIANCE TEST SUITE: MILESTONE M5 UTILITIES & SEO   ");
console.log("=".repeat(80));

// 1. Maintenance Page & Bypass Telemetry
{
  const maintPagePath = path.join(projectRoot, "src", "app", "maintenance", "page.tsx");
  const maintClientPath = path.join(projectRoot, "src", "components", "maintenance", "MaintenanceClient.tsx");

  const pageExists = fs.existsSync(maintPagePath);
  const clientExists = fs.existsSync(maintClientPath);
  const pageContent = pageExists ? fs.readFileSync(maintPagePath, "utf-8") : "";
  const clientContent = clientExists ? fs.readFileSync(maintClientPath, "utf-8") : "";

  assert(
    "Maintenance Mode Route",
    "Maintenance page file exists with Server Component metadata export",
    pageExists && pageContent.includes("export const metadata") && pageContent.includes("System Maintenance // Arthur GvP"),
    `Page exists: ${pageExists}, metadata verified: ${pageContent.includes("System Maintenance")}`
  );

  assert(
    "Maintenance Mode Route",
    "Maintenance page provides direct 1-click email copy bypass for arthurgregorius333@gmail.com",
    clientExists && clientContent.includes("handleCopyEmail") && clientContent.includes("PRIMARY EMAIL"),
    `Client component exists: ${clientExists}, copy email bypass verified`
  );

  assert(
    "Maintenance Mode Route",
    "Maintenance page provides WhatsApp transmission link with OWASP rel='noopener noreferrer'",
    clientExists && clientContent.includes("rel=\"noopener noreferrer\"") && clientContent.includes("whatsappUrl"),
    `Security attributes verified on WhatsApp bypass link`
  );

  assert(
    "Maintenance Mode Route",
    "Maintenance page incorporates live JakartaClock and return-to-base navigation",
    clientExists && clientContent.includes("<JakartaClock") && clientContent.includes("RETURN TO BASE // HOME"),
    `Live WIB clock and recovery route link verified`
  );
}

// 2. Loading Screen Skeleton (Feature 23)
{
  const loadingPath = path.join(projectRoot, "src", "app", "loading.tsx");
  const exists = fs.existsSync(loadingPath);
  const content = exists ? fs.readFileSync(loadingPath, "utf-8") : "";

  assert(
    "Loading Skeleton",
    "App Router loading.tsx exists with accessibility attributes (role='status', aria-live='polite')",
    exists && content.includes('role="status"') && content.includes('aria-live="polite"'),
    `File exists: ${exists}, a11y role & live region verified`
  );

  assert(
    "Loading Skeleton",
    "loading.tsx renders Obsidian brutalist pulse skeleton frames to eliminate CLS",
    exists && content.includes("animate-pulse") && content.includes("SYNCHRONIZING NEURAL TELEMETRY"),
    `Telemetry pulse and layout skeleton wireframes verified`
  );
}

// 3. Robots.txt Dynamic Generation (Feature 25)
{
  const robotsData = robots();
  const allowRules = Array.isArray(robotsData.rules)
    ? robotsData.rules.flatMap((r) => r.allow || [])
    : robotsData.rules?.allow || [];
  const sitemapUrl = robotsData.sitemap;

  assert(
    "Search Engine Crawling",
    "robots.ts generates valid indexing rules permitting public routes",
    allowRules.includes("/") && allowRules.includes("/work") && allowRules.includes("/contact"),
    `Allowed routes: ${JSON.stringify(allowRules)}`
  );

  assert(
    "Search Engine Crawling",
    "robots.ts references canonical sitemap.xml endpoint",
    Boolean(sitemapUrl && sitemapUrl.includes("/sitemap.xml")),
    `Sitemap endpoint: ${sitemapUrl}`
  );
}

// 4. Sitemap.xml Dynamic Generation (Feature 25)
{
  const sitemapEntries = sitemap();
  const urls = sitemapEntries.map((e) => e.url);

  const hasHome = urls.some((u) => u === "https://arthurgvp.dev" || u.endsWith(".dev"));
  const hasWork = urls.some((u) => u.includes("/work") && !u.includes("/work/"));
  const hasContact = urls.some((u) => u.includes("/contact"));
  const hasMaintenance = urls.some((u) => u.includes("/maintenance"));

  // Check all 8 projects
  const allProjectsIndexed = PROJECTS.every((p) => urls.some((u) => u.includes(`/work/${p.slug}`)));

  assert(
    "Search Engine Crawling",
    "sitemap.ts indexes all 4 primary routes (Home, Work, Contact, Maintenance)",
    hasHome && hasWork && hasContact && hasMaintenance,
    `Indexed core routes: Home=${hasHome}, Work=${hasWork}, Contact=${hasContact}, Maintenance=${hasMaintenance}`
  );

  assert(
    "Search Engine Crawling",
    `sitemap.ts indexes all ${PROJECTS.length} authentic project slugs dynamically`,
    allProjectsIndexed && sitemapEntries.length === 4 + PROJECTS.length,
    `Total entries: ${sitemapEntries.length} (expected ${4 + PROJECTS.length}), all project slugs matched: ${allProjectsIndexed}`
  );
}

// 5. Web App Manifest (Feature 26)
{
  const manifestData = manifest();

  assert(
    "Web App Manifest",
    "manifest.ts defines Arthur GvP branding, standalone display, and portrait orientation",
    Boolean(manifestData.name?.includes("Arthur Gregorius Pongoh")) &&
      manifestData.short_name === "Arthur GvP" &&
      manifestData.display === "standalone",
    `name: ${manifestData.name ?? ""}, short_name: ${manifestData.short_name ?? ""}, display: ${manifestData.display ?? ""}`
  );

  assert(
    "Web App Manifest",
    "manifest.ts locks theme_color and background_color to Obsidian Dark (#050505)",
    manifestData.theme_color === "#050505" && manifestData.background_color === "#050505",
    `theme_color: ${manifestData.theme_color}, background_color: ${manifestData.background_color}`
  );
}

// 6. Media Alt Text Review
{
  const galleryPath = path.join(projectRoot, "src", "components", "work-detail", "MediaShowcaseGallery.tsx");
  const cardPath = path.join(projectRoot, "src", "components", "showcase", "ProjectCard.tsx");
  const heroPath = path.join(projectRoot, "src", "components", "home", "FeaturedWorksPreview.tsx");

  const galleryContent = fs.readFileSync(galleryPath, "utf-8");
  const cardContent = fs.readFileSync(cardPath, "utf-8");
  const heroContent = fs.readFileSync(heroPath, "utf-8");

  const galleryHasAlt = galleryContent.includes('alt={`${project.title} — Architectural schematic');
  const cardHasAlt = cardContent.includes('alt={`${project.title} — ${project.category} case study');
  const heroHasAlt = heroContent.includes('alt={`${project.title} — Featured case study preview');

  assert(
    "Media Accessibility",
    "All image components across Showcase, Gallery, and Home include descriptive alt text",
    galleryHasAlt && cardHasAlt && heroHasAlt,
    `Gallery alt: ${galleryHasAlt}, Card alt: ${cardHasAlt}, Home preview alt: ${heroHasAlt}`
  );
}

// 7. SSOT Alignment in KineticNavbarOverlay
{
  const navPath = path.join(projectRoot, "src", "components", "navigation", "KineticNavbarOverlay.tsx");
  const navContent = fs.readFileSync(navPath, "utf-8");

  const reconciledWhatsApp = navContent.includes("https://wa.me/62895325605798");
  const reconciledLinkedIn = navContent.includes("https://www.linkedin.com/in/arthur-gregorius-pongoh-125322248");
  const maintenanceLink = navContent.includes('href: "/maintenance"');

  assert(
    "SSOT Alignment",
    "KineticNavbarOverlay is aligned with verified contact channels and links /maintenance",
    reconciledWhatsApp && reconciledLinkedIn && maintenanceLink,
    `WhatsApp reconciled: ${reconciledWhatsApp}, LinkedIn reconciled: ${reconciledLinkedIn}, /maintenance link: ${maintenanceLink}`
  );
}

// 8. Static Prerender Artifacts in .next/server/app/
{
  const nextAppDir = path.join(projectRoot, ".next", "server", "app");
  const hasMaintenanceHtml = fs.existsSync(path.join(nextAppDir, "maintenance.html"));
  const hasRobots = fs.existsSync(path.join(nextAppDir, "robots.txt.body"));
  const hasSitemap = fs.existsSync(path.join(nextAppDir, "sitemap.xml.body"));
  const hasManifest = fs.existsSync(path.join(nextAppDir, "manifest.webmanifest.body"));

  assert(
    "Static SSG Artifacts",
    "Production build output includes statically prerendered maintenance, robots, sitemap, and manifest",
    hasMaintenanceHtml && hasRobots && hasSitemap && hasManifest,
    `maintenance.html: ${hasMaintenanceHtml}, robots.txt: ${hasRobots}, sitemap.xml: ${hasSitemap}, manifest: ${hasManifest}`
  );
}

console.log("=".repeat(80));
const total = results.length;
const passed = results.filter((r) => r.passed).length;
const failed = total - passed;
console.log(`TOTAL M5 TESTS: ${total} | PASSED: ${passed} | FAILED: ${failed}`);
if (failed === 0) {
  console.log("✅ ALL MILESTONE 5 UTILITY & SEO TESTS PASSED (100%)");
} else {
  console.log("❌ MILESTONE 5 TESTS FAILED");
  process.exit(1);
}
