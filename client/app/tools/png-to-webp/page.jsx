import Link from "next/link";
import ImageConverter from "../../../components/ImageConverter";
import Breadcrumbs from "../../../components/Breadcrumbs";
import JsonLd from "../../../components/JsonLd";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "PNG to WebP Converter — Keep Transparency & Cut File Size",
  description:
    "Convert PNG graphics to lightweight WebP format with full alpha transparency preservation. 100% free and private in-browser conversion tool.",
  alternates: {
    canonical: "https://kraviona.site/tools/png-to-webp",
  },
  openGraph: {
    title: "PNG to WebP Converter | Kraviona",
    description: "Convert PNG images to WebP with transparency preserved privately in your browser.",
    url: "https://kraviona.site/tools/png-to-webp",
  },
};

const faqs = [
  {
    question: "Does converting PNG to WebP preserve transparent backgrounds?",
    answer:
      "Yes. WebP natively supports 8-bit alpha channel transparency in both lossy and lossless modes. Transparent PNG logos and icons maintain identical transparent backgrounds when converted to WebP.",
  },
  {
    question: "How much file size do I save when converting PNG to WebP?",
    answer:
      "For transparent graphics, illustrations, and UI screenshots, converting from PNG to WebP often slashes file size by 50% to 85% with no visible difference in quality.",
  },
  {
    question: "Should I use lossy or lossless WebP for PNG images?",
    answer:
      "For geometric icons, screenshots with text, and crisp logos, set quality to 95%–100% for near-lossless clarity. For transparent product photos, 80%–85% provides dramatic compression with great fidelity.",
  },
];

export default function PngToWebpPage() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Kraviona PNG to WebP Converter",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "url": "https://kraviona.site/tools/png-to-webp",
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
          { label: "Tools", href: "/tools" },
          { label: "PNG to WebP", href: "/tools/png-to-webp" },
        ]}
      />

      <div className="intro">
        <p className="eyebrow">Image Converter</p>
        <h1>Convert PNG to WebP Online</h1>
        <p>
          Transform heavy PNG graphics into featherlight WebP files. Retain complete alpha transparency, fine-tune compression, and accelerate website loading.
        </p>
      </div>

      <ImageConverter initialTargetFormat="webp" />

      <section className="tool-guide-content">
        <h2>Why Convert PNG to WebP?</h2>
        <p>
          PNG has long been the standard for transparent graphics, but its file size is notoriously heavy. WebP solves this by offering modern compression with full transparency support.
        </p>

        <div className="features-checklist">
          <div className="feature-item">
            <CheckCircle2 size={18} />
            <span><strong>Full Transparency Intact:</strong> Alpha channels are preserved flawlessly without any jagged matte borders or discolored pixels.</span>
          </div>
          <div className="feature-item">
            <CheckCircle2 size={18} />
            <span><strong>Massive Size Reductions:</strong> Cut 50% to 85% of byte payload, significantly speeding up mobile rendering and Core Web Vitals.</span>
          </div>
          <div className="feature-item">
            <CheckCircle2 size={18} />
            <span><strong>Private & Client-Side:</strong> All pixel processing executes right in your browser. Your images are never sent across the internet.</span>
          </div>
        </div>

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
          <h3>Related Converters & Guides</h3>
          <div className="tag-links">
            <Link href="/tools/jpg-to-webp">JPG to WebP Converter</Link>
            <Link href="/tools/jpg-to-png">JPG to PNG Converter</Link>
            <Link href="/blog/how-to-convert-png-to-webp">PNG to WebP Step-by-Step Guide</Link>
            <Link href="/blog/webp-vs-jpg">WebP vs JPG Comparison</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
