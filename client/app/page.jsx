import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  Globe,
  Image as ImageIcon,
  ArrowRight,
  Search,
  CheckCircle2,
  Lock,
  BarChart2,
  HelpCircle,
} from "lucide-react";
import JsonLd from "../components/JsonLd";
import DomainChecker from "../components/DomainChecker";
import { BLOG_POSTS } from "../lib/blogData";

export const metadata = {
  title: "Kraviona | Professional SEO Tools & Private Image Converters",
  description:
    "Fast, private web utilities for creators and webmasters. Check authoritative domain age, inspect SEO metrics, and convert images 100% locally in your browser.",
  alternates: {
    canonical: "https://kraviona.site",
  },
  openGraph: {
    title: "Kraviona | SEO Tools, Image Tools & Helpful Guides",
    description: "Fast, private web utilities for modern creators and site owners.",
    url: "https://kraviona.site",
    siteName: "Kraviona",
  },
};

const homeFaqs = [
  {
    question: "What makes Kraviona different from other online tool websites?",
    answer:
      "Kraviona is built on engineering integrity. We never fabricate fake SEO scores, and our image converters run 100% locally on your device using HTML5 Canvas APIs, ensuring your sensitive files never touch any remote server.",
  },
  {
    question: "Are Kraviona's tools free to use?",
    answer:
      "Yes. All of Kraviona's core utilities—including domain age lookup and image format converters—are 100% free with no registration, subscription, or usage limits.",
  },
  {
    question: "How does Kraviona protect my privacy during image conversion?",
    answer:
      "Unlike traditional file conversion sites that upload your photos to their servers, Kraviona processes all image decoding, resizing, and encoding entirely within your browser sandbox. Files never leave your local device.",
  },
  {
    question: "Why does the DA/PA checker indicate when a provider is unconfigured?",
    answer:
      "Domain Authority (DA) and Page Authority (PA) are proprietary metrics owned by Moz. Many websites generate randomized numbers to trick visitors. Kraviona connects directly to licensed APIs when configured, and honestly reports unconfigured status when not.",
  },
];

