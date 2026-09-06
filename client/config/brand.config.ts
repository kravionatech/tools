import { siteConfig } from "@/lib/site-config";

export interface BrandConfig {
  name: string;
  tagline: string;
  siteUrl: string;
  logo: string;
  logoDark: string;
  logoLight: string;
  icon: string;
  mark: string;
  favicon: string;
  primaryColor: string;
  gradient: string;
}

export const brandConfig: BrandConfig = {
  name: "Kraviona",
  tagline: "Free Browser-Based SEO, Image & Text Tools",
  siteUrl: siteConfig.siteUrl,
  logo: "/logo/logo-primary.svg",
  logoDark: "/logo/logo-dark.svg",
  logoLight: "/logo/logo-light.svg",
  icon: "/logo/logo-icon.svg",
  mark: "/logo/logo-mark.svg",
  favicon: "/logo/favicon.svg",
  primaryColor: "#7c3aed",
  gradient: "linear-gradient(135deg, #5b21b6 0%, #7c3aed 50%, #9333ea 100%)",
};

export default brandConfig;
