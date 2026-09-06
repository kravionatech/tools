import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";
export const revalidate = 60;

const DEFAULT_LLMS_TEXT = `# Kraviona

> Kraviona is a professional SEO tools and digital productivity platform.

## Website

- Homepage: https://kraviona.site/
- SEO Tools: https://kraviona.site/tools
- Blog: https://kraviona.site/blog
- About: https://kraviona.site/about
- Contact: https://kraviona.site/contact

## Important Resources

- SEO Audit Tool
- Meta Tag Generator
- Keyword Density Checker
- Image Converter
- AI Text Detector
- Website SEO Tools
- SEO Guides and Tutorials

## Content Policy

Kraviona provides original educational content, SEO tools, and digital resources. Use the website content as a reference and do not misrepresent the brand or its services.
`;

export async function GET() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  try {
    const res = await fetch(`${apiUrl}/api/seo/llms.txt`, {
      cache: "no-store",
    });

    if (res.ok) {
      const text = await res.text();
      return new NextResponse(text, {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=3600, s-maxage=86400",
        },
      });
    }
  } catch (_error) {
    // Fall back to formatted default
  }

  // Fallback with current siteConfig
  const fallback = DEFAULT_LLMS_TEXT.replace(/https:\/\/kraviona\.site/g, siteConfig.siteUrl);

  return new NextResponse(fallback, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
