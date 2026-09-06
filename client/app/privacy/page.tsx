import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy — Kraviona Tools",
  description: "Read the Kraviona Tools privacy policy. We process all files and text locally in your browser and do not collect or transmit your personal data.",
  alternates: { canonical: absoluteUrl("/privacy") },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

      <div className="prose">
        <p className="text-gray-600 mb-6 leading-relaxed">
          Kraviona Tools is built around one core commitment: your data stays on your device. This Privacy Policy explains what we collect, what we don&apos;t collect, and how we use any information we do receive.
        </p>

        <h2>1. Data Processed Locally</h2>
        <p>
          All tool functionality on Kraviona — including image conversion, text analysis, keyword density checking, and SEO tool outputs — runs entirely within your browser using JavaScript. We do not receive, process, or store any of the files, text, or other inputs you provide to any tool.
        </p>

        <h2>2. Analytics</h2>
        <p>
          We may collect anonymous usage analytics including page views, which tools are used, and general geographic region. This data is aggregated and cannot identify individual users. It is used solely to improve the platform.
        </p>

        <h2>3. Cookies</h2>
        <p>
          We do not use tracking cookies or third-party advertising cookies. We may use session cookies for basic site functionality only.
        </p>

        <h2>4. Third-Party Services</h2>
        <p>
          We do not sell, share, or transmit your data to third parties. Our tools do not make API calls with your content to any external service.
        </p>

        <h2>5. Children&apos;s Privacy</h2>
        <p>
          Kraviona Tools does not knowingly collect personal information from children under 13. If you believe a child has provided personal information, please contact us.
        </p>

        <h2>6. Changes to This Policy</h2>
        <p>
          We may update this policy periodically. Any changes will be reflected on this page with an updated date.
        </p>

        <h2>7. Contact</h2>
        <p>
          If you have questions about this Privacy Policy, contact us at{" "}
          <a href="mailto:hello@kraviona.site" className="text-purple-600 hover:underline">hello@kraviona.site</a>.
        </p>
      </div>
    </div>
  );
}
