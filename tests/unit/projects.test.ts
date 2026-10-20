import { describe, it, expect } from "vitest";
import { PROJECTS, createProjectSvgCover } from "@/data/projects";

describe("Projects Data Layer Integrity", () => {
  it("should contain exactly 8 authentic production projects", () => {
    expect(PROJECTS).toHaveLength(8);
  });

  it("should ensure every project has a unique non-empty slug", () => {
    const slugs = PROJECTS.map((p) => p.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(PROJECTS.length);
    slugs.forEach((slug) => {
      expect(slug.length).toBeGreaterThan(0);
      expect(slug).toMatch(/^[a-z0-9-]+$/);
    });
  });

  it("should have valid metadata, techStack, and problem-solution architecture", () => {
    PROJECTS.forEach((project) => {
      expect(project.title).toBeTruthy();
      expect(project.category).toBeTruthy();
      expect(project.techStack.length).toBeGreaterThan(0);
      expect(project.summary).toBeTruthy();
      expect(project.problemStatement).toBeTruthy();
      expect(project.solutionDetails.length).toBeGreaterThan(0);
      expect(project.links.length).toBeGreaterThan(0);
    });
  });

  it("should procedurally generate SVG covers without broken tokens", () => {
    const dataUri = createProjectSvgCover("SIKAWAN", "Web Application", "#ffffff", "#050505", "grid");
    expect(dataUri).toContain("data:image/svg+xml;utf8,");
    const decoded = decodeURIComponent(dataUri);
    expect(decoded).toContain("<svg");
    expect(decoded).toContain("</svg>");
    expect(decoded).toContain("viewBox=\"0 0 1280 720\"");
    expect(decoded).toContain("WEB APPLICATION");
    expect(decoded).toContain("SIKAWAN");
  });
});
