import type { Metadata } from "next";
import { TactileFooter } from "@/components/footer/TactileFooter";

export const metadata: Metadata = {
  title: "Work - ArthurGvP",
  description: "Selected works and engineering projects of Arthur Gregorius Pongoh.",
};

export default function WorkPage() {
  return (
    <main className="w-full min-h-screen flex flex-col relative selection:bg-foreground selection:text-background">
      {/* 1st Viewport Section: 100% Screen Height, Dead-Center Title */}
      <section className="w-full h-screen h-dvh min-h-screen min-h-dvh flex items-center justify-center px-4 relative">
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black font-sans uppercase tracking-tight text-foreground text-center">
          Work
        </h1>
      </section>

      {/* Footer positioned below 1st viewport fold (scroll to reveal) */}
      <TactileFooter />
    </main>
  );
}