export default function HomePage() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Kraviona",
    "url": "https://kraviona.site",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://kraviona.site/blog?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Kraviona",
    "url": "https://kraviona.site",
    "logo": "https://kraviona.site/favicon.svg",
    "description": "Professional SEO Tools, Private Image Converters, and Practical Educational Guides.",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": homeFaqs.map((f) => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": { "@type": "Answer", "text": f.answer },
    })),
  };

  const recentGuides = BLOG_POSTS.slice(0, 3);

  return (
    <main className="home">
      <JsonLd data={websiteSchema} />
      <JsonLd data={organizationSchema} />
      <JsonLd data={faqSchema} />

      {/* Section 1: Hero */}
      <section className="hero">
        <div className="hero-main">
          <p className="eyebrow">Privacy-First Web Utilities</p>
          <h1>Better SEO checks. Private image tools. Zero fluff.</h1>
          <p>
            Kraviona gives webmasters and creators fast, honest tools: inspect authentic domain registration data, convert images privately in your browser, and explore practical SEO guides.
          </p>
          <div className="actions">
            <Link className="button" href="/tools/image-converter">
              Convert an Image <ArrowRight size={16} style={{ marginLeft: "6px" }} />
            </Link>
            <Link className="button alt" href="/seo-tools/domain-authority-checker">
              Check Domain Age & DA
            </Link>
          </div>
        </div>

        <aside className="hero-note">
          <span className="hero-note-eyebrow">Kraviona Guarantee</span>
          <strong>Honest By Design.</strong>
          <p><ShieldCheck size={16} /> 100% In-browser image processing. Files never leave your device.</p>
          <p><BarChart2 size={16} /> Authoritative domain age via live ICANN RDAP endpoints.</p>
          <p><Lock size={16} /> Zero fake authority scores. Measured signals stay honest.</p>
        </aside>
      </section>

      {/* Section 2: Main Tool Search / Input */}
      <section className="section home-tool-search">
        <div className="section-header-centered">
          <p className="eyebrow">Instant Lookup</p>
          <h2>Check Any Domain in Seconds</h2>
          <p>Enter any domain or URL below for immediate registration history and metric availability.</p>
        </div>
        <DomainChecker initialDomain="kraviona.site" />
      </section>

      {/* Section 3: Featured Tools */}
      <section className="section">
        <p className="eyebrow">Featured Utilities</p>
        <h2>Tools built around real web tasks.</h2>
        <div className="cards">
          <Link className="card" href="/seo-tools/domain-authority-checker">
            <span className="eyebrow">Search Intelligence</span>
            <h3>DA / PA & Domain Age Checker</h3>
            <p>
              Extract authentic registration dates, registrar information, and inspect licensed Moz authority metrics with complete transparency.
            </p>
            <span>Open checker →</span>
          </Link>

          <Link className="card" href="/tools/image-converter">
            <span className="eyebrow">In-Browser Utility</span>
            <h3>Universal Image Converter</h3>
            <p>
              Convert between JPG, PNG, WebP, and AVIF locally with custom resizing, aspect-ratio locking, and quality compression.
            </p>
            <span>Open converter →</span>
          </Link>

          <Link className="card" href="/blog">
            <span className="eyebrow">Knowledge Base</span>
            <h3>Practical SEO & Performance Guides</h3>
            <p>
              Clear, search-intent-driven answers to Core Web Vitals, domain ranking factors, and next-gen image formats.
            </p>
            <span>Read guides →</span>
          </Link>
        </div>
      </section>

      {/* Section 4: SEO Tools Section */}
      <section className="section alternate-section">
        <div className="split-feature">
          <div className="feature-text">
            <p className="eyebrow">SEO Architecture</p>
            <h2>Transparent Domain Intelligence</h2>
            <p>
              Most free SEO checker tools on the web invent random scores to generate ad impressions. Kraviona takes an engineering-first stance:
            </p>
            <ul className="feature-bullet-list">
              <li>
                <CheckCircle2 size={18} />
                <span><strong>Authoritative RDAP Integration:</strong> Connects directly to registry records for exact domain creation dates.</span>
              </li>
              <li>
                <CheckCircle2 size={18} />
                <span><strong>No Simulated Metrics:</strong> Proprietary Moz DA/PA metrics are only queried via licensed APIs, never fabricated.</span>
              </li>
              <li>
                <CheckCircle2 size={18} />
                <span><strong>Actionable Guidance:</strong> Every audit provides direct links to educational guides on improving organic traffic.</span>
              </li>
            </ul>
            <Link href="/seo-tools/domain-authority-checker" className="button" style={{ marginTop: "18px" }}>
              Explore SEO Tools
            </Link>
          </div>
          <div className="feature-preview-box">
            <div className="preview-stat-card">
              <span>Primary Source</span>
              <strong>Authoritative RDAP</strong>
              <small>Verisign, PIR, and ICANN accredited registries</small>
            </div>
            <div className="preview-stat-card">
              <span>Metric Standard</span>
              <strong>Moz API v2 Ready</strong>
              <small>Pluggable provider architecture with zero fabrication</small>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Image Tools Section */}
      <section className="section">
        <div className="section-header-centered">
          <p className="eyebrow">Web Performance</p>
          <h2>Dedicated Image Format Converters</h2>
          <p>
            Optimized landing pages for your exact file workflow. All conversions happen entirely in your browser.
          </p>
        </div>
        <div className="cards">
          <Link href="/tools/jpg-to-png" className="card">
            <h3>JPG to PNG</h3>
            <p>Convert JPEG photos to lossless PNG format with zero compression halos.</p>
            <span>Convert JPG to PNG →</span>
          </Link>
          <Link href="/tools/png-to-jpg" className="card">
            <h3>PNG to JPG</h3>
            <p>Compress heavy PNG files into lightweight, universally compatible JPGs.</p>
            <span>Convert PNG to JPG →</span>
          </Link>
          <Link href="/tools/webp-to-jpg" className="card">
            <h3>WebP to JPG</h3>
            <p>Convert modern WebP pictures into standard JPG format for legacy software.</p>
            <span>Convert WebP to JPG →</span>
          </Link>
          <Link href="/tools/jpg-to-webp" className="card">
            <h3>JPG to WebP</h3>
            <p>Shrink photo sizes by 30%–70% to boost mobile speed and pass Core Web Vitals.</p>
            <span>Convert JPG to WebP →</span>
          </Link>
          <Link href="/tools/png-to-webp" className="card">
            <h3>PNG to WebP</h3>
            <p>Retain complete alpha transparency while cutting 50% to 80% of file size.</p>
            <span>Convert PNG to WebP →</span>
          </Link>
          <Link href="/tools/image-converter" className="card">
            <h3>Universal Converter</h3>
            <p>Convert between any supported format with custom dimensions and quality.</p>
            <span>All Formats →</span>
          </Link>
        </div>
      </section>

      {/* Section 6: Helpful Guides */}
      <section className="section alternate-section">
        <div className="section-header-row">
          <div>
            <p className="eyebrow">Knowledge Hub</p>
            <h2>Latest SEO & Performance Guides</h2>
          </div>
          <Link href="/blog" className="view-all-link">
            View all guides <ArrowRight size={14} />
          </Link>
        </div>
        <div className="cards">
          {recentGuides.map((guide) => (
            <Link key={guide.slug} href={`/blog/${guide.slug}`} className="card">
              <span className="eyebrow">{guide.category} • {guide.readingTime}</span>
              <h3>{guide.title}</h3>
              <p>{guide.summary.slice(0, 120)}...</p>
              <span>Read article →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Section 7: Why Use Kraviona */}
      <section className="section">
        <div className="section-header-centered">
          <p className="eyebrow">Core Principles</p>
          <h2>Why Webmasters Choose Kraviona</h2>
          <p>Engineered for speed, privacy, and technical truth.</p>
        </div>
        <div className="cards">
          <div className="card">
            <ShieldCheck size={26} className="pillar-icon" />
            <h3>100% Private Processing</h3>
            <p>Your images and sensitive files are never transmitted to our servers. All rendering takes place on your local CPU/GPU.</p>
          </div>
          <div className="card">
            <Lock size={26} className="pillar-icon" />
            <h3>Data Truthfulness</h3>
            <p>We refuse to generate fake DA/PA scores. You always know whether data is registry-verified or provider-dependent.</p>
          </div>
          <div className="card">
            <Zap size={26} className="pillar-icon" />
            <h3>Instant & Free</h3>
            <p>No paywalls, no email captures, and no artificial waiting timers. Tools execute in milliseconds without friction.</p>
          </div>
        </div>
      </section>

      {/* Section 8: FAQ */}
      <section className="section faq-home-section">
        <div className="section-header-centered">
          <p className="eyebrow">Common Questions</p>
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className="faq-accordion">
          {homeFaqs.map((faq, idx) => (
            <div key={idx} className="faq-item">
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
