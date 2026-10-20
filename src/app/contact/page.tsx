import React from "react";
import type { Metadata } from "next";
import { ObsidianMonolithCanvas } from "@/components/contact/ObsidianMonolithCanvas";
import { TelemetryCard } from "@/components/contact/TelemetryCard";
import { DirectCTAGrid } from "@/components/contact/DirectCTAGrid";
import Link from "next/link";
import { ArrowLeft, Radio, ArrowUpRight } from "lucide-react";

// Server Component Unique SEO Metadata
export const metadata: Metadata = {
  title: "Signal Transmission // Contact Arthur GvP",
  description:
    "Direct communication frequency for architectural engineering contracts, deep learning & computer vision research collaboration, and high-performance fullstack systems.",
  keywords: [
    "Contact Arthur GvP",
    "Arthur Gregorius Pongoh",
    "Systems Architect",
    "AI Engineering",
    "Computer Vision",
    "Fullstack Developer",
    "Jakarta Software Engineer",
    "Hire Systems Architect",
    "Research Collaboration",
  ],
  openGraph: {
    title: "Signal Transmission // Contact Arthur GvP",
    description:
      "Direct communication frequency open for architectural contracts, AI research collaboration, and systems engineering.",
    type: "website",
    url: "/contact",
  },
  twitter: {
    card: "summary_large_image",
    title: "Signal Transmission // Contact Arthur GvP",
    description:
      "Direct communication frequency open for architectural contracts, AI research collaboration, and systems engineering.",
  },
};

export default function ContactPage() {
  return (
    <main className="relative w-full h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] overflow-hidden bg-background text-foreground font-mono selection:bg-foreground selection:text-background">
      {/* Accessible SSR / SEO Fallback for Screen Readers & Search Crawlers */}
      <div className="sr-only" aria-hidden="false">
        <TelemetryCard />
        <DirectCTAGrid />
      </div>

      {/* Fullscreen 3D Interactive Obsidian Monolith & Projected Orbital CTA Nodes */}
      <ObsidianMonolithCanvas fullscreen={true} />

      {/* Floating Minimalist Top Section (Overlay with non-blocking pointer events) */}
      <header className="absolute top-16 sm:top-20 left-4 sm:left-8 right-4 sm:right-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pointer-events-none z-10">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-background/80 border border-border/70 rounded-xs text-[10px] text-foreground-secondary tracking-widest uppercase backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>FREQUENCY: 1420.405 MHz // CARRIER ACTIVE</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-foreground font-sans leading-none">
            SIGNAL TRANSMISSION
          </h1>

          <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed">
            Direct communication pipeline. Rotate the 3D monolith or interact directly with orbital CTA nodes to transmit dispatch.
          </p>
        </div>

        {/* Quick Navigation Link to Catalog */}
        <div className="pointer-events-auto">
          <Link
            href="/work"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-background/80 hover:bg-foreground hover:text-background border border-border/80 hover:border-foreground rounded-xs text-[11px] text-foreground transition-all backdrop-blur-md group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>RETURN TO WORK</span>
          </Link>
        </div>
      </header>

      {/* Centerpiece Guidance Callout */}
      <div className="absolute inset-x-0 bottom-16 sm:bottom-20 flex justify-center pointer-events-none z-10 px-4">
        <div className="px-4 py-2 bg-background/80 border border-border/70 rounded-xs backdrop-blur-md text-[10px] sm:text-xs text-foreground-muted tracking-wider text-center max-w-md">
          <span className="text-foreground font-bold">SOLID MONOLITH MATRIX</span>{" // "}
          Drag to rotate orbital rings &bull; Click glowing nodes for direct contact
        </div>
      </div>
    </main>
  );
}
