import type { MetadataRoute } from "next";

// Required for Next.js static export (output: "export")
export const dynamic = "force-static";

/**
 * Next.js 15 App Router Dynamic Web App Manifest (Feature 26)
 * Configures PWA metadata, Obsidian Dark branding (#050505), and standalone display mode.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Arthur Gregorius Pongoh — Systems Architect & Creative Technologist",
    short_name: "Arthur GvP",
    description:
      "Award-winning caliber interactive portfolio featuring dual-view Cards & 3D WebGL Sphere showcase, Swiss brutalist typography, and tactile micro-interactions.",
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#050505",
    orientation: "portrait-primary",
    scope: "/",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
