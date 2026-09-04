import Link from "next/link";
import Breadcrumbs from "../../components/Breadcrumbs";
import { Search, Image, Globe, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export const metadata = {
  title: "Free SEO Tools & Online Image Converters | Kraviona",
  description:
    "Explore Kraviona's complete toolbox: transparent DA/PA and domain age checkers, private in-browser image converters, and technical webmaster utilities.",
  alternates: {
    canonical: "https://kraviona.site/tools",
  },
  openGraph: {
    title: "Free SEO Tools & Online Image Converters | Kraviona",
    description: "Explore Kraviona's complete suite of free webmaster utilities.",
    url: "https://kraviona.site/tools",
  },
};

export default function ToolsDirectoryPage() {
  return (
    <main className="page">
      <Breadcrumbs items={[{ label: "Tools Directory", href: "/tools" }]} />

      <div className="intro">
        <p className="eyebrow">Complete Toolbox</p>
        <h1>Fast, private tools built for real website tasks.</h1>
        <p>
          No account registration required, no paywalls, and zero tracking. Select a tool below to get started immediately.
        </p>
      </div>

      {/* SEO Tools Section */}
      <section className="tool-category-section">
        <div className="section-title-row">
          <Globe size={22} className="section-icon" />
          <h2>Domain & SEO Tools</h2>
        </div>
        <div className="cards">
          <Link className="card" href="/seo-tools/domain-authority-checker">
            <span className="eyebrow">Search Intelligence</span>
            <h3>DA / PA Checker</h3>
            <p>
              Check authoritative RDAP domain age, registration history, and inspect transparent status for licensed Moz authority scores.
            </p>
            <span>Open checker →</span>
          </Link>

          <Link className="card" href="/seo-tools">
            <span className="eyebrow">Hub</span>
            <h3>All SEO Utilities</h3>
            <p>
              Browse our complete catalog of search engine verification tools and domain intelligence utilities.
            </p>
            <span>Browse SEO tools →</span>
          </Link>
        </div>
      </section>

      {/* Image Converters Section */}
      <section className="tool-category-section" style={{ marginTop: "40px" }}>
        <div className="section-title-row">
          <Image size={22} className="section-icon" />
          <h2>Image Converters & Optimizers</h2>
        </div>
        <div className="cards">
          <Link className="card" href="/tools/image-converter">
            <span className="eyebrow">All-in-One</span>
            <h3>Universal Image Converter</h3>
            <p>
              Convert between JPG, PNG, WebP, and AVIF with custom dimensions, quality tuning, and 100% in-browser privacy.
            </p>
            <span>Open converter →</span>
          </Link>

          <Link className="card" href="/tools/jpg-to-png">
            <span className="eyebrow">Lossless</span>
            <h3>JPG to PNG Converter</h3>
            <p>Transform JPEG pictures into lossless PNG format with zero compression degradation.</p>
            <span>Open tool →</span>
          </Link>

          <Link className="card" href="/tools/png-to-jpg">
            <span className="eyebrow">Compression</span>
            <h3>PNG to JPG Converter</h3>
            <p>Compress heavy PNG files into lightweight, universally compatible JPEG images.</p>
            <span>Open tool →</span>
          </Link>

          <Link className="card" href="/tools/webp-to-jpg">
            <span className="eyebrow">Compatibility</span>
            <h3>WebP to JPG Converter</h3>
            <p>Convert modern WebP pictures into standard JPGs for older software, office apps, and print.</p>
            <span>Open tool →</span>
          </Link>

          <Link className="card" href="/tools/jpg-to-webp">
            <span className="eyebrow">Speed</span>
            <h3>JPG to WebP Converter</h3>
            <p>Shrink photo sizes by 30%–70% to boost mobile speed and pass Google Core Web Vitals.</p>
            <span>Open tool →</span>
          </Link>

          <Link className="card" href="/tools/png-to-webp">
            <span className="eyebrow">Transparency</span>
            <h3>PNG to WebP Converter</h3>
            <p>Preserve complete alpha transparency while cutting 50% to 80% of file size.</p>
            <span>Open tool →</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
