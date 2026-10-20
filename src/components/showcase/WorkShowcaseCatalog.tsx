"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Project, ViewMode } from "@/types/portfolio";
import { WorkHeader } from "@/components/showcase/WorkHeader";
import { CategoryFilterBar, CategoryItem } from "@/components/showcase/CategoryFilterBar";
import { CardsView } from "@/components/showcase/CardsView";
import { SphereView } from "@/components/showcase/SphereView";

export interface WorkShowcaseCatalogProps {
  initialProjects: Project[];
}

const CATEGORY_TAXONOMY = [
  "All",
  "Web Application",
  "AI & Machine Learning",
  "Computer Vision & Research",
  "Mobile Application",
  "DevOps & Systems",
];

export function WorkShowcaseCatalog({ initialProjects }: WorkShowcaseCatalogProps) {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<ViewMode>("cards");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categoriesWithCounts: CategoryItem[] = useMemo(() => {
    return CATEGORY_TAXONOMY.map((catName) => {
      if (catName === "All") {
        return { name: catName, count: initialProjects.length };
      }
      const count = initialProjects.filter(
        (p) => p.category.toLowerCase() === catName.toLowerCase()
      ).length;
      return { name: catName, count };
    });
  }, [initialProjects]);

  const filteredProjects = useMemo(() => {
    return initialProjects.filter((project) => {
      const matchesCategory =
        activeCategory === "All" ||
        project.category.toLowerCase() === activeCategory.toLowerCase();

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        project.title.toLowerCase().includes(q) ||
        project.subtitle.toLowerCase().includes(q) ||
        project.category.toLowerCase().includes(q) ||
        project.techStack.some((t) => t.toLowerCase().includes(q)) ||
        project.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [initialProjects, activeCategory, searchQuery]);

  const handleSelectProject = useCallback(
    (project: Project) => {
      router.push(`/work/${project.slug}`);
    },
    [router]
  );

  const handleResetFilters = useCallback(() => {
    setActiveCategory("All");
    setSearchQuery("");
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14 space-y-8">
      {/* Header telemetry and view switcher */}
      <WorkHeader
        currentView={currentView}
        onViewChange={setCurrentView}
        totalCount={initialProjects.length}
      />

      {/* Domain filters and search telemetry */}
      <CategoryFilterBar
        categories={categoriesWithCounts}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalProjects={initialProjects.length}
        filteredCount={filteredProjects.length}
      />

      {/* Dual view rendering area */}
      <div className="relative w-full min-h-[500px]">
        {currentView === "cards" ? (
          <CardsView
            projects={filteredProjects}
            onSelectProject={handleSelectProject}
            onResetFilters={handleResetFilters}
          />
        ) : (
          <SphereView
            projects={filteredProjects}
            onSelectProject={handleSelectProject}
          />
        )}
      </div>
    </div>
  );
}
