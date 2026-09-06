import type { Metadata } from "next";
import { upcomingTools } from "@/lib/tools-registry";
import { absoluteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Upcoming Tools — Features Planned for Future Versions",
  description:
    "See which tools are planned for future versions of Kraviona. These tools require external APIs or backend services and will be added once integrations are available.",
  alternates: { canonical: absoluteUrl("/upcoming") },
};

const categoryLabels: Record<string, string> = {
  seo: "SEO",
  text: "Text",
  image: "Image",
  ai: "AI",
};

const categoryColors: Record<string, string> = {
  seo: "bg-purple-100 text-purple-700",
  text: "bg-blue-100 text-blue-700",
  image: "bg-green-100 text-green-700",
  ai: "bg-orange-100 text-orange-700",
};

export default function UpcomingToolsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 text-sm text-amber-700 font-medium mb-4">
          🚧 Coming Soon
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Upcoming Tools</h1>
        <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
          These tools are planned for future versions of Kraviona. They require external APIs,
          databases, or backend services to work properly. Rather than build fake functionality, we
          list them here honestly so you know what&apos;s on the roadmap.
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-start gap-3">
        <span className="text-lg">⚠️</span>
        <p className="text-sm text-amber-800">
          <strong>Why aren&apos;t these live yet?</strong> Each of these tools requires real-time
          access to external data sources — Moz API for domain metrics, Google Ads API for search
          volumes, live SERP crawling for rank tracking, or a large language model for AI features.
          We do not build tools that display fake or misleading results.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {upcomingTools.map((tool) => (
          <div
            key={tool.name}
            className="bg-white border border-gray-100 rounded-2xl p-6 relative"
          >
            <div className="absolute top-4 right-4">
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                Upcoming
              </span>
            </div>
            <div className="text-3xl mb-3">{tool.icon}</div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="font-bold text-gray-900 text-base">{tool.name}</h2>
            </div>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[tool.category] || "bg-gray-100 text-gray-600"}`}
            >
              {categoryLabels[tool.category] || tool.category}
            </span>
            <p className="text-sm text-gray-600 mt-3 mb-3 leading-relaxed">
              {tool.description}
            </p>
            <div className="border-t border-gray-50 pt-3">
              <p className="text-xs text-gray-400 leading-relaxed">
                <strong className="text-gray-500">Why it requires an API: </strong>
                {tool.whyUseful}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
