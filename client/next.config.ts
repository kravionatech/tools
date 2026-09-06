import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://kraviona.site",
    SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://kraviona.site",
    SITE_NAME: "Kraviona Tools",
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  },
};

export default nextConfig;
