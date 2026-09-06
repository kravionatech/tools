import type { MetadataRoute } from "next";
import { tools } from "@/lib/tools-registry";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

interface StaticRouteConfig {
  path: string;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
}

const staticRoutes: StaticRouteConfig[] = [
  { path: "", changeFrequency: "daily", priority: 1.0 },
  { path: "/tools", changeFrequency: "weekly", priority: 0.9 },
  { path: "/tools/text", changeFrequency: "weekly", priority: 0.8 },
  { path: "/tools/image", changeFrequency: "weekly", priority: 0.8 },
  { path: "/tools/seo", changeFrequency: "weekly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
  { path: "/privacy", changeFrequency: "monthly", priority: 0.5 },
  { path: "/terms", changeFrequency: "monthly", priority: 0.5 },
  { path: "/upcoming", changeFrequency: "weekly", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteConfig.siteUrl.replace(/\/$/, "");
  const now = new Date();

  // 1. Static Pages (strictly public, zero admin/private/login routes)
  const pages: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // 2. Active Tool Pages (strictly exclude drafts and disabled tools)
  const activeTools = tools.filter(
    (tool) => (tool as any).status !== "draft" && (tool as any).enabled !== false
  );

  const toolPages: MetadataRoute.Sitemap = activeTools.map((tool) => ({
    url: `${siteUrl}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: tool.featured ? 0.85 : 0.75,
  }));

  return [...pages, ...toolPages];
}
