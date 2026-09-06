"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import KravionaLogo from "@/components/common/KravionaLogo";

const footerLinks = {
  "Text Tools": [
    { label: "Word Counter", href: "/tools/word-counter" },
    { label: "Text Case Converter", href: "/tools/text-case-converter" },
    { label: "Text Diff", href: "/tools/text-diff" },
    { label: "Markdown Previewer", href: "/tools/markdown-previewer" },
    { label: "Keyword Density", href: "/tools/keyword-density" },
    { label: "Lorem Ipsum", href: "/tools/lorem-ipsum" },
  ],
  "Image Tools": [
    { label: "Image Compressor", href: "/tools/image-compressor" },
    { label: "Image Resizer", href: "/tools/image-resizer" },
    { label: "JPG to WebP", href: "/tools/jpg-to-webp" },
    { label: "PNG to JPG", href: "/tools/png-to-jpg" },
    { label: "Favicon Generator", href: "/tools/favicon-generator" },
    { label: "Image to Base64", href: "/tools/image-to-base64" },
  ],
  "SEO Tools": [
    { label: "Meta Tag Generator", href: "/tools/meta-tag-generator" },
    { label: "SERP Preview", href: "/tools/serp-preview" },
    { label: "Schema Generator", href: "/tools/schema-generator" },
    { label: "Robots.txt Generator", href: "/tools/robots-txt-generator" },
    { label: "UTM Builder", href: "/tools/utm-builder" },
    { label: "XML Sitemap Generator", href: "/tools/xml-sitemap-generator" },
  ],
  Company: [
    { label: "All Tools", href: "/tools" },
    { label: "Upcoming Tools", href: "/upcoming" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
};

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold text-sm mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Privacy notice */}
        <div className="border-t border-gray-700 pt-8 mb-6">
          <div className="flex items-start gap-3 bg-gray-800 rounded-xl p-4">
            <span className="text-green-400 text-lg mt-0.5">🔒</span>
            <p className="text-sm text-gray-400">
              <strong className="text-gray-200">Your privacy is protected.</strong> All tools on
              Kraviona process files and text locally in your browser. We do not upload, store, or
              transmit your data to any server.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <KravionaLogo size="sm" inverted={true} />
          <p className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} Kraviona Tools. Free browser-based tools for professionals.
          </p>
          <div className="flex gap-4 text-sm">
            <Link href="/privacy" className="text-gray-500 hover:text-purple-400 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-purple-400 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
