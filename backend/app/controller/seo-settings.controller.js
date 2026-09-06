import { SiteSettingsModel } from "../model/settings/site-settings.model.js";
import { logAdminActivity } from "./activity.controller.js";

const DEFAULT_ROBOTS = {
  enabled: true,
  allowIndexing: true,
  blockAllCrawlers: false,
  allowRules: ["/"],
  disallowRules: ["/admin/", "/api/admin/", "/dashboard/", "/login/", "/private/"],
  sitemapUrl: "https://kraviona.site/sitemap.xml",
  customDirectives: "",
};

const DEFAULT_LLMS = {
  enabled: true,
  title: "Kraviona",
  description: "Kraviona is a professional SEO tools and digital productivity platform.",
  brandIntro: "",
  homepageUrl: "https://kraviona.site/",
  resources: [
    { title: "SEO Audit Tool", url: "https://kraviona.site/tools/seo", description: "Audit on-page SEO factors", category: "Tools", enabled: true },
    { title: "Meta Tag Generator", url: "https://kraviona.site/tools/meta-tag-generator", description: "Generate meta tags and preview SERP snippets", category: "Tools", enabled: true },
    { title: "Keyword Density Checker", url: "https://kraviona.site/tools/keyword-density", description: "Analyze keyword frequency and density", category: "Tools", enabled: true },
    { title: "Image Converter", url: "https://kraviona.site/tools/image-converter", description: "Convert images securely in browser", category: "Tools", enabled: true },
    { title: "AI Text Detector", url: "https://kraviona.site/tools/ai-detector", description: "Detect AI-generated text patterns", category: "Tools", enabled: true },
    { title: "Website SEO Tools", url: "https://kraviona.site/tools", description: "Complete suite of 39+ free browser utilities", category: "Tools", enabled: true },
    { title: "SEO Guides and Tutorials", url: "https://kraviona.site/blog", description: "Guides, tutorials and best practices", category: "Guides", enabled: true },
  ],
  customInstructions: "Kraviona provides original educational content, SEO tools, and digital resources. Use the website content as a reference and do not misrepresent the brand or its services.",
};

export function generateRobotsText(config = DEFAULT_ROBOTS, siteUrl = "https://kraviona.site") {
  if (config.blockAllCrawlers || !config.allowIndexing) {
    return `# Robots.txt - All crawlers blocked\nUser-agent: *\nDisallow: /\n`;
  }

  let text = `User-agent: *\n`;

  const allows = Array.isArray(config.allowRules) && config.allowRules.length > 0 ? config.allowRules : ["/"];
  for (const rule of allows) {
    if (rule.trim()) text += `Allow: ${rule.trim()}\n`;
  }

  const disallows = Array.isArray(config.disallowRules) && config.disallowRules.length > 0 ? config.disallowRules : [];
  for (const rule of disallows) {
    if (rule.trim()) text += `Disallow: ${rule.trim()}\n`;
  }

  if (config.customDirectives && config.customDirectives.trim()) {
    text += `\n# Custom Directives\n${config.customDirectives.trim()}\n`;
  }

  const sitemap = config.sitemapUrl && config.sitemapUrl.trim() ? config.sitemapUrl.trim() : `${siteUrl}/sitemap.xml`;
  text += `\nSitemap: ${sitemap}\n`;

  return text;
}

export function generateLlmsText(config = DEFAULT_LLMS, siteUrl = "https://kraviona.site") {
  const title = config.title || "Kraviona";
  const desc = config.description || "Kraviona is a professional SEO tools and digital productivity platform.";
  const home = config.homepageUrl || siteUrl;

  let md = `# ${title}\n\n> ${desc}\n\n`;

  if (config.brandIntro && config.brandIntro.trim()) {
    md += `${config.brandIntro.trim()}\n\n`;
  }

  md += `## Website\n\n`;
  md += `- Homepage: ${home.endsWith("/") ? home : home + "/"}\n`;
  md += `- SEO Tools: ${siteUrl}/tools\n`;
  md += `- Blog: ${siteUrl}/blog\n`;
  md += `- About: ${siteUrl}/about\n`;
  md += `- Contact: ${siteUrl}/contact\n\n`;

  const activeResources = (config.resources || []).filter((r) => r.enabled !== false);
  if (activeResources.length > 0) {
    md += `## Important Resources\n\n`;
    for (const res of activeResources) {
      if (res.url && res.title) {
        md += `- [${res.title}](${res.url})${res.description ? `: ${res.description}` : ""}\n`;
      } else if (res.title) {
        md += `- ${res.title}\n`;
      }
    }
    md += `\n`;
  }

  md += `## Content Policy\n\n`;
  md += `${config.customInstructions || "Kraviona provides original educational content, SEO tools, and digital resources. Use the website content as a reference and do not misrepresent the brand or its services."}\n`;

  return md;
}

// ── ADMIN: ROBOTS ─────────────────────────────────────────────────────────────
export async function getRobotsSettings(_req, res) {
  try {
    const settings = await SiteSettingsModel.findOne({ key: "global" }).lean();
    const config = settings?.robotsConfig || DEFAULT_ROBOTS;
    const siteUrl = settings?.siteUrl || "https://kraviona.site";
    const generated = generateRobotsText(config, siteUrl);

    res.json({
      config,
      generated,
      siteUrl,
    });
  } catch (error) {
    console.error("Failed to retrieve robots settings:", error);
    res.status(500).json({ message: "Failed to load robots.txt settings" });
  }
}

