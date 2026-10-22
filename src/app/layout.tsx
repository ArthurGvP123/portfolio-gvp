import type { Metadata, Viewport } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/common/SmoothScrollProvider";
import { Preloader } from "@/components/common/Preloader";
import { Header } from "@/components/navigation/Header";
import { KineticNavbarOverlay } from "@/components/navigation/KineticNavbarOverlay";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

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
    "Interactive portfolio of Arthur Gregorius Pongoh — Systems Architect & Creative Technologist.",
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
      "Interactive portfolio of Arthur Gregorius Pongoh — Systems Architect & Creative Technologist.",
    url: "https://arthurgvp.dev",
    siteName: "Arthur Gregorius Pongoh Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arthur Gregorius Pongoh — Systems Architect & Creative Technologist",
    description:
      "Interactive portfolio of Arthur Gregorius Pongoh — Systems Architect & Creative Technologist.",
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
  icons: {
    icon: [
      { url: "/icon.png", sizes: "any" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-icon.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={spaceMono.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground font-mono antialiased selection:bg-foreground selection:text-background">
        <SmoothScrollProvider>
          <Preloader />
          <Header />
          <KineticNavbarOverlay />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}

