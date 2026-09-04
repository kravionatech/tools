import Link from "next/link";
import ImageConverter from "../../../components/ImageConverter";
import Breadcrumbs from "../../../components/Breadcrumbs";
import JsonLd from "../../../components/JsonLd";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "WebP to JPG Converter — Convert WebP to JPEG Online Free",
  description:
    "Convert Google WebP images to standard JPG format online. Fast, secure client-side conversion for maximum software and desktop compatibility.",
  alternates: {
    canonical: "https://kraviona.site/tools/webp-to-jpg",
  },
  openGraph: {
    title: "WebP to JPG Converter | Kraviona",
    description: "Convert WebP images to standard JPGs privately in your browser.",
    url: "https://kraviona.site/tools/webp-to-jpg",
  },
};

const faqs = [
  {
    question: "Why should I convert WebP to JPG?",
    answer:
      "While WebP is ideal for websites, older photo editing software, office productivity suites, and certain desktop print drivers do not natively open WebP files. Converting to JPG ensures 100% universal compatibility.",
  },
  {
    question: "Does converting WebP to JPG degrade the image quality?",
    answer:
      "When using Kraviona's default 85%–90% quality setting, visual quality remains virtually indistinguishable from the source WebP file.",
  },
];

export default function WebpToJpgPage() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Kraviona WebP to JPG Converter",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "url": "https://kraviona.site/tools/webp-to-jpg",
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
          { label: "WebP to JPG", href: "/tools/webp-to-jpg" },
        ]}
      />

      <div className="intro">
        <p className="eyebrow">Image Converter</p>
        <h1>Convert WebP to JPG Online</h1>
        <p>
          Turn downloaded WebP pictures into standard JPEG photos instantly. Perfect for legacy editors, presentations, and print workflows.
        </p>
      </div>

      <ImageConverter initialTargetFormat="jpg" />

      <section className="tool-guide-content">
        <h2>Why Convert WebP to Standard JPEG?</h2>
        <p>
          Google developed WebP specifically for web efficiency, but desktop ecosystems sometimes struggle with the format.
        </p>

        <div className="features-checklist">
          <div className="feature-item">
            <CheckCircle2 size={18} />
            <span><strong>Work With Any Photo Editor:</strong> Open images in older versions of Photoshop, Illustrator, and desktop utilities without plugins.</span>
          </div>
          <div className="feature-item">
            <CheckCircle2 size={18} />
            <span><strong>Seamless Office Documents:</strong> Insert photos into Word, PowerPoint, and PDF documents without import errors.</span>
          </div>
          <div className="feature-item">
            <CheckCircle2 size={18} />
            <span><strong>Zero Server Storage:</strong> Your private images remain in your browser sandbox.</span>
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
            <Link href="/tools/png-to-jpg">PNG to JPG Converter</Link>
            <Link href="/blog/webp-vs-jpg">WebP vs JPG Full Analysis</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
