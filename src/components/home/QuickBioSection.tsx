"use client";

import React from "react";
import { PROFILE_DATA } from "@/data/profile";
import { Cpu, Layers, Server, Sparkles, Award } from "lucide-react";

export function QuickBioSection() {
  return (
    <section className="relative w-full py-16 md:py-24 border-b border-border bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header Tag */}
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-foreground-secondary mb-8">
          <span className="text-foreground-muted">01 {"//"}</span>
          <span>SYSTEMS ARCHITECTURE &amp; BIOGRAPHY</span>
          <span className="w-12 h-px bg-border/80" />
        </div>

        {/* Narrative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Statement */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
              Bridging the gap between mathematical deep learning rigor and fluid, production-grade interactive interfaces.
            </h2>

            <p className="text-foreground-secondary leading-relaxed text-sm sm:text-base">
              {PROFILE_DATA.bioSummary}
            </p>

            <div className="p-5 border border-border bg-background-secondary/40 rounded-sm space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs uppercase text-foreground font-semibold">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>ACADEMIC FOUNDATION &amp; HONORS</span>
              </div>
              <p className="text-xs text-foreground-secondary leading-relaxed">
                <strong className="text-foreground">Universitas Negeri Semarang (UNNES)</strong> — Bachelor of Computer Engineering (S.T.), Aug 2022 – Jan 2026. Lead researcher in facial recognition loss function benchmarking and real-time CPU biometric attendance systems.
              </p>
            </div>
          </div>

          {/* Pillars & Metrics Cards */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="p-4 border border-border bg-background-secondary/50 rounded-sm hover:border-foreground/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-foreground-muted uppercase tracking-wider">PILLAR 01</span>
                <Cpu className="w-4 h-4 text-foreground-secondary" />
              </div>
              <h3 className="font-bold text-foreground text-sm uppercase">AI &amp; Computer Vision</h3>
              <p className="text-xs text-foreground-secondary mt-1">
                PyTorch, MagFace, AdaFace, InsightFace buffalo_l, 3D LiDAR point cloud clustering, and edge CPU optimization.
              </p>
            </div>

            <div className="p-4 border border-border bg-background-secondary/50 rounded-sm hover:border-foreground/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-foreground-muted uppercase tracking-wider">PILLAR 02</span>
                <Layers className="w-4 h-4 text-foreground-secondary" />
              </div>
              <h3 className="font-bold text-foreground text-sm uppercase">Fullstack Systems</h3>
              <p className="text-xs text-foreground-secondary mt-1">
                Next.js 15 App Router, React 19, TypeScript strict mode, Tailwind CSS v4, Flutter native, and Laravel 12.
              </p>
            </div>

            <div className="p-4 border border-border bg-background-secondary/50 rounded-sm hover:border-foreground/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-foreground-muted uppercase tracking-wider">PILLAR 03</span>
                <Server className="w-4 h-4 text-foreground-secondary" />
              </div>
              <h3 className="font-bold text-foreground text-sm uppercase">Cloud &amp; DevOps Automation</h3>
              <p className="text-xs text-foreground-secondary mt-1">
                AWS VPC, Docker containers, Kubernetes, Linux Ubuntu administration, Nginx reverse proxy, and PM2.
              </p>
            </div>

            <div className="p-4 border border-border bg-background-secondary/50 rounded-sm hover:border-foreground/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-foreground-muted uppercase tracking-wider">PILLAR 04</span>
                <Sparkles className="w-4 h-4 text-foreground-secondary" />
              </div>
              <h3 className="font-bold text-foreground text-sm uppercase">Kinetic Motion &amp; 3D</h3>
              <p className="text-xs text-foreground-secondary mt-1">
                Three.js WebGL shaders, GSAP timelines, Lenis smooth scrolling, and Swiss brutalist typography.
              </p>
            </div>
          </div>
        </div>

        {/* Quantifiable Stats Ribbon */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border border-border bg-background-secondary/30 rounded-sm font-mono">
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-foreground block">08</span>
            <span className="text-[11px] text-foreground-muted uppercase tracking-wider">Production Projects</span>
          </div>
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-foreground block">07</span>
            <span className="text-[11px] text-foreground-muted uppercase tracking-wider">Career Milestones</span>
          </div>
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-foreground block">SINTA 2</span>
            <span className="text-[11px] text-foreground-muted uppercase tracking-wider">Published AI Paper</span>
          </div>
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 block">60 FPS</span>
            <span className="text-[11px] text-foreground-muted uppercase tracking-wider">Smooth Experience</span>
          </div>
        </div>
      </div>
    </section>
  );
}
