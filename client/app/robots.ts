import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const siteUrl = siteConfig.siteUrl;

  const defaultDisallows = [
    "/admin/",
    "/api/admin/",
    "/dashboard/",
    "/login/",
    "/private/",
    "/api/",
  ];

  try {
    const res = await fetch(`${apiUrl}/api/seo/robots`, {
      headers: { Accept: "text/plain" },
      next: { revalidate: 60 },
      cache: "no-store",
    });

    if (res.ok) {
      const text = await res.text();
      // Check if site is set to block all crawlers
      if (text.includes("Disallow: /\n") && !text.includes("Allow:")) {
        return {
          rules: {
            userAgent: "*",
            disallow: ["/"],
          },
          sitemap: `${siteUrl}/sitemap.xml`,
          host: siteUrl,
        };
      }
    }
  } catch (_err) {
    // Silent fallback to standard safe configuration
  }

  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: defaultDisallows,
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
