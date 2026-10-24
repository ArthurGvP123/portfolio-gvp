import React from "react";
import Link from "next/link";
import { TactileFooter } from "@/components/footer/TactileFooter";

export default function NotFound() {
  return (
    <main className="w-full min-h-screen flex flex-col relative selection:bg-foreground selection:text-background">
      {/* 1st Viewport Section: 100% Screen Height, Dead-Center Title */}
      <section className="w-full h-screen h-dvh min-h-screen min-h-dvh flex flex-col items-center justify-center px-4 text-center relative">
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black font-sans uppercase tracking-tight text-foreground">
          404
        </h1>
        <p className="mt-4 text-sm font-mono text-foreground-secondary uppercase tracking-widest">
          Error // Page Not Found
        </p>
        <Link
          href="/"
          className="mt-6 px-4 py-2 border border-border bg-background-secondary rounded-xs text-xs font-mono uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors"
        >
          Return Home
        </Link>
      </section>

      {/* Footer positioned below 1st viewport fold (scroll to reveal) */}
      <TactileFooter />
    </main>
  );
}
