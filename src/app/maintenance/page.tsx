import React from "react";
import type { Metadata } from "next";
import { MaintenanceClient } from "@/components/maintenance/MaintenanceClient";
import { TactileFooter } from "@/components/footer/TactileFooter";
import { PRIMARY_EMAIL } from "@/data/contacts";

export const metadata: Metadata = {
  title: "System Maintenance // Arthur GvP",
  description:
    "Scheduled telemetry diagnostics and core upgrade in progress for Arthur Gregorius Pongoh's portfolio platform. Direct transmission channels remain active.",
  keywords: [
    "Arthur Gregorius Pongoh",
    "Systems Maintenance",
    "Telemetry Active",
    "Creative Technologist",
    "Systems Architect",
  ],
  openGraph: {
    title: "System Maintenance // Arthur GvP",
    description:
      "Scheduled telemetry diagnostics and core upgrade in progress. Direct communication bypass remains 100% active.",
    type: "website",
    url: "/maintenance",
  },
  twitter: {
    card: "summary_large_image",
    title: "System Maintenance // Arthur GvP",
    description:
      "Scheduled telemetry diagnostics and core upgrade in progress. Direct communication bypass remains 100% active.",
  },
};

/**
 * Server Component Maintenance Page (Feature 22)
 * Swiss brutalist Obsidian aesthetic (#050505), live telemetry,
 * scheduled restoration indicators, and 100% active transmission bypass.
 */
export default function MaintenancePage() {
  const whatsappUrl = "https://wa.me/62895325605798";
  const whatsappNumber = "+62 895-3256-05798";

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-foreground selection:text-background">
      <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-20 space-y-10">
        {/* Precision Crosshairs in Corners */}
        <span className="absolute top-6 left-4 font-mono text-[10px] text-foreground-muted select-none pointer-events-none opacity-40">
          +
        </span>
        <span className="absolute top-6 right-4 font-mono text-[10px] text-foreground-muted select-none pointer-events-none opacity-40">
          +
        </span>

        {/* Status Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-background-secondary border border-border rounded-xs">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-mono text-[11px] text-foreground-secondary tracking-widest uppercase">
              SYS.STATUS // SCHEDULED ENGINE CALIBRATION
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-foreground font-sans leading-none">
            SYSTEM MAINTENANCE
          </h1>

          <div className="border-y border-border py-2.5">
            <p className="font-mono text-xs sm:text-sm font-bold uppercase tracking-widest text-foreground">
              CORE INFRASTRUCTURE UPGRADE // TELEMETRY STANDBY
            </p>
          </div>

          <p className="text-sm sm:text-base text-foreground-secondary font-mono leading-relaxed max-w-2xl">
            Arthur Gregorius Pongoh&apos;s digital portfolio matrix is currently undergoing scheduled
            architectural enhancement and WebGL pipeline calibration. Direct transmission channels
            and communication bypass frequencies remain fully functional below.
          </p>
        </div>

        {/* Interactive Maintenance Telemetry & Direct Bypass Client */}
        <MaintenanceClient
          email={PRIMARY_EMAIL}
          whatsappUrl={whatsappUrl}
          whatsappNumber={whatsappNumber}
        />
      </div>

      {/* Global Tactile Footer */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <TactileFooter />
      </div>
    </main>
  );
}
