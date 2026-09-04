import Link from "next/link";
import Breadcrumbs from "../../components/Breadcrumbs";
import { Mail, MessageSquare, HelpCircle, CheckCircle2, Globe } from "lucide-react";

export const metadata = {
  title: "Contact Kraviona — Support, Feedback & Inquiries",
  description:
    "Have questions, bug reports, or tool suggestions? Reach out to the Kraviona engineering and support team.",
  alternates: {
    canonical: "https://kraviona.site/contact",
  },
  openGraph: {
    title: "Contact Kraviona",
    description: "Get in touch with the Kraviona team for inquiries and feedback.",
    url: "https://kraviona.site/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="page">
      <Breadcrumbs items={[{ label: "Contact Us", href: "/contact" }]} />

      <div className="intro">
        <p className="eyebrow">Get in Touch</p>
        <h1>We'd love to hear your feedback.</h1>
        <p>
          Whether you have an idea for a new image tool, noticed an RDAP registry quirk, or want to report a bug, we welcome your feedback.
        </p>
      </div>

      <div className="cards" style={{ marginTop: "24px" }}>
        <div className="card">
          <Mail size={28} className="pillar-icon" />
          <h3>Email Support</h3>
          <p>For general inquiries, partnership questions, and bug reports:</p>
          <strong style={{ color: "var(--green)" }}>contact@kraviona.site</strong>
          <p style={{ fontSize: "0.85rem", marginTop: "8px" }}>Response time: within 24–48 business hours.</p>
        </div>

        <div className="card">
          <MessageSquare size={28} className="pillar-icon" />
          <h3>Feature Requests</h3>
          <p>Have a format converter or SEO check you'd like to see added?</p>
          <strong style={{ color: "var(--blue)" }}>feedback@kraviona.site</strong>
          <p style={{ fontSize: "0.85rem", marginTop: "8px" }}>We regularly review community requests for our roadmap.</p>
        </div>

        <div className="card">
          <HelpCircle size={28} className="pillar-icon" />
          <h3>Knowledge Base</h3>
          <p>Need answers on how domain metrics or image formats work?</p>
          <Link href="/blog" style={{ color: "var(--green)", fontWeight: 700 }}>
            Browse Guides & FAQs →
          </Link>
          <p style={{ fontSize: "0.85rem", marginTop: "8px" }}>Detailed documentation and best practice articles.</p>
        </div>
      </div>

      <section className="tool-guide-content" style={{ marginTop: "48px" }}>
        <h2>Frequently Asked Inquiries</h2>
        <div className="faq-accordion">
          <div className="faq-item">
            <h3>Can I suggest a new tool for Kraviona?</h3>
            <p>Yes! We actively expand our toolbox based on user requests for lightweight, privacy-focused utilities.</p>
          </div>
          <div className="faq-item">
            <h3>Do you offer commercial API access?</h3>
            <p>Our tools are built for browser usage. If you need programmatic SEO or bulk data access, please email our team.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
