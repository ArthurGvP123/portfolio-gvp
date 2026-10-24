"use client";

import React from "react";
import { TactileFooter } from "@/components/footer/TactileFooter";

export default function Home() {
  return (
    <main className="w-full min-h-screen flex flex-col relative selection:bg-foreground selection:text-background">
      {/* 1st Viewport Section: 100% Screen Height, Dead-Center Title */}
      <section className="w-full h-screen h-dvh min-h-screen min-h-dvh flex items-center justify-center px-4 relative">
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black font-sans uppercase tracking-tight text-foreground text-center">
          Home
        </h1>
      </section>

      {/* Footer positioned below 1st viewport fold (scroll to reveal) */}
      <TactileFooter />
    </main>
  );
}
