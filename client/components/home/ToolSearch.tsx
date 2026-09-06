"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { tools } from "@/lib/tools-registry";
import ToolCard from "@/components/tools/ToolCard";

export default function ToolSearch() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.shortDescription.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.includes(q))
    );
  }, [query]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools — try &quot;image&quot;, &quot;meta tag&quot;, &quot;word counter&quot;..."
          className="w-full pl-12 pr-4 py-4 text-base rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none shadow-sm transition-colors bg-white"
        />
      </div>
      {query && (
        <div className="mt-4">
          {results.length > 0 ? (
            <>
              <p className="text-sm text-gray-500 mb-3">
                {results.length} tool{results.length !== 1 ? "s" : ""} found
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} size="sm" />
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-400 mt-3 text-center">
              No tools found for &ldquo;{query}&rdquo;
            </p>
          )}
        </div>
      )}
    </div>
  );
}
