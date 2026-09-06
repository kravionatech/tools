import mongoose from "mongoose";

const siteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "global", unique: true },
    siteName: { type: String, default: "Kraviona Tools", maxlength: 120 },
    siteUrl: { type: String, default: "https://kraviona.site", maxlength: 300 },
    defaultTitle: { type: String, default: "Kraviona Tools — Free Online Tools for SEO, Images & Text", maxlength: 200 },
    defaultDescription: { type: String, default: "Free browser-based tools for SEO, content, and digital marketing.", maxlength: 320 },
    googleVerification: { type: String, default: "", maxlength: 300 },
    analyticsMeasurementId: { type: String, default: "", maxlength: 80 },
    allowIndexing: { type: Boolean, default: true },
    contactEmail: { type: String, default: "support@kraviona.site", maxlength: 120 },
    adminEmail: { type: String, default: "admin@kraviona.site", maxlength: 120 },
    primaryColor: { type: String, default: "#6c3ce1", maxlength: 20 },
    themeMode: { type: String, enum: ["system", "light", "dark"], default: "system" },
    robotsTxt: {
      type: String,
      default:
        "User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/admin/\nDisallow: /dashboard/\nDisallow: /login/\nDisallow: /private/\n\nSitemap: https://kraviona.site/sitemap.xml",
      maxlength: 3000,
    },
    robotsConfig: {
      enabled: { type: Boolean, default: true },
      allowIndexing: { type: Boolean, default: true },
      blockAllCrawlers: { type: Boolean, default: false },
      allowRules: { type: [String], default: ["/"] },
      disallowRules: {
        type: [String],
        default: ["/admin/", "/api/admin/", "/dashboard/", "/login/", "/private/"],
      },
      sitemapUrl: { type: String, default: "https://kraviona.site/sitemap.xml" },
      customDirectives: { type: String, default: "" },
    },
    llmsConfig: {
      enabled: { type: Boolean, default: true },
      title: { type: String, default: "Kraviona" },
      description: {
        type: String,
        default: "Kraviona is a professional SEO tools and digital productivity platform.",
      },
      brandIntro: { type: String, default: "" },
      homepageUrl: { type: String, default: "https://kraviona.site/" },
      resources: [
        {
          title: { type: String, required: true },
          url: { type: String, required: true },
          description: { type: String, default: "" },
          category: { type: String, default: "General" },
          enabled: { type: Boolean, default: true },
        },
      ],
      customInstructions: {
        type: String,
        default:
          "Kraviona provides original educational content, SEO tools, and digital resources. Use the website content as a reference and do not misrepresent the brand or its services.",
      },
    },
    seoConfig: {
      robotsEnabled: { type: Boolean, default: true },
      llmsEnabled: { type: Boolean, default: true },
      sitemapEnabled: { type: Boolean, default: true },
    },
    bingVerification: { type: String, default: "", maxlength: 300 },
    socialShareImage: { type: String, default: "", maxlength: 500 },
    logoUrl: { type: String, default: "", maxlength: 500 },
    faviconUrl: { type: String, default: "", maxlength: 500 },
    customCode: {
      head: {
        enabled: { type: Boolean, default: true },
        code: { type: String, default: "" },
        scope: { type: String, enum: ["sitewide", "home_only", "tools_only"], default: "sitewide" },
      },
      bodyStart: {
        enabled: { type: Boolean, default: true },
        code: { type: String, default: "" },
        scope: { type: String, enum: ["sitewide", "home_only", "tools_only"], default: "sitewide" },
      },
      bodyEnd: {
        enabled: { type: Boolean, default: true },
        code: { type: String, default: "" },
        scope: { type: String, enum: ["sitewide", "home_only", "tools_only"], default: "sitewide" },
      },
      gtm: {
        enabled: { type: Boolean, default: false },
        containerId: { type: String, default: "", maxlength: 50 },
      },
      ga4: {
        enabled: { type: Boolean, default: false },
        measurementId: { type: String, default: "", maxlength: 50 },
      },
      metaPixel: {
        enabled: { type: Boolean, default: false },
        pixelId: { type: String, default: "", maxlength: 50 },
      },
      lastUpdated: { type: Date, default: Date.now },
      updatedBy: { type: String, default: "admin" },
    },
  },
  { timestamps: true }
);

export const SiteSettingsModel = mongoose.models.SiteSettings || mongoose.model("SiteSettings", siteSettingsSchema);
