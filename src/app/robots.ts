import type { MetadataRoute } from "next";

// Required for Next.js static export (output: "export")
export const dynamic = "force-static";

/**
 * Next.js 15 App Router Dynamic Robots.txt Generation (Feature 25)
 * Allows crawling of all public routes while protecting internal APIs.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://arthurgvp.dev";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/work", "/work/*", "/contact"],
        disallow: ["/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
