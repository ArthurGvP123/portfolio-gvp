import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROJECTS, getProjectBySlug } from "@/data/projects";
import {
  WorkDetailHeader,
  OutboundLinksRow,
  MediaShowcaseGallery,
  CaseStudyGrid,
  TechStackPills,
  ProjectPagination,
} from "@/components/work-detail";
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
      description: "The requested project case study could not be located in the neural archives.",
    };
  }

  return {
    title: `${project.title} — Case Study // Arthur GvP`,
    description: project.summary || project.subtitle,
    keywords: [
      project.title,
      project.category,
      ...project.techStack,
      ...project.tags,
      "Arthur Gregorius Pongoh",
      "Case Study",
      "Software Engineering",
    ],
    openGraph: {
      title: `${project.title} — Case Study // Arthur GvP`,
      description: project.summary || project.subtitle,
      type: "article",
      images: [
        {
          url: project.coverImage,
          width: 1280,
          height: 720,
          alt: `${project.title} Case Study Preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — Case Study // Arthur GvP`,
      description: project.summary || project.subtitle,
      images: [project.coverImage],
    },
  };
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const currentIndex = PROJECTS.findIndex((p) => p.slug === slug);
  const prevProject = PROJECTS[(currentIndex - 1 + PROJECTS.length) % PROJECTS.length];
  const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-foreground selection:text-background">
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-20 space-y-12">
        {/* Header & Meta Matrix */}
        <WorkDetailHeader
          project={project}
          totalProjects={PROJECTS.length}
          currentIndex={currentIndex}
        />

        {/* Action Outbound Links Suite */}
        {project.links && project.links.length > 0 && (
          <OutboundLinksRow links={project.links} title={project.title} />
        )}

        {/* 16:9 Interactive Media Showcase Gallery */}
        <MediaShowcaseGallery project={project} />

        {/* Analytical Case Study Breakdown (Challenge, Metrics, Solution Details) */}
        <CaseStudyGrid project={project} />

        {/* Tech Stack Pills & Categories */}
        <TechStackPills techStack={project.techStack} tags={project.tags} />

        {/* Circular Project Pagination */}
        <ProjectPagination
          prevProject={prevProject}
          nextProject={nextProject}
        />
      </div>

      {/* Global Tactile Footer */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <TactileFooter />
      </div>
    </main>
  );
}
