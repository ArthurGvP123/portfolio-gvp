"use client";

import React from "react";
import { Preloader } from "@/components/common/Preloader";
import { HeroSection } from "@/components/home/HeroSection";
import { QuickBioSection } from "@/components/home/QuickBioSection";
import { FeaturedWorksPreview } from "@/components/home/FeaturedWorksPreview";
import { WorkExperienceTimeline } from "@/components/home/WorkExperienceTimeline";
import { HomeCTASection } from "@/components/home/HomeCTASection";
import { TactileFooter } from "@/components/footer/TactileFooter";

export default function Home() {
  return (
    <>
      {/* Kinetic 3-Phase Preloader & Curtain Wipe */}
      <Preloader />

      <main className="min-h-screen flex flex-col justify-between selection:bg-foreground selection:text-background">
        {/* Kinetic Hero with Live Status Beacon & Dual CTA */}
        <HeroSection />

        {/* Systems Architecture & Multidisciplinary Bio */}
        <QuickBioSection />

        {/* 3D Perspective Tilt Featured Works Showcase */}
        <FeaturedWorksPreview />

        {/* 7-Stage Professional Experience Timeline */}
        <WorkExperienceTimeline />

        {/* High-Impact Contact CTA Banner & 1-Click Email Copy */}
        <HomeCTASection />

        {/* Brutalist Tactile Footer with Rotary Dial */}
        <div className="px-4 md:px-8 lg:px-12">
          <TactileFooter />
        </div>
      </main>
    </>
  );
}
