export interface RobotsConfig {
  enabled: boolean;
  allowIndexing: boolean;
  blockAllCrawlers: boolean;
  allowRules: string[];
  disallowRules: string[];
  sitemapUrl: string;
  customDirectives: string;
}

export interface LlmsResource {
  title: string;
  url: string;
  description?: string;
  category: string;
  enabled: boolean;
}

export interface LlmsConfig {
  enabled: boolean;
  title: string;
  description: string;
  brandIntro: string;
  homepageUrl: string;
  resources: LlmsResource[];
  customInstructions: string;
}

export interface CodeSection {
  enabled: boolean;
  code: string;
  scope: "sitewide" | "home_only" | "tools_only";
}

export interface CustomCodeConfig {
  head: CodeSection;
  bodyStart: CodeSection;
  bodyEnd: CodeSection;
  gtm: { enabled: boolean; containerId: string };
  ga4: { enabled: boolean; measurementId: string };
  metaPixel: { enabled: boolean; pixelId: string };
  lastUpdated?: string;
  updatedBy?: string;
}

export interface SiteSettings {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  contactEmail: string;
  adminEmail: string;
  primaryColor: string;
  themeMode: "system" | "light" | "dark";
  logoUrl?: string;
  faviconUrl?: string;
  googleVerification?: string;
  bingVerification?: string;
  analyticsMeasurementId?: string;
  allowIndexing: boolean;
  robotsTxt?: string;
  socialShareImage?: string;
}
