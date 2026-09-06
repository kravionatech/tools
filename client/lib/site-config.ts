export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  "https://kraviona.site";

export interface SiteConfig {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  logoUrl: string;
  faviconUrl: string;
  contactEmail: string;
  robotsEnabled: boolean;
  llmsEnabled: boolean;
  sitemapEnabled: boolean;
}

export const siteConfig: SiteConfig = {
  siteName: "Kraviona",
  siteUrl: SITE_URL,
  defaultTitle: "Kraviona - SEO Tools and Digital Resources",
  defaultDescription:
    "Free browser-based tools for SEO professionals, content writers, and digital marketers. Convert images, analyze text, generate meta tags, build sitemaps, and more.",
  logoUrl: `${SITE_URL}/logo.png`,
  faviconUrl: `${SITE_URL}/favicon.ico`,
  contactEmail: "hello@kraviona.site",
  robotsEnabled: true,
  llmsEnabled: true,
  sitemapEnabled: true,
};

/**
 * Returns a fully qualified absolute URL using the centralized SITE_URL.
 */
export function absoluteUrl(path: string = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (cleanPath === "/") return SITE_URL;
  return `${SITE_URL}${cleanPath}`;
}
