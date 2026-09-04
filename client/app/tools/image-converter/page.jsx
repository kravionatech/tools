import Link from "next/link";
import ImageConverter from "../../../components/ImageConverter";
import Breadcrumbs from "../../../components/Breadcrumbs";
import JsonLd from "../../../components/JsonLd";
import { ShieldCheck, Zap, Sparkles, Layers } from "lucide-react";

export const metadata = {
  title: "Free Online Image Converter — JPG, PNG, WebP, AVIF | Kraviona",
  description:
    "Convert, resize, and compress images online for free. Convert between JPG, PNG, WebP, and AVIF privately in your browser with zero file uploads.",
  alternates: {
    canonical: "https://kraviona.site/tools/image-converter",
  },
  openGraph: {
    title: "Free Online Image Converter | Kraviona",
    description: "Convert JPG, PNG, WebP, and AVIF privately in your browser.",
    url: "https://kraviona.site/tools/image-converter",
  },
};

const faqs = [
  {
    question: "Which image format should I convert to for best website performance?",
    answer:
      "WebP is currently the best choice for general website images, providing ~30% smaller file sizes than JPG with native transparency support across all modern web browsers. AVIF offers even higher compression, but has slightly narrower legacy browser support.",
  },
  {
    question: "Are my uploaded images saved or viewed by anyone?",
    answer:
      "No. All conversions happen entirely inside your web browser's local sandbox using HTML5 Canvas. Your images are never sent over the network or saved on our servers.",
  },
  {
    question: "How does the quality slider affect my converted image?",
    answer:
      "For lossy formats like WebP, JPG, and AVIF, the quality slider controls the compression strength. A setting between 80% and 85% typically reduces file size by 60%–75% while maintaining visually flawless quality.",
  },
];

export default function ImageConverterPage() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Kraviona Universal Image Converter",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "url": "https://kraviona.site/tools/image-converter",
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
          { label: "Image Converter", href: "/tools/image-converter" },
        ]}
      />

      <div className="intro">
        <p className="eyebrow">Universal Image Tool</p>
        <h1>Convert images privately in your browser.</h1>
        <p>
          Convert between JPG, PNG, WebP, and AVIF. Adjust compression quality, resize dimensions with aspect-ratio locking, and download lightweight web assets instantly.
        </p>
      </div>

      <ImageConverter initialTargetFormat="webp" />

      {/* Format Features Matrix */}
      <section className="tool-guide-content">
        <h2>Supported Formats Overview</h2>
        <div className="cards">
          <div className="card">
            <span className="eyebrow">Web Standard</span>
            <h3>WebP</h3>
            <p>Google's high-efficiency web standard. Supports lossy, lossless, and transparency. Ideal for blogs and e-commerce.</p>
          </div>
          <div className="card">
            <span className="eyebrow">Universal</span>
            <h3>JPG / JPEG</h3>
            <p>The universal photo standard with adjustable lossy compression. Best for print, desktop sharing, and legacy apps.</p>
          </div>
          <div className="card">
            <span className="eyebrow">Lossless</span>
            <h3>PNG</h3>
            <p>Pixel-perfect clarity with alpha transparency. Ideal for vector icons, logos, and screenshots containing fine text.</p>
          </div>
          <div className="card">
            <span className="eyebrow">Next-Gen</span>
            <h3>AVIF</h3>
            <p>State-of-the-art compression based on AV1 video codec. Delivers extreme compression for cutting-edge websites.</p>
          </div>
        </div>

        {/* Dedicated Converter Landing Pages */}
        <h2>Dedicated Format Converters</h2>
        <p>Looking for a specific conversion pair? Use our dedicated, search-optimized landing tools:</p>
        <div className="cards">
          <Link href="/tools/jpg-to-png" className="card">
            <h3>JPG to PNG Converter</h3>
            <p>Convert JPEG photos to lossless PNG graphics.</p>
            <span>Open tool →</span>
          </Link>
          <Link href="/tools/png-to-jpg" className="card">
            <h3>PNG to JPG Converter</h3>
            <p>Compress heavy PNG files into lightweight JPGs.</p>
            <span>Open tool →</span>
          </Link>
          <Link href="/tools/webp-to-jpg" className="card">
            <h3>WebP to JPG Converter</h3>
            <p>Convert modern WebP pictures to standard JPG format.</p>
            <span>Open tool →</span>
          </Link>
          <Link href="/tools/jpg-to-webp" className="card">
            <h3>JPG to WebP Converter</h3>
            <p>Shrink photo sizes by 30%–70% with WebP.</p>
            <span>Open tool →</span>
          </Link>
          <Link href="/tools/png-to-webp" className="card">
            <h3>PNG to WebP Converter</h3>
            <p>Preserve transparency while cutting file size.</p>
            <span>Open tool →</span>
          </Link>
        </div>

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
      </section>
    </main>
  );
}
