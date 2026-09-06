import type { Metadata } from "next";
import { toolsByCategory, categoryMeta } from "@/lib/tools-registry";
import ToolCard from "@/components/tools/ToolCard";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { absoluteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "SEO Tools — Meta Tags, SERP Preview, Schema Generator & More",
  description:
    "10 free client-side SEO tools: generate meta tags, preview SERP results, build robots.txt, create XML sitemaps, generate schema markup, and more.",
  alternates: { canonical: absoluteUrl("/tools/seo") },
};

export default function SEOToolsPage() {
  const seoTools = toolsByCategory.seo;
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumb items={[{ label: "Tools", href: "/tools" }, { label: "SEO Tools" }]} />
      <div className="mt-6 mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{categoryMeta.seo.icon}</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">SEO Tools</h1>
        </div>
        <p className="text-gray-500 max-w-2xl">{categoryMeta.seo.description}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {seoTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}
