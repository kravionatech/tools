import Link from "next/link";
import { Tool } from "@/lib/tools-registry";
import { ArrowRight } from "lucide-react";

interface ToolCardProps {
  tool: Tool;
  size?: "sm" | "md" | "lg";
}

const categoryColors = {
  text: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-100", badge: "bg-blue-100 text-blue-700" },
  image: { bg: "bg-green-50", text: "text-green-700", border: "border-green-100", badge: "bg-green-100 text-green-700" },
  seo: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-100", badge: "bg-purple-100 text-purple-700" },
};

export default function ToolCard({ tool, size = "md" }: ToolCardProps) {
  const colors = categoryColors[tool.category];

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={`group block bg-white border border-gray-100 rounded-2xl hover:border-purple-200 hover:shadow-lg transition-all duration-200 ${
        size === "lg" ? "p-6" : size === "sm" ? "p-4" : "p-5"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex-shrink-0 rounded-xl flex items-center justify-center text-xl ${colors.bg} ${
            size === "lg" ? "w-14 h-14" : size === "sm" ? "w-10 h-10 text-base" : "w-12 h-12"
          }`}
        >
          {tool.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3
              className={`font-semibold text-gray-900 group-hover:text-purple-700 transition-colors leading-snug ${
                size === "lg" ? "text-base" : size === "sm" ? "text-sm" : "text-sm"
              }`}
            >
              {tool.name}
            </h3>
            {tool.popular && (
              <span className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                Popular
              </span>
            )}
          </div>
          <p className={`text-gray-500 leading-snug ${size === "sm" ? "text-xs" : "text-sm"}`}>
            {tool.shortDescription}
          </p>
          <div className="flex items-center justify-between mt-3">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors.badge}`}>
              {tool.category.charAt(0).toUpperCase() + tool.category.slice(1)}
            </span>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  );
}
