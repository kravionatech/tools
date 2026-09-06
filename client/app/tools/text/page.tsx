import type { Metadata } from "next";
import { toolsByCategory, categoryMeta } from "@/lib/tools-registry";
import ToolCard from "@/components/tools/ToolCard";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { absoluteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Text Tools — Word Counter, Case Converter, Diff & More",
  description:
    "17 free text tools for writers and content professionals: word counter, case converter, text diff, markdown preview, keyword density, lorem ipsum, and more.",
  alternates: { canonical: absoluteUrl("/tools/text") },
};

export default function TextToolsPage() {
  const textTools = toolsByCategory.text;
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumb items={[{ label: "Tools", href: "/tools" }, { label: "Text Tools" }]} />
      <div className="mt-6 mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{categoryMeta.text.icon}</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Text Tools</h1>
        </div>
        <p className="text-gray-500 max-w-2xl">{categoryMeta.text.description}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {textTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}