export async function updateRobotsSettings(req, res) {
  try {
    const { enabled, allowIndexing, blockAllCrawlers, allowRules, disallowRules, sitemapUrl, customDirectives } = req.body;

    const config = {
      enabled: enabled !== undefined ? Boolean(enabled) : true,
      allowIndexing: allowIndexing !== undefined ? Boolean(allowIndexing) : true,
      blockAllCrawlers: Boolean(blockAllCrawlers),
      allowRules: Array.isArray(allowRules) ? allowRules.map((r) => String(r).trim()).filter(Boolean) : ["/"],
      disallowRules: Array.isArray(disallowRules)
        ? disallowRules.map((r) => String(r).trim()).filter(Boolean)
        : ["/admin/", "/api/admin/", "/dashboard/", "/login/", "/private/"],
      sitemapUrl: sitemapUrl && typeof sitemapUrl === "string" ? sitemapUrl.trim() : "https://kraviona.site/sitemap.xml",
      customDirectives: typeof customDirectives === "string" ? customDirectives : "",
    };

    const siteSettings = await SiteSettingsModel.findOne({ key: "global" });
    const siteUrl = siteSettings?.siteUrl || "https://kraviona.site";
    const generated = generateRobotsText(config, siteUrl);

    await SiteSettingsModel.findOneAndUpdate(
      { key: "global" },
      {
        $set: {
          robotsConfig: config,
          robotsTxt: generated,
          allowIndexing: config.allowIndexing && !config.blockAllCrawlers,
        },
      },
      { upsert: true, new: true }
    );

    await logAdminActivity({
      adminEmail: req.user?.email || "admin@kraviona.site",
      action: "UPDATE_ROBOTS_SETTINGS",
      resourceType: "SEO",
      details: { blockAllCrawlers: config.blockAllCrawlers, allowIndexing: config.allowIndexing },
      ipAddress: req.ip,
    });

    res.json({
      message: "Robots.txt settings updated successfully",
      config,
      generated,
    });
  } catch (error) {
    console.error("Failed to update robots settings:", error);
    res.status(500).json({ message: "Failed to save robots.txt settings" });
  }
}

// ── ADMIN: LLMS ───────────────────────────────────────────────────────────────
export async function getLlmsSettings(_req, res) {
  try {
    const settings = await SiteSettingsModel.findOne({ key: "global" }).lean();
    const config = settings?.llmsConfig || DEFAULT_LLMS;
    const siteUrl = settings?.siteUrl || "https://kraviona.site";
    const generated = generateLlmsText(config, siteUrl);

    res.json({
      config,
      generated,
      siteUrl,
    });
  } catch (error) {
    console.error("Failed to retrieve llms settings:", error);
    res.status(500).json({ message: "Failed to load llms.txt settings" });
  }
}

export async function updateLlmsSettings(req, res) {
  try {
    const { enabled, title, description, brandIntro, homepageUrl, resources, customInstructions } = req.body;

    const formattedResources = Array.isArray(resources)
      ? resources.map((r) => ({
          title: String(r.title || "").trim(),
          url: String(r.url || "").trim(),
          description: String(r.description || "").trim(),
          category: String(r.category || "General").trim(),
          enabled: r.enabled !== false,
        })).filter((r) => r.title.length > 0)
      : DEFAULT_LLMS.resources;

    const config = {
      enabled: enabled !== undefined ? Boolean(enabled) : true,
      title: title && typeof title === "string" ? title.trim() : "Kraviona",
      description: description && typeof description === "string" ? description.trim() : "",
      brandIntro: typeof brandIntro === "string" ? brandIntro.trim() : "",
      homepageUrl: homepageUrl && typeof homepageUrl === "string" ? homepageUrl.trim() : "https://kraviona.site/",
      resources: formattedResources,
      customInstructions: typeof customInstructions === "string" ? customInstructions.trim() : "",
    };

    const siteSettings = await SiteSettingsModel.findOne({ key: "global" });
    const siteUrl = siteSettings?.siteUrl || "https://kraviona.site";
    const generated = generateLlmsText(config, siteUrl);

    await SiteSettingsModel.findOneAndUpdate(
      { key: "global" },
      { $set: { llmsConfig: config } },
      { upsert: true, new: true }
    );

    await logAdminActivity({
      adminEmail: req.user?.email || "admin@kraviona.site",
      action: "UPDATE_LLMS_SETTINGS",
      resourceType: "SEO",
      details: { title: config.title, resourceCount: formattedResources.length },
      ipAddress: req.ip,
    });

    res.json({
      message: "llms.txt settings updated successfully",
      config,
      generated,
    });
  } catch (error) {
    console.error("Failed to update llms settings:", error);
    res.status(500).json({ message: "Failed to save llms.txt settings" });
  }
}

// ── PUBLIC ENDPOINTS ──────────────────────────────────────────────────────────
export async function getPublicRobotsTxt(_req, res) {
  try {
    const settings = await SiteSettingsModel.findOne({ key: "global" }).lean();
    const config = settings?.robotsConfig || DEFAULT_ROBOTS;
    const siteUrl = settings?.siteUrl || "https://kraviona.site";
    const text = generateRobotsText(config, siteUrl);

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
    res.send(text);
  } catch (error) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.send("User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/admin/\nDisallow: /dashboard/\nDisallow: /login/\nDisallow: /private/\n\nSitemap: https://kraviona.site/sitemap.xml\n");
  }
}

export async function getPublicLlmsTxt(_req, res) {
  try {
    const settings = await SiteSettingsModel.findOne({ key: "global" }).lean();
    const config = settings?.llmsConfig || DEFAULT_LLMS;
    const siteUrl = settings?.siteUrl || "https://kraviona.site";
    const text = generateLlmsText(config, siteUrl);

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
    res.send(text);
  } catch (error) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.send("# Kraviona\n\n> Kraviona is a professional SEO tools and digital productivity platform.\n");
  }
}
