import Link from "next/link";
import { AlertCircle, ArrowRight, Home, Image, Globe, BookOpen } from "lucide-react";

export const metadata = {
  title: "404 - Page Not Found | Kraviona",
  description: "The requested page could not be found. Explore Kraviona's SEO tools and image converters.",
};

export default function NotFound() {
  return (
    <main className="page not-found-page">
      <div className="not-found-card">
        <span className="eyebrow">404 Error</span>
        <h1>Page Not Found</h1>
        <p>
          The page you are looking for may have been moved, renamed, or is temporarily unavailable.
        </p>

        <div className="actions" style={{ justifyContent: "center", margin: "24px 0" }}>
          <Link href="/" className="button">
            <Home size={16} style={{ marginRight: "6px" }} /> Return Home
          </Link>
          <Link href="/tools" className="button alt">
            Browse All Tools <ArrowRight size={16} style={{ marginLeft: "6px" }} />
          </Link>
        </div>

        <div className="popular-links-box">
          <p className="popular-title">Popular Destinations:</p>
          <div className="tag-links" style={{ justifyContent: "center" }}>
            <Link href="/seo-tools/domain-authority-checker">DA / PA Checker</Link>
            <Link href="/tools/image-converter">Universal Image Converter</Link>
            <Link href="/tools/jpg-to-webp">JPG to WebP</Link>
            <Link href="/tools/png-to-webp">PNG to WebP</Link>
            <Link href="/blog">Practical SEO Guides</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
