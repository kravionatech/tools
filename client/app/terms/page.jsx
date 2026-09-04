import Breadcrumbs from "../../components/Breadcrumbs";

export const metadata = {
  title: "Terms of Service | Kraviona.site",
  description: "Terms and conditions for utilizing Kraviona's web tools and educational guides.",
  alternates: {
    canonical: "https://kraviona.site/terms",
  },
};

export default function TermsPage() {
  return (
    <main className="page">
      <Breadcrumbs items={[{ label: "Terms of Service", href: "/terms" }]} />

      <div className="intro">
        <p className="eyebrow">Legal & Compliance</p>
        <h1>Terms of Service</h1>
        <p>Last updated: September 2026</p>
      </div>

      <section className="legal-content">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using Kraviona (https://kraviona.site), you agree to comply with and be bound by these Terms of Service. If you disagree with any part of these terms, please discontinue use of the website.
        </p>

        <h2>2. Permitted Use & Fair Usage</h2>
        <p>
          You agree to use Kraviona tools solely for lawful purposes. You agree not to attempt to flood, overload, or bypass rate limits on our API services or deploy automated scraping bots against our endpoints.
        </p>

        <h2>3. Disclaimer of Warranties & SEO Metrics</h2>
        <p>
          All tools and content on Kraviona are provided on an "as is" and "as available" basis without warranties of any kind. Domain Authority and Page Authority are proprietary comparison metrics developed by Moz, not Google ranking factors. Kraviona makes no guarantee that utilizing these metrics or optimizing images will result in specific search engine rankings or traffic outcomes.
        </p>

        <h2>4. Limitation of Liability</h2>
        <p>
          In no event shall Kraviona, its developers, or affiliates be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our tools or rely on our content.
        </p>

        <h2>5. Modifications</h2>
        <p>
          We reserve the right to modify these terms at any time. Continued use of the platform after updates indicates your acceptance of revised terms.
        </p>
      </section>
    </main>
  );
}
