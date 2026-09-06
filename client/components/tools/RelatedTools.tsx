import Link from "next/link";
import { Tool } from "@/lib/tools-registry";
import { ArrowRight } from "lucide-react";
import ToolCard from "./ToolCard";

interface RelatedToolsProps {
  tools: Tool[];
}

export default function RelatedTools({ tools }: RelatedToolsProps) {
  if (!tools.length) return null;
  return (
    <section className="mt-12 pt-10 border-t border-gray-100">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">Related Tools</h2>
        <Link
          href="/tools"
          className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 font-medium"
        >
          All Tools <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  );
}
