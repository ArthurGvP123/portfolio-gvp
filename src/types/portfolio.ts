export type ProjectBadge = "Case" | "Shot" | "Research" | "WIP";

export type ThemeMode = "base" | "concrete" | "rust" | "verdigris" | "blood";

export type ViewMode = "cards" | "sphere";

export type ProjectCategory =
  | "All"
  | "AI & Machine Learning"
  | "Web Application"
  | "Mobile Application"
  | "Computer Vision & Research"
  | "DevOps & Infrastructure"
  | "DevOps & Systems";

export interface OutboundLink {
  label: string;
  url: string;
  type: "github" | "live" | "paper" | "apk" | "docs" | "figma";
}

export interface ProjectMetric {
  label: string;
  value: string;
}

export type ProjectStat = ProjectMetric;

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  tagline: string;
  category: string;
  tags: string[];
  period: string;
  year: number;
  role: string;
  context: string;
  client?: string;
  status: string;
  techStack: string[];
  summary: string;
  description: string;
  challenge: string;
  problemStatement: string;
  solution: string[];
  solutionDetails: string[];
  features: string[];
  keyMetrics: ProjectMetric[];
  coverPattern: "grid" | "radial" | "lines" | "brackets" | "circle" | "hex";
  coverImage: string;
  accentColor: string;
  links: OutboundLink[];
  badge: ProjectBadge;
  featured: boolean;
  externalUrl?: string;
  stats?: ProjectMetric[];
}

export type ProjectItem = Project;

export interface SphereCoord {
  x: number;
  y: number;
  z: number;
  phi: number;
  theta: number;
}

export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  details: string;
}

export interface CertificationItem {
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  url?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  year: string;
  achievements: string[];
  skills?: string[];
  current?: boolean;
}

export interface ContactChannel {
  platform: string;
  label: string;
  url: string;
  icon: "Mail" | "Linkedin" | "Github" | "Instagram" | "MessageCircle" | "Globe" | string;
  primary?: boolean;
  handle?: string;
  actionText?: string;
}

export interface ProfileData {
  name: string;
  shortName: string;
  headline: string;
  subline: string;
  location: string;
  timezone: string;
  email: string;
  availability: string;
  bioSummary: string;
  specializations: string[];
  education: EducationItem[];
  certifications: CertificationItem[];
  experiences: ExperienceItem[];
  socials: ContactChannel[];
}
