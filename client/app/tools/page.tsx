import type { Metadata } from "next";
import Link from "next/link";
import { tools, toolsByCategory, categoryMeta } from "@/lib/tools-registry";
import ToolCard from "@/components/tools/ToolCard";
import { absoluteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "All Free Online Tools — SEO, Image & Text",
  description:
    "Browse all 39 free browser-based tools for SEO, image conversion, and text analysis. No uploads, no accounts, instant results.",
  alternates: { canonical: absoluteUrl("/tools") },
};

export default function AllToolsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">All Tools</h1>
        <p className="text-gray-500">
          {tools.length} free browser-based tools for SEO, content writing, and digital marketing.
          All tools run locally in your browser — no uploads, no accounts.
        </p>
      </div>

      {/* Category sections */}
      {(["text", "image", "seo"] as const).map((cat) => {
        const meta = categoryMeta[cat];
        const categoryTools = toolsByCategory[cat];
        return (
          <section key={cat} className="mb-14">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{meta.icon}</span>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{meta.name}</h2>
                  <p className="text-sm text-gray-500">{categoryTools.length} tools</p>
                </div>
              </div>
              <Link
                href={`/tools/${cat}`}
                className="text-sm text-purple-600 hover:text-purple-800 font-medium"
              >
                View Category →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categoryTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
