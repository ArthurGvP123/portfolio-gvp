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
      title: "Project Not Found // Arthur GvP",
    };
  }

  return {
    title: `${project.title} // Arthur GvP`,
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
    <main className="min-h-screen flex flex-col justify-between pt-24 sm:pt-32 px-4 sm:px-6 lg:px-8 selection:bg-foreground selection:text-background">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-black font-sans uppercase tracking-tight text-foreground">
          {project.title}
        </h1>
        <p className="mt-3 text-sm font-mono text-foreground-secondary uppercase tracking-widest">
          Work Detail // {slug}
        </p>
      </div>
      <TactileFooter />
    </main>
  );
}
