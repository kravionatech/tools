import Link from "next/link";
import ImageConverter from "../../../components/ImageConverter";
import Breadcrumbs from "../../../components/Breadcrumbs";
import JsonLd from "../../../components/JsonLd";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "PNG to JPG Converter — Reduce File Size & Compress Online",
  description:
    "Convert PNG graphics and screenshots to lightweight JPG images online. Free, secure in-browser conversion with quality tuning and custom resizing.",
  alternates: {
    canonical: "https://kraviona.site/tools/png-to-jpg",
  },
  openGraph: {
    title: "PNG to JPG Converter | Kraviona",
    description: "Convert PNG images to lightweight JPGs privately in your browser.",
    url: "https://kraviona.site/tools/png-to-jpg",
  },
};

const faqs = [
  {
    question: "What happens to transparent areas when converting PNG to JPG?",
    answer:
      "Because the JPEG format does not support alpha transparency, any transparent pixels are automatically flattened onto a clean white background during conversion to prevent ugly black artifacts.",
  },
  {
    question: "How much smaller will my file be after converting PNG to JPG?",
    answer:
      "For photographic screenshots or complex illustrations, converting from PNG to JPG typically reduces file size by 50% to 80% when using standard 85% compression quality.",
  },
  {
    question: "Is there any limit to how many images I can convert?",
    answer:
      "No. All image conversions happen on your local device CPU/GPU through browser APIs, so there are no hourly limits, paywalls, or registrations required.",
  },
];

export default function PngToJpgPage() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Kraviona PNG to JPG Converter",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "url": "https://kraviona.site/tools/png-to-jpg",
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
          { label: "PNG to JPG", href: "/tools/png-to-jpg" },
        ]}
      />

      <div className="intro">
        <p className="eyebrow">Image Converter</p>
        <h1>Convert PNG to JPG Online</h1>
        <p>
          Compress heavy PNG files into lightweight, universally compatible JPG images. Adjust compression quality, resize dimensions, and save bandwidth.
        </p>
      </div>

      <ImageConverter initialTargetFormat="jpg" />

      <section className="tool-guide-content">
        <h2>When Should You Convert PNG to JPG?</h2>
        <p>
          PNG files are wonderful for precision, but their lossless nature leads to bloated file sizes that slow down web pages and email attachments.
        </p>

        <div className="features-checklist">
          <div className="feature-item">
            <CheckCircle2 size={18} />
            <span><strong>Drastically Cut File Size:</strong> Shrink megabyte-heavy camera screenshots and graphics down to a few hundred kilobytes.</span>
          </div>
          <div className="feature-item">
            <CheckCircle2 size={18} />
            <span><strong>Universal Compatibility:</strong> Ensure your images open seamlessly on all legacy platforms, printers, and operating systems.</span>
          </div>
          <div className="feature-item">
            <CheckCircle2 size={18} />
            <span><strong>Adjustable Quality:</strong> Fine-tune the compression level to balance visual crispness against maximum file savings.</span>
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
            <Link href="/tools/jpg-to-png">JPG to PNG Converter</Link>
            <Link href="/tools/png-to-webp">PNG to WebP Converter</Link>
            <Link href="/tools/webp-to-jpg">WebP to JPG Converter</Link>
            <Link href="/blog/how-to-convert-png-to-webp">PNG to WebP Guide</Link>
            <Link href="/blog/image-optimization-for-seo">Image SEO Best Practices</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
