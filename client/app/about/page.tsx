import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About Kraviona Tools",
  description:
    "Learn about Kraviona Tools — a platform of free, browser-based tools for SEO professionals, content writers, and digital marketers. No uploads, no accounts, instant results.",
  alternates: { canonical: absoluteUrl("/about") },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">About Kraviona Tools</h1>
      <div className="prose">
        <p className="text-gray-600 leading-relaxed mb-6">
          Kraviona Tools is a free platform of browser-based utilities built for SEO professionals,
          content writers, and digital marketers. Every tool on this site runs entirely in your
          browser using JavaScript and browser APIs — no file uploads, no server processing, no
          accounts required.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Why we built this</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Most online tools follow the same frustrating pattern: you upload a file, wait for server
          processing, deal with file size limits, and worry about where your data ends up. We built
          Kraviona Tools with a different philosophy — every tool that can be built to run in the
          browser, should run in the browser.
        </p>
        <p className="text-gray-600 leading-relaxed mb-6">
          That means your images, text, and personal data never leave your device. The tools are
          instant because there are no round-trips to a server. They work offline. They have no
          file size limits beyond your device&apos;s memory. And they are completely free.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">What we build (and what we don&apos;t)</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          We only build tools that actually work client-side without deception. For tools that
          genuinely require external APIs — like domain authority checkers, keyword search volume
          tools, or AI-powered rewriters — we list them honestly in our{" "}
          <a href="/upcoming" className="text-purple-600 hover:underline">
            Upcoming Tools
          </a>{" "}
          section instead of building fake versions with misleading results.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Privacy</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          We do not collect, process, or store your file content. Image files, text inputs, and
          tool outputs stay on your device. The only data we collect is standard anonymous
          analytics (page visits, tool usage) to understand which tools are most useful.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Contact</h2>
        <p className="text-gray-600 leading-relaxed">
          Have a question, found a bug, or want to suggest a tool? Visit our{" "}
          <a href="/contact" className="text-purple-600 hover:underline">
            contact page
          </a>
          .
        </p>
      </div>
    </div>
  );
}
