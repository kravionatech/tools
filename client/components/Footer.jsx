import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-col brand-col">
          <Link className="footer-brand" href="/">
            <span className="brand-logo">K</span>
            <span className="brand-text">Kraviona</span>
          </Link>
          <p className="footer-desc">
            Privacy-first web utilities, transparent SEO checks, and high-quality educational guides designed for website owners, developers, and digital marketers.
          </p>
          <div className="footer-badge">
            <ShieldCheck size={16} />
            <span>100% In-Browser Image Processing</span>
          </div>
        </div>

        <div className="footer-col">
          <p className="footer-title">SEO Tools</p>
          <ul className="footer-links">
            <li>
              <Link href="/seo-tools/domain-authority-checker">DA / PA Checker</Link>
            </li>
            <li>
              <Link href="/seo-tools/domain-authority-checker">Domain Age Lookup</Link>
            </li>
            <li>
              <Link href="/seo-tools">All SEO Utilities</Link>
            </li>
            <li>
              <Link href="/blog/what-is-domain-authority">What is Domain Authority?</Link>
            </li>
            <li>
              <Link href="/blog/da-vs-pa">DA vs PA Guide</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <p className="footer-title">Image Converters</p>
          <ul className="footer-links">
            <li>
              <Link href="/tools/image-converter">Universal Image Converter</Link>
            </li>
            <li>
              <Link href="/tools/jpg-to-png">Convert JPG to PNG</Link>
            </li>
            <li>
              <Link href="/tools/png-to-jpg">Convert PNG to JPG</Link>
            </li>
            <li>
              <Link href="/tools/webp-to-jpg">Convert WebP to JPG</Link>
            </li>
            <li>
              <Link href="/tools/jpg-to-webp">Convert JPG to WebP</Link>
            </li>
            <li>
              <Link href="/tools/png-to-webp">Convert PNG to WebP</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <p className="footer-title">Platform & Legal</p>
          <ul className="footer-links">
            <li>
              <Link href="/blog">Helpful Guides</Link>
            </li>
            <li>
              <Link href="/about">About Kraviona</Link>
            </li>
            <li>
              <Link href="/contact">Contact Support</Link>
            </li>
            <li>
              <Link href="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms">Terms of Service</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {year} Kraviona.site — Built with integrity, transparency, and speed.</p>
        <p className="footer-note">All image conversions occur locally in your browser. No files are uploaded.</p>
      </div>
    </footer>
  );
}
