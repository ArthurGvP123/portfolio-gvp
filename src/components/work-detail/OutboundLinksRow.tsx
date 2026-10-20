"use client";

import React from "react";
import {
  ExternalLink,
  Globe,
  FileText,
  Download,
  Layers,
  BookOpen,
} from "lucide-react";
import { OutboundLink } from "@/types/portfolio";
import { playHapticClick } from "@/utils/audio";
import { cn } from "@/lib/utils";

export interface OutboundLinksRowProps {
  links: OutboundLink[];
  title: string;
  className?: string;
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function getLinkIcon(type: OutboundLink["type"]) {
  switch (type) {
    case "github":
      return GithubIcon;
    case "live":
      return Globe;
    case "paper":
      return BookOpen;
    case "apk":
      return Download;
    case "docs":
      return FileText;
    case "figma":
      return Layers;
    default:
      return ExternalLink;
  }
}

export function OutboundLinksRow({ links, title, className }: OutboundLinksRowProps) {
  if (!links || links.length === 0) return null;

  // Filter out any non-HTTP(S) URLs for defensive security
  const safeLinks = links.filter((link) => /^https?:\/\//i.test(link.url));

  if (safeLinks.length === 0) return null;

  return (
    <div className={cn("w-full space-y-3", className)}>
      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-foreground-muted">
        <span>OUTBOUND REPOSITORIES & LIVE DEPLOYMENTS</span>
        <span className="text-foreground-secondary">({safeLinks.length})</span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {safeLinks.map((link, index) => {
          const Icon = getLinkIcon(link.type);
          const isPrimary = link.type === "live" || (index === 0 && link.type !== "github");

          return (
            <a
              key={`${link.type}-${link.url}`}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playHapticClick(880)}
              aria-label={`${link.label} for ${title}`}
              className={cn(
                "group inline-flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-xs border transition-all duration-200 cursor-pointer select-none",
                isPrimary
                  ? "bg-foreground text-background border-foreground hover:bg-accent hover:border-accent shadow-xs"
                  : "bg-background-secondary border-border text-foreground hover:bg-background-tertiary hover:border-foreground/50"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110", isPrimary ? "text-background" : "text-foreground-secondary group-hover:text-foreground")} />
              <span>{link.label}</span>
              <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
