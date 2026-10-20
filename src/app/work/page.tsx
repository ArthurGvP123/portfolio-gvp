import type { Metadata } from "next";
import { PROJECTS } from "@/data/projects";
import { WorkShowcaseCatalog } from "@/components/showcase/WorkShowcaseCatalog";
import { TactileFooter } from "@/components/footer/TactileFooter";

export const metadata: Metadata = {
  title: "Works & Case Studies // Arthur Gregorius Pongoh",
  description:
    "Comprehensive engineering catalog of 8 production-grade systems, AI research benchmarks, and distributed cloud applications engineered by Arthur Gregorius Pongoh.",
  openGraph: {
    title: "Works & Case Studies // Arthur Gregorius Pongoh",
    description:
      "Comprehensive engineering catalog of 8 production-grade systems, AI research benchmarks, and distributed cloud applications.",
    type: "website",
  },
};

export default function WorkPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-foreground selection:text-background">
      <WorkShowcaseCatalog initialProjects={PROJECTS} />
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <TactileFooter />
      </div>
    </main>
  );
}
