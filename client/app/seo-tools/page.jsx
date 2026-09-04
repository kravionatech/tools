import Link from "next/link";
import Breadcrumbs from "../../components/Breadcrumbs";
import { Globe, BarChart3, Calendar, ShieldCheck, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Free SEO Tools & Domain Intelligence | Kraviona",
  description:
    "Check domain authority, page authority, and authoritative RDAP domain age with transparent data guarantees. Practical SEO tools for webmasters.",
  alternates: {
    canonical: "https://kraviona.site/seo-tools",
  },
  openGraph: {
    title: "Free SEO Tools & Domain Intelligence | Kraviona",
    description: "Inspect domain metrics and authentic registration history.",
    url: "https://kraviona.site/seo-tools",
  },
};

export default function SeoToolsPage() {
  return (
    <main className="page">
      <Breadcrumbs items={[{ label: "SEO Tools", href: "/seo-tools" }]} />

      <div className="intro">
        <p className="eyebrow">Search Intelligence Hub</p>
        <h1>SEO tools built on data truthfulness.</h1>
        <p>
          Analyze real search signals, inspect authoritative domain age, and understand metrics without fake scores or marketing illusions.
        </p>
      </div>

      <div className="cards">
        <Link className="card" href="/seo-tools/domain-authority-checker">
          <span className="eyebrow">Core Tool</span>
          <h2>DA / PA Checker</h2>
          <p>
            Check whole-domain and single-page authority estimates alongside authentic RDAP domain registration dates.
          </p>
          <span>Open DA / PA Checker →</span>
        </Link>

        <Link className="card" href="/seo-tools/domain-authority-checker">
          <span className="eyebrow">WHOIS & RDAP</span>
          <h2>Domain Age Lookup</h2>
          <p>
            Extract registration, expiration, and registrar records directly from authoritative ICANN registries.
          </p>
          <span>Check Domain Age →</span>
        </Link>
      </div>

      {/* Recommended Guides */}
      <section className="tool-guide-content" style={{ marginTop: "48px" }}>
        <h2>Educational SEO Guides</h2>
        <p>Learn how to interpret domain metrics and improve organic search traffic:</p>
        <div className="cards">
          <Link href="/blog/what-is-domain-authority" className="card">
            <span className="eyebrow">Foundations</span>
            <h3>What is Domain Authority?</h3>
            <p>Understand Moz's predictive ranking score and how to improve it naturally.</p>
            <span>Read guide →</span>
          </Link>

          <Link href="/blog/da-vs-pa" className="card">
            <span className="eyebrow">Analysis</span>
            <h3>DA vs PA: Key Differences</h3>
            <p>Compare whole-domain strength against individual URL ranking power.</p>
            <span>Read guide →</span>
          </Link>

          <Link href="/blog/how-to-check-domain-age" className="card">
            <span className="eyebrow">Verification</span>
            <h3>How to Check Domain Age</h3>
            <p>Discover how RDAP lookups work and whether age influences Google SEO.</p>
            <span>Read guide →</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
