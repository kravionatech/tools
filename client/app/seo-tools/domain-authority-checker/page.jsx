import Link from "next/link";
import DomainChecker from "../../../components/DomainChecker";
import Breadcrumbs from "../../../components/Breadcrumbs";
import JsonLd from "../../../components/JsonLd";
import { CheckCircle2, ShieldCheck, AlertCircle, HelpCircle } from "lucide-react";

export const metadata = {
  title: "DA PA Checker & Domain Age Lookup Free | Kraviona",
  description:
    "Check live Domain Authority, Page Authority, Spam Score, and authoritative RDAP domain age. 100% transparent, honest SEO metrics with zero fake scores.",
  alternates: {
    canonical: "https://kraviona.site/seo-tools/domain-authority-checker",
  },
  openGraph: {
    title: "DA PA Checker & Domain Age Lookup | Kraviona",
    description: "Check domain age and inspect transparent authority metrics.",
    url: "https://kraviona.site/seo-tools/domain-authority-checker",
  },
};

const faqs = [
  {
    question: "What is Domain Authority (DA) and how is it scored?",
    answer:
      "Domain Authority is a proprietary search engine ranking score developed by Moz that predicts how likely a domain is to rank in search results. Scores range from 1 to 100 on a logarithmic scale, based primarily on the quantity and quality of external inbound linking domains.",
  },
  {
    question: "Why does Kraviona never display fabricated or estimated DA scores?",
    answer:
      "DA and PA are proprietary trademarks and algorithmic models belonging to Moz. Many low-quality SEO sites generate fake or random numbers to fool users. Kraviona is built on engineering integrity: we query official providers when credentials are configured, and honestly explain configuration requirements when they are not.",
  },
  {
    question: "How is Domain Age determined in this checker?",
    answer:
      "Kraviona queries authoritative registry RDAP (Registration Data Access Protocol) endpoints in real time, extracting the authentic registration event timestamp to compute exact age in years and months.",
  },
  {
    question: "Does Domain Age directly influence Google rankings?",
    answer:
      "Google representatives have stated that calendar domain age is not a direct ranking factor. However, older domains typically have more historical backlinks, crawl priority, and established brand reputation, which indirectly boost ranking potential.",
  },
];

export default function DomainAuthorityCheckerPage() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Kraviona DA PA & Domain Age Checker",
    "applicationCategory": "SEOApplication",
    "operatingSystem": "All",
    "url": "https://kraviona.site/seo-tools/domain-authority-checker",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((f) => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": { "@type": "Answer", "text": f.answer },
    })),
  };

  return (
    <main className="page">
      <JsonLd data={softwareSchema} />
      <JsonLd data={faqSchema} />

      <Breadcrumbs
        items={[
          { label: "SEO Tools", href: "/seo-tools" },
          { label: "DA / PA Checker", href: "/seo-tools/domain-authority-checker" },
        ]}
      />

      <div className="intro">
        <p className="eyebrow">Domain Intelligence</p>
        <h1>Domain Authority & Domain Age Checker</h1>
        <p>
          Check authoritative RDAP domain creation dates, registration history, and inspect licensed SEO metrics with complete transparency.
        </p>
      </div>

      <DomainChecker />

      {/* Guide & Methodology Section */}
      <section className="tool-guide-content">
        <h2>Understanding the Metrics</h2>
        <div className="cards">
          <div className="card">
            <span className="eyebrow">Predictive Metric</span>
            <h3>Domain Authority (DA)</h3>
            <p>
              Estimates whole-domain ranking potential based on root linking domain diversity and quality. Remember that DA is a comparative benchmark, not a Google ranking factor.
            </p>
            <Link href="/blog/what-is-domain-authority">Read DA guide →</Link>
          </div>

          <div className="card">
            <span className="eyebrow">URL-Level Metric</span>
            <h3>Page Authority (PA)</h3>
            <p>
              Measures the individual ranking power of a single web page. High-PA pages can outrank entire high-DA websites on specific long-tail queries.
            </p>
            <Link href="/blog/da-vs-pa">Read DA vs PA guide →</Link>
          </div>

          <div className="card">
            <span className="eyebrow">Trust Signal</span>
            <h3>Domain Age (RDAP)</h3>
            <p>
              Extracted directly from ICANN-accredited registries. Provides the definitive registration date and domain age calculation without guesswork.
            </p>
            <Link href="/blog/how-to-check-domain-age">Read domain age guide →</Link>
          </div>
        </div>

        <h2>Our Data Truthfulness Guarantee</h2>
        <p>
          At Kraviona, we refuse to generate random numbers or approximate "simulated" authority scores. If an authorized SEO API provider (such as Moz) is configured in the environment, live scores are shown. Otherwise, the tool displays an honest unconfigured status while still providing authoritative domain age, registration timestamps, and registrar data.
        </p>

        {/* FAQs */}
        <h2>Frequently Asked Questions</h2>
        <div className="faq-accordion">
          {faqs.map((faq, idx) => (
            <div key={idx} className="faq-item">
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="related-links-bar">
          <h3>Essential SEO Guides</h3>
          <div className="tag-links">
            <Link href="/blog/what-is-domain-authority">What is Domain Authority?</Link>
            <Link href="/blog/da-vs-pa">DA vs PA: Key Differences</Link>
            <Link href="/blog/how-to-check-domain-age">How to Check Domain Age</Link>
            <Link href="/blog/image-optimization-for-seo">Image Optimization for SEO</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
