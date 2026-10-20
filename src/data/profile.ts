import { ProfileData } from "@/types/portfolio";
import { EXPERIENCES } from "./experience";
import { CONTACT_CHANNELS } from "./contacts";

export const PROFILE_DATA: ProfileData = {
  name: "Arthur Gregorius Pongoh",
  shortName: "Arthur GvP",
  headline: "COMPUTER ENGINEER & CREATIVE TECHNOLOGIST",
  subline: "Architecting High-Performance Intelligence, Fullstack Systems & Kinetic Visual Experiences",
  location: "Rawamangun, Jakarta Timur, DKI Jakarta, Indonesia",
  timezone: "Asia/Jakarta (WIB / UTC+7)",
  email: "arthurgregorius333@gmail.com",
  availability: "Available for High-Ticket Engineering & Research Projects",
  bioSummary: "Bachelor of Computer Engineering graduate from Universitas Negeri Semarang (UNNES) with multidisciplinary mastery spanning Deep Learning & Computer Vision, Fullstack Web & Mobile Architectures, Cloud & DevOps Automation, and Swiss Brutalist Motion Design. Proven track record publishing international peer-reviewed AI research (SINTA 2) and delivering production software for academic, enterprise, and community ecosystems.",
  specializations: [
    "AI & Data Engineering (PyTorch, Computer Vision, MagFace, AdaFace, LiDAR Annotation)",
    "Fullstack Web & Mobile Development (Next.js 15, React 19, TypeScript, Tailwind v4, Flutter, Laravel 12)",
    "DevOps, Cloud & Infrastructure (AWS, Docker, Kubernetes, Linux Scripting, PM2, Nginx, Ansible)",
    "Creative Direction & Motion Graphics (Visual Branding, Adobe Suite, Kinetic Typography)"
  ],
  education: [
    {
      institution: "Universitas Negeri Semarang (UNNES)",
      degree: "Bachelor of Engineering (S.T.) in Computer Engineering",
      period: "Aug 2022 – Jan 2026",
      details: "Graduated with honors. Lead researcher in facial recognition loss function benchmarking and real-time CPU biometric attendance systems."
    },
    {
      institution: "SMA Negeri 77 Jakarta",
      degree: "Associate Sciences (MIPA)",
      period: "Jul 2019 – Jun 2022",
      details: "Active in school events and organizational technology committees."
    }
  ],
  certifications: [
    {
      title: "Test of Proficiency in English Language (ToPEL)",
      issuer: "Universitas Negeri Semarang",
      date: "Sep 2025 – Sep 2027",
      credentialId: "28380/UN37.3.2.4/TU/2025"
    },
    {
      title: "ChatGPT Prompt Engineering for Developers",
      issuer: "DeepLearning.AI",
      date: "Jul 2024",
      url: "https://lnkd.in/gUb8tTge"
    },
    {
      title: "Belajar Dasar AI",
      issuer: "Dicoding Indonesia",
      date: "Sep 2024 – Aug 2027",
      credentialId: "JLX1409OJX72"
    },
    {
      title: "Belajar Dasar Data Science",
      issuer: "Dicoding Indonesia",
      date: "Oct 2024 – Oct 2027",
      credentialId: "1RXY2MQ1KXVM"
    },
    {
      title: "Belajar Dasar Structured Query Language (SQL)",
      issuer: "Dicoding Indonesia",
      date: "Oct 2024 – Oct 2027",
      credentialId: "1RXY2MWLKXVM"
    },
    {
      title: "DevOps, Cloud Architecture (AWS) & Infrastructure Automation",
      issuer: "Social Economic Accelerator Lab (SEAL)",
      date: "Aug 2024 – Dec 2024"
    },
    {
      title: "Belajar Dasar Manajemen Projek",
      issuer: "Dicoding Indonesia",
      date: "Aug 2024 – Aug 2027",
      credentialId: "98XWL72Q9ZM3"
    },
    {
      title: "Belajar Strategi Pengembangan Diri",
      issuer: "Dicoding Indonesia",
      date: "Oct 2024 – Oct 2027",
      credentialId: "98XW5R0YWPM3"
    }
  ],
  experiences: EXPERIENCES,
  socials: CONTACT_CHANNELS
};
