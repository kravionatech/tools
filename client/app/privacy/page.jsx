import Breadcrumbs from "../../components/Breadcrumbs";
import { ShieldCheck, Lock, EyeOff } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Kraviona.site",
  description:
    "Learn how Kraviona protects your privacy: 100% in-browser image conversions, zero file uploads, and transparent domain lookup handling.",
  alternates: {
    canonical: "https://kraviona.site/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="page">
      <Breadcrumbs items={[{ label: "Privacy Policy", href: "/privacy" }]} />

      <div className="intro">
        <p className="eyebrow">Legal & Compliance</p>
        <h1>Privacy Policy</h1>
        <p>Last updated: September 2026</p>
      </div>

      <section className="legal-content">
        <h2>1. Our Privacy Commitment</h2>
        <p>
          At Kraviona (accessible from https://kraviona.site), one of our main priorities is the privacy of our visitors. This Privacy Policy document outlines the types of information that is collected and recorded by Kraviona and how we use it.
        </p>

        <h2>2. Image Processing & Local Conversion Guarantee</h2>
        <p>
          <strong>Kraviona does NOT upload, store, or view your images on remote servers.</strong> All image format conversions, resizing operations, and quality adjustments execute entirely within your client web browser sandbox using the HTML5 Canvas API. Your file bytes remain in your local device memory at all times.
        </p>

        <h2>3. Domain and SEO Checker Queries</h2>
        <p>
          When you enter a domain or URL into our DA / PA Checker or Domain Age lookup tool, the submitted domain string is sent to the Kraviona backend API solely for the technical purpose of querying authoritative public RDAP registries (such as ICANN, Verisign, or PIR) and authorized SEO providers. We do not correlate domain queries with your identity or sell search queries to third parties.
        </p>

        <h2>4. Log Files & Rate Limiting</h2>
        <p>
          Kraviona follows a standard procedure of utilizing log files. When visitors access our API, standard web server logs record anonymized IP addresses, browser user agent strings, and request timestamps solely for rate limiting, DDoS defense, and server health monitoring.
        </p>

        <h2>5. Cookies & Tracking</h2>
        <p>
          Kraviona does not deploy behavioral tracking cookies, cross-site tracking pixels, or intrusive ad networks.
        </p>

        <h2>6. Contact Information</h2>
        <p>
          If you have any questions or require more information about our Privacy Policy, do not hesitate to contact us at <strong>privacy@kraviona.site</strong>.
        </p>
      </section>
    </main>
  );
}
