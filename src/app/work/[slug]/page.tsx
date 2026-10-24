import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROJECTS, getProjectBySlug } from "@/data/projects";
import { TactileFooter } from "@/components/footer/TactileFooter";

interface WorkDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return PROJECTS.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: WorkDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found - ArthurGvP",
    };
  }

  return {
    title: `${project.title} - ArthurGvP`,
    description: project.summary || project.subtitle,
  };
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="w-full min-h-screen flex flex-col relative selection:bg-foreground selection:text-background">
      {/* 1st Viewport Section: 100% Screen Height, Dead-Center Title */}
      <section className="w-full h-screen h-dvh min-h-screen min-h-dvh flex flex-col items-center justify-center px-4 text-center relative">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-black font-sans uppercase tracking-tight text-foreground">
          {project.title}
        </h1>
        <p className="mt-3 text-sm font-mono text-foreground-secondary uppercase tracking-widest">
          Work Detail // {slug}
        </p>
      </section>

      {/* Footer positioned below 1st viewport fold (scroll to reveal) */}
      <TactileFooter />
    </main>
  );
}
