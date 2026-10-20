import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/common/SmoothScrollProvider";
import { Header } from "@/components/navigation/Header";
import { KineticNavbarOverlay } from "@/components/navigation/KineticNavbarOverlay";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://arthurgvp.dev"),
  title: {
    default: "Arthur Gregorius Pongoh — Systems Architect & Creative Technologist",
    template: "%s // Arthur GvP",
  },
  description:
    "Award-winning caliber interactive portfolio featuring dual-view Cards & 3D WebGL Sphere showcase, Swiss brutalist typography, and tactile micro-interactions.",
  keywords: [
    "Arthur Gregorius Pongoh",
    "Systems Architect",
    "Creative Developer",
    "Deep Learning",
    "Computer Vision",
    "Next.js 15",
    "Three.js",
    "WebGL",
    "GSAP",
    "Lenis",
  ],
  authors: [{ name: "Arthur Gregorius Pongoh", url: "https://arthurgvp.dev" }],
  creator: "Arthur Gregorius Pongoh",
  publisher: "Arthur Gregorius Pongoh",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Arthur Gregorius Pongoh — Systems Architect & Creative Technologist",
    description:
      "Award-winning caliber interactive portfolio featuring dual-view Cards & 3D WebGL Sphere showcase, Swiss brutalist typography, and tactile micro-interactions.",
    url: "https://arthurgvp.dev",
    siteName: "Arthur Gregorius Pongoh Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arthur Gregorius Pongoh — Systems Architect & Creative Technologist",
    description:
      "Award-winning caliber interactive portfolio featuring dual-view Cards & 3D WebGL Sphere showcase, Swiss brutalist typography, and tactile micro-interactions.",
    creator: "@arthurgvp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-foreground selection:text-background pt-14 sm:pt-16">
        <SmoothScrollProvider>
          <Header />
          <KineticNavbarOverlay />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}

