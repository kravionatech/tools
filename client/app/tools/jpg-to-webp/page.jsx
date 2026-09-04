import Link from "next/link";
import ImageConverter from "../../../components/ImageConverter";
import Breadcrumbs from "../../../components/Breadcrumbs";
import JsonLd from "../../../components/JsonLd";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "JPG to WebP Converter — Boost Page Speed & Compress Online",
  description:
    "Convert JPG photos to modern WebP format online. Reduce image file sizes by 30% to 70% with pristine visual quality to pass Google Core Web Vitals.",
  alternates: {
    canonical: "https://kraviona.site/tools/jpg-to-webp",
  },
  openGraph: {
    title: "JPG to WebP Converter | Kraviona",
    description: "Convert JPG photos to high-speed WebP format privately in your browser.",
    url: "https://kraviona.site/tools/jpg-to-webp",
  },
};

const faqs = [
  {
    question: "How much file size do I save by converting JPG to WebP?",
    answer:
      "According to Google's comparative compression benchmarks, WebP lossy images are 25% to 35% smaller than comparable JPEG images at equivalent SSIM quality index scores.",
  },
  {
    question: "Will WebP images display on iPhones and Safari?",
    answer:
      "Yes. Apple added full native WebP support in iOS 14 and macOS Big Sur (Safari 14+). Over 97% of all internet users worldwide use browsers that natively support WebP.",
  },
  {
    question: "Does using WebP improve my website's Google search rankings?",
    answer:
      "Yes. Lighter images load faster, directly boosting your Core Web Vitals metrics (such as Largest Contentful Paint - LCP), which Google uses as an official page experience ranking signal.",
  },
];

export default function JpgToWebpPage() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Kraviona JPG to WebP Converter",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "url": "https://kraviona.site/tools/jpg-to-webp",
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
          { label: "JPG to WebP", href: "/tools/jpg-to-webp" },
        ]}
      />

      <div className="intro">
        <p className="eyebrow">Image Converter</p>
        <h1>Convert JPG to WebP Online</h1>
        <p>
          Upgrade your website photos to next-generation WebP format. Shrink image weight, speed up mobile loading times, and improve Core Web Vitals.
        </p>
      </div>

      <ImageConverter initialTargetFormat="webp" />

      <section className="tool-guide-content">
        <h2>Why Upgrade JPG to Next-Gen WebP?</h2>
        <p>
          Google developed the WebP image format specifically to make the web faster and more efficient for modern users.
        </p>

        <div className="features-checklist">
          <div className="feature-item">
            <CheckCircle2 size={18} />
            <span><strong>Superior Compression Efficiency:</strong> Cut 30% to 70% of file weight while preserving razor-sharp details.</span>
          </div>
          <div className="feature-item">
            <CheckCircle2 size={18} />
            <span><strong>Faster Largest Contentful Paint (LCP):</strong> Deliver above-the-fold hero images in milliseconds to delight mobile visitors.</span>
          </div>
          <div className="feature-item">
            <CheckCircle2 size={18} />
            <span><strong>Reduced CDN Bandwidth Bills:</strong> Smaller assets mean lower data transfer costs for website publishers.</span>
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
            <Link href="/tools/png-to-webp">PNG to WebP Converter</Link>
            <Link href="/tools/webp-to-jpg">WebP to JPG Converter</Link>
            <Link href="/blog/webp-vs-jpg">WebP vs JPG Detailed Benchmark</Link>
            <Link href="/blog/image-optimization-for-seo">Image SEO Guide</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
