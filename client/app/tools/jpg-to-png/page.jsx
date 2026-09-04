import Link from "next/link";
import ImageConverter from "../../../components/ImageConverter";
import Breadcrumbs from "../../../components/Breadcrumbs";
import JsonLd from "../../../components/JsonLd";
import { CheckCircle2, ArrowRight } from "lucide-react";

export const metadata = {
  title: "JPG to PNG Converter — Free, Fast & Lossless Online Tool",
  description:
    "Convert JPG images to high-quality PNG format online for free. 100% private in-browser conversion, custom resizing, and zero server uploads.",
  alternates: {
    canonical: "https://kraviona.site/tools/jpg-to-png",
  },
  openGraph: {
    title: "JPG to PNG Converter | Kraviona",
    description: "Convert JPG photos to PNG format privately in your browser.",
    url: "https://kraviona.site/tools/jpg-to-png",
  },
};

const faqs = [
  {
    question: "Does converting JPG to PNG automatically make the background transparent?",
    answer:
      "No. Standard JPG images do not store alpha transparency channels. Converting a JPG to PNG saves the image in a lossless container that supports transparency, but existing background colors remain until edited with a background removal tool.",
  },
  {
    question: "Why is the converted PNG file sometimes larger than the original JPG?",
    answer:
      "JPG uses lossy compression that permanently discards subtle color nuances to minimize file size. PNG uses lossless DEFLATE compression that preserves every pixel with 100% fidelity, which often requires more storage bytes.",
  },
  {
    question: "Are my images uploaded to a remote server?",
    answer:
      "No. Kraviona converts your images locally within your browser using HTML5 Canvas. Your files never touch our servers or leave your device.",
  },
];

export default function JpgToPngPage() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Kraviona JPG to PNG Converter",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "url": "https://kraviona.site/tools/jpg-to-png",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
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
          { label: "JPG to PNG", href: "/tools/jpg-to-png" },
        ]}
      />

      <div className="intro">
        <p className="eyebrow">Image Converter</p>
        <h1>Convert JPG to PNG Online</h1>
        <p>
          Transform JPEG photos into crisp, lossless PNG images instantly. Adjust dimensions, lock aspect ratios, and download with zero quality loss.
        </p>
      </div>

      <ImageConverter initialTargetFormat="png" />

      {/* Guide Content */}
      <section className="tool-guide-content">
        <h2>Why Convert from JPG to PNG?</h2>
        <p>
          JPG (JPEG) is the world's most ubiquitous photo format, but its lossy compression causes visual degradation every time the file is re-saved. 
          Converting to <strong>PNG (Portable Network Graphics)</strong> allows you to:
        </p>

        <div className="features-checklist">
          <div className="feature-item">
            <CheckCircle2 size={18} />
            <span><strong>Preserve Detail:</strong> Prevent additional compression artifacts during editing or graphic design workflows.</span>
          </div>
          <div className="feature-item">
            <CheckCircle2 size={18} />
            <span><strong>Prepare for Transparency:</strong> Prepare graphics for transparent overlays, logos, and UI asset pipelines.</span>
          </div>
          <div className="feature-item">
            <CheckCircle2 size={18} />
            <span><strong>Crisp Text & Line Art:</strong> Eliminate fuzzy JPG compression halos around text and sharp boundaries.</span>
          </div>
        </div>

        <h2>How to Convert JPG to PNG in 3 Easy Steps</h2>
        <ol className="step-list">
          <li><strong>Upload your image:</strong> Drag and drop your JPG file into the dropzone above or click to browse your device.</li>
          <li><strong>Configure optional settings:</strong> Target format is automatically set to PNG. Adjust custom width or height if you wish to resize.</li>
          <li><strong>Convert & Download:</strong> Click "Convert to PNG" and instantly save your new lossless image file.</li>
        </ol>

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

        {/* Related Tools & Articles */}
        <div className="related-links-bar">
          <h3>Related Image Converters & Guides</h3>
          <div className="tag-links">
            <Link href="/tools/png-to-jpg">PNG to JPG Converter</Link>
            <Link href="/tools/jpg-to-webp">JPG to WebP Converter</Link>
            <Link href="/tools/png-to-webp">PNG to WebP Converter</Link>
            <Link href="/blog/webp-vs-jpg">WebP vs JPG Guide</Link>
            <Link href="/blog/image-optimization-for-seo">Image SEO Guide</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
