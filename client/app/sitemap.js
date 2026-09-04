import { BLOG_POSTS } from "../lib/blogData";

export default function sitemap() {
  const baseUrl = "https://kraviona.site";
  const now = new Date();

  // Core static & tool pages
  const staticRoutes = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },
    { path: "/tools", priority: 0.9, changeFrequency: "weekly" },
    { path: "/tools/image-converter", priority: 0.9, changeFrequency: "weekly" },
    { path: "/tools/jpg-to-png", priority: 0.8, changeFrequency: "monthly" },
    { path: "/tools/png-to-jpg", priority: 0.8, changeFrequency: "monthly" },
    { path: "/tools/webp-to-jpg", priority: 0.8, changeFrequency: "monthly" },
    { path: "/tools/jpg-to-webp", priority: 0.8, changeFrequency: "monthly" },
    { path: "/tools/png-to-webp", priority: 0.8, changeFrequency: "monthly" },
    { path: "/seo-tools", priority: 0.9, changeFrequency: "weekly" },
    { path: "/seo-tools/domain-authority-checker", priority: 0.9, changeFrequency: "weekly" },
    { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
    { path: "/about", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
    { path: "/privacy", priority: 0.4, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.4, changeFrequency: "yearly" },
  ];

  const staticEntries = staticRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Dynamic blog post routes
  const blogEntries = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedDate),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...blogEntries];
}