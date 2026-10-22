import React from "react";
import Link from "next/link";
import { TactileFooter } from "@/components/footer/TactileFooter";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col justify-between pt-24 sm:pt-32 px-4 sm:px-6 lg:px-8 selection:bg-foreground selection:text-background">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
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
      </div>
      <TactileFooter />
    </main>
  );
}
