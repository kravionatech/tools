import type { Metadata } from "next";
import { toolsByCategory, categoryMeta } from "@/lib/tools-registry";
import ToolCard from "@/components/tools/ToolCard";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { absoluteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Image Tools — Convert, Compress & Resize Images Online",
  description:
    "12 free image tools that run in your browser: convert between JPG, PNG, WebP, compress images, resize, generate favicons, and more. No file uploads needed.",
  alternates: { canonical: absoluteUrl("/tools/image") },
};

export default function ImageToolsPage() {
  const imageTools = toolsByCategory.image;
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumb items={[{ label: "Tools", href: "/tools" }, { label: "Image Tools" }]} />
      <div className="mt-6 mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{categoryMeta.image.icon}</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Image Tools</h1>
        </div>
        <p className="text-gray-500 max-w-2xl">{categoryMeta.image.description}</p>
        <div className="mt-4 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-2.5 w-fit">
          🔒 All image processing happens locally in your browser. Files never leave your device.
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {imageTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}
