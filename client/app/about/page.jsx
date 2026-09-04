import Link from "next/link";
import Breadcrumbs from "../../components/Breadcrumbs";
import { ShieldCheck, Zap, Heart, CheckCircle2, Lock, ArrowRight } from "lucide-react";

export const metadata = {
  title: "About Kraviona — Privacy-First Web Utilities & SEO Intelligence",
  description:
    "Learn about Kraviona's mission to provide honest SEO analytics, zero-upload private image tools, and clear webmaster guides.",
  alternates: {
    canonical: "https://kraviona.site/about",
  },
  openGraph: {
    title: "About Kraviona | Engineering Integrity & Privacy",
    description: "Our mission to provide transparent tools without data collection or fake scores.",
    url: "https://kraviona.site/about",
  },
};

export default function AboutPage() {
  return (
    <main className="page">
      <Breadcrumbs items={[{ label: "About Us", href: "/about" }]} />

      <div className="intro">
        <p className="eyebrow">Our Mission</p>
        <h1>Tools with their limits and values in plain sight.</h1>
        <p>
          Kraviona was built to solve a simple frustration: online utilities that bombard users with ads, capture private files onto remote servers, and invent fake SEO metrics to generate traffic.
        </p>
      </div>

      <section className="about-grid">
        <div className="card">
          <ShieldCheck size={28} className="pillar-icon" />
          <h2>Privacy by Architecture</h2>
          <p>
            When you use our Image Converters, your files never leave your computer. We utilize the HTML5 Canvas API in modern web browsers to encode, decode, and compress images directly in device memory. No cloud storage, no temporary server files, no surveillance.
          </p>
        </div>

        <div className="card">
          <Lock size={28} className="pillar-icon" />
          <h2>Metric Truthfulness</h2>
          <p>
            Many SEO sites generate random numbers for "Domain Authority" because they know visitors love seeing high scores. Kraviona refuses to participate in metric fabrication. If a licensed provider is connected, we show live data. If not, we tell you honestly.
          </p>
        </div>

        <div className="card">
          <Zap size={28} className="pillar-icon" />
          <h2>High-Velocity Engineering</h2>
          <p>
            Every page is statically optimized with Next.js to load within milliseconds worldwide. We respect your time and device battery life, eliminating bloated tracker scripts and unnecessary dependencies.
          </p>
        </div>
      </section>

      <section className="about-story" style={{ marginTop: "48px" }}>
        <h2>The Kraviona Standard</h2>
        <p>
          Whether you are an independent creator trying to pass Core Web Vitals, a digital marketer evaluating potential backlink targets, or a developer resizing assets for a web application, Kraviona gives you fast, truthful results without artificial friction.
        </p>

        <div className="actions" style={{ marginTop: "24px" }}>
          <Link href="/tools" className="button">
            Explore All Tools <ArrowRight size={16} style={{ marginLeft: "6px" }} />
          </Link>
          <Link href="/contact" className="button alt">
            Get in Touch
          </Link>
        </div>
      </section>
    </main>
  );
}
