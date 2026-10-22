"use client";

import React from "react";
import { TactileFooter } from "@/components/footer/TactileFooter";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-between pt-24 sm:pt-32 px-4 sm:px-6 lg:px-8 selection:bg-foreground selection:text-background">
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black font-sans uppercase tracking-tight text-foreground text-center">
          Home
        </h1>
      </div>
      <TactileFooter />
    </main>
  );
}
