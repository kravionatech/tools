import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Zap, Shield, Globe, Clock } from "lucide-react";
import { tools, featuredTools, popularTools, toolsByCategory, upcomingTools } from "@/lib/tools-registry";
import ToolCard from "@/components/tools/ToolCard";
import ToolSearch from "@/components/home/ToolSearch";
import { siteConfig, absoluteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Kraviona Tools — Free Online Tools for SEO, Images & Text",
  description:
    "39 free browser-based tools for SEO, content writing, and digital marketing. Convert images, analyze text, generate meta tags, build sitemaps — all without uploading files.",
  alternates: { canonical: siteConfig.siteUrl },
};

const categories = [
  {
    key: "text",
    name: "Text Tools",
    href: "/tools/text",
    icon: "📝",
    count: toolsByCategory.text.length,
    description: "Word counters, case converters, text diff, markdown preview, keyword density, and more.",
    color: "from-blue-50 to-blue-100 border-blue-200",
    textColor: "text-blue-700",
  },
  {
    key: "image",
    name: "Image Tools",
    href: "/tools/image",
    icon: "🖼️",
    count: toolsByCategory.image.length,
    description: "Convert, compress, and resize images in any format. Files never leave your browser.",
    color: "from-green-50 to-green-100 border-green-200",
    textColor: "text-green-700",
  },
  {
    key: "seo",
    name: "SEO Tools",
    href: "/tools/seo",
    icon: "🔍",
    count: toolsByCategory.seo.length,
    description: "Meta tags, SERP preview, robots.txt, schema generators, and more on-page SEO tools.",
    color: "from-purple-50 to-purple-100 border-purple-200",
    textColor: "text-purple-700",
  },
];

const features = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "100% Private",
    description:
      "Every tool runs entirely in your browser. No files are uploaded, stored, or transmitted to any server. Your data stays on your device.",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Instant Results",
    description:
      "No sign-up, no waiting, no queues. Open a tool, use it, get your result. It's that simple — every time.",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Works Everywhere",
    description:
      "Fully responsive on desktop, tablet, and mobile. All tools work in any modern browser with no installation required.",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Always Free",
    description:
      "No subscriptions, no credits, no paywalls. Every tool is free to use without limits, now and in the future.",
  },
];

const faqs = [
  {
    q: "Do you upload my files to a server?",
    a: "No. Every tool on Kraviona processes files and text entirely within your browser using JavaScript and browser APIs like Canvas and FileReader. Your data never leaves your device.",
  },
  {
    q: "Do I need to create an account?",
    a: "No account is required for any tool. Open a tool, use it, and leave. There is no sign-up, no login, and no personal information needed.",
  },
  {
    q: "Are these tools really free?",
    a: "Yes, completely free. All 39 tools are available without limits, subscriptions, or paywalls.",
  },
  {
    q: "What are 'Upcoming Tools'?",
    a: "Some tools — like domain authority checkers, AI rewriters, and backlink analyzers — require external APIs or backend services to work properly. Instead of building fake versions, we list them honestly in the Upcoming Tools section.",
  },
  {
    q: "Can I use Kraviona Tools on mobile?",
    a: "Yes. Every tool is designed to be fully usable on mobile, tablet, and desktop. The responsive layout adapts to any screen size.",
  },
  {
    q: "How accurate are the text analysis tools?",
    a: "The text tools — word counter, readability score, keyword density — use the same algorithms as industry-standard tools. They are accurate for English text and useful for most SEO and content writing workflows.",
  },
];

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.siteName + " Tools",
    url: siteConfig.siteUrl,
    description:
      "Free browser-based tools for SEO, content writing, and digital marketing.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.siteUrl}/tools?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50 to-white pt-16 pb-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full opacity-40 translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 rounded-full opacity-30 -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-full px-4 py-1.5 text-sm text-purple-700 font-medium mb-6">
            <Zap className="w-3.5 h-3.5" /> {tools.length} tools — all free, no account needed
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-5">
            Professional tools for{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #6c3ce1, #8b5cf6)" }}>
              SEO, images & text
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Convert images, analyze text, generate meta tags, build sitemaps, and check keyword
            density — directly in your browser. No uploads, no accounts, no waiting.
          </p>
          <ToolSearch />
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6 text-sm text-gray-400">
            <span>Popular:</span>
            {popularTools.slice(0, 5).map((t) => (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}`}
                className="px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-700 transition-colors"
              >
                {t.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Browse by Category</h2>
            <p className="text-gray-500">Choose the type of tool you need</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.key}
                href={cat.href}
                className={`group block p-6 rounded-2xl border bg-gradient-to-br ${cat.color} hover:shadow-lg transition-all duration-200`}
              >
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h3 className={`text-xl font-bold mb-1 ${cat.textColor}`}>{cat.name}</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{cat.description}</p>
                <div className={`flex items-center gap-1 text-sm font-semibold ${cat.textColor}`}>
                  {cat.count} tools <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED TOOLS ───────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Featured Tools</h2>
              <p className="text-gray-500 text-sm">Hand-picked essentials for your workflow</p>
            </div>
            <Link
              href="/tools"
              className="flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-800"
            >
              All Tools <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY KRAVIONA ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Built for professionals, free for everyone
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Every tool is designed around a simple principle: it should do exactly what it says,
              instantly, without any friction.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-100 text-purple-600 mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">How it works</h2>
          <p className="text-gray-500 mb-12">Three steps, every time.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Choose a tool", desc: "Browse by category or search for the exact tool you need." },
              { step: "2", title: "Enter your input", desc: "Paste text, upload a file, or fill in the form fields. Everything runs instantly." },
              { step: "3", title: "Copy or download", desc: "Copy the output to clipboard or download the result. Done." },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full text-white font-bold text-lg flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg, #6c3ce1, #8b5cf6)" }}>
                  {s.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── UPCOMING TOOLS PREVIEW ───────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Upcoming Tools</h2>
              <p className="text-gray-500 text-sm">Coming soon — tools that require external APIs</p>
            </div>
            <Link
              href="/upcoming"
              className="flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-800"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {upcomingTools.slice(0, 4).map((tool) => (
              <div key={tool.name} className="relative bg-gray-50 border border-gray-100 rounded-2xl p-5 opacity-75">
                <div className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                  Coming Soon
                </div>
                <div className="text-2xl mb-2">{tool.icon}</div>
                <h3 className="font-semibold text-gray-700 text-sm mb-1">{tool.name}</h3>
                <p className="text-xs text-gray-400 leading-snug">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #6c3ce1, #8b5cf6)" }}
            >
              Explore All {tools.length} Tools <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
