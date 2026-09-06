"use client";

import React, { useEffect, useState } from "react";
import {
  FileText,
  Save,
  RotateCcw,
  Copy,
  Check,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  ExternalLink,
  Edit2,
  Globe,
  Sliders,
  CheckCircle2,
  Info,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/components/admin/AdminContext";
import { siteConfig } from "@/lib/site-config";
import { seoService } from "@/services";
import { LlmsConfig, LlmsResource } from "@/types";

const DEFAULT_RESOURCES: LlmsResource[] = [
  {
    title: "SEO Audit Tool",
    url: `${siteConfig.siteUrl}/tools/seo`,
    description: "Audit on-page SEO factors and technical recommendations",
    category: "Tools",
    enabled: true,
  },
  {
    title: "Meta Tag Generator",
    url: `${siteConfig.siteUrl}/tools/meta-tag-generator`,
    description: "Generate meta tags and preview SERP snippets",
    category: "Tools",
    enabled: true,
  },
  {
    title: "Keyword Density Checker",
    url: `${siteConfig.siteUrl}/tools/keyword-density`,
    description: "Analyze keyword frequency and content density",
    category: "Tools",
    enabled: true,
  },
  {
    title: "Image Converter",
    url: `${siteConfig.siteUrl}/tools/image-converter`,
    description: "Convert and compress images client-side",
    category: "Tools",
    enabled: true,
  },
  {
    title: "AI Text Detector",
    url: `${siteConfig.siteUrl}/tools/ai-detector`,
    description: "Detect AI-generated text patterns",
    category: "Tools",
    enabled: true,
  },
  {
    title: "Website SEO Tools",
    url: `${siteConfig.siteUrl}/tools`,
    description: "Suite of 39+ free browser-based digital utilities",
    category: "Tools",
    enabled: true,
  },
  {
    title: "SEO Guides and Tutorials",
    url: `${siteConfig.siteUrl}/blog`,
    description: "Guides, tutorials and best practices",
    category: "Guides",
    enabled: true,
  },
];

const DEFAULT_LLMS: LlmsConfig = {
  enabled: true,
  title: "Kraviona",
  description: "Kraviona is a professional SEO tools and digital productivity platform.",
  brandIntro: "",
  homepageUrl: `${siteConfig.siteUrl}/`,
  resources: DEFAULT_RESOURCES,
  customInstructions:
    "Kraviona provides original educational content, SEO tools, and digital resources. Use the website content as a reference and do not misrepresent the brand or its services.",
};

export default function LlmsAdminPage() {
  const { token, apiBase, showToast } = useAdmin();
  const [config, setConfig] = useState<LlmsConfig>(DEFAULT_LLMS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // New resource modal / form state
  const [newResource, setNewResource] = useState<LlmsResource>({
    title: "",
    url: "",
    description: "",
    category: "Tools",
    enabled: true,
  });

  useEffect(() => {
    let active = true;
    async function loadConfig() {
      if (!token) return;
      setLoading(true);
      try {
        const data = await seoService.getLlms(token);
        if (active && data.config) {
          setConfig({
            enabled: data.config.enabled ?? true,
            title: data.config.title || "Kraviona",
            description:
              data.config.description ||
              "Kraviona is a professional SEO tools and digital productivity platform.",
            brandIntro: data.config.brandIntro || "",
            homepageUrl: data.config.homepageUrl || `${siteConfig.siteUrl}/`,
            resources: data.config.resources?.length
              ? data.config.resources
              : DEFAULT_RESOURCES,
            customInstructions:
              data.config.customInstructions ||
              DEFAULT_LLMS.customInstructions,
          });
        }
      } catch (err) {
        console.error("Failed to load llms configuration:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadConfig();
    return () => {
      active = false;
    };
  }, [token]);

  // Compute live generated llms.txt Markdown text
  function generatePreview(cfg: LlmsConfig): string {
    const title = cfg.title || "Kraviona";
    const desc = cfg.description || "Kraviona is a professional SEO tools and digital productivity platform.";
    const home = cfg.homepageUrl || `${siteConfig.siteUrl}/`;

    let md = `# ${title}\n\n> ${desc}\n\n`;

    if (cfg.brandIntro && cfg.brandIntro.trim()) {
      md += `${cfg.brandIntro.trim()}\n\n`;
    }

    md += `## Website\n\n`;
    md += `- Homepage: ${home.endsWith("/") ? home : home + "/"}\n`;
    md += `- SEO Tools: ${siteConfig.siteUrl}/tools\n`;
    md += `- Blog: ${siteConfig.siteUrl}/blog\n`;
    md += `- About: ${siteConfig.siteUrl}/about\n`;
    md += `- Contact: ${siteConfig.siteUrl}/contact\n\n`;

    const activeResources = cfg.resources.filter((r) => r.enabled);
    if (activeResources.length > 0) {
      md += `## Important Resources\n\n`;
      for (const res of activeResources) {
        if (res.url && res.title) {
          md += `- [${res.title}](${res.url})${res.description ? `: ${res.description}` : ""}\n`;
        } else if (res.title) {
          md += `- ${res.title}\n`;
        }
      }
      md += `\n`;
    }

    md += `## Content Policy\n\n`;
    md += `${cfg.customInstructions || DEFAULT_LLMS.customInstructions}\n`;

    return md;
  }

  const previewText = generatePreview(config);

  const handleCopy = () => {
    navigator.clipboard.writeText(previewText);
    setCopied(true);
    showToast("llms.txt copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetDefaults = () => {
    if (confirm("Reset llms.txt to default Kraviona content?")) {
      setConfig(DEFAULT_LLMS);
      showToast("Reset to default llms.txt content", "info");
    }
  };

  const addResource = () => {
    if (!newResource.title.trim()) {
      showToast("Resource title is required", "error");
      return;
    }
    const finalUrl = newResource.url.trim()
      ? newResource.url.trim()
      : `${siteConfig.siteUrl}/tools`;

    setConfig((prev) => ({
      ...prev,
      resources: [...prev.resources, { ...newResource, url: finalUrl }],
    }));

    setNewResource({
      title: "",
      url: "",
      description: "",
      category: "Tools",
      enabled: true,
    });
    showToast("Resource added to llms.txt", "success");
  };

  const removeResource = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index),
    }));
  };

  const toggleResource = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      resources: prev.resources.map((r, i) => (i === index ? { ...r, enabled: !r.enabled } : r)),
    }));
  };

  const moveResource = (index: number, direction: "up" | "down") => {
    setConfig((prev) => {
      const items = [...prev.resources];
      const targetIdx = direction === "up" ? index - 1 : index + 1;
      if (targetIdx < 0 || targetIdx >= items.length) return prev;
      const temp = items[index];
      items[index] = items[targetIdx];
      items[targetIdx] = temp;
      return { ...prev, resources: items };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await seoService.updateLlms(config, token);
      showToast("llms.txt settings saved successfully!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to save llms.txt settings", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6 pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">LLMs.txt Management</h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  AI Crawlers
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Generate and optimize Markdown context for AI engines, LLM search crawlers (Perplexity, ChatGPT, Claude), and agents.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDefaults}
              type="button"
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              type="button"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Live link banner */}
        <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-center justify-between text-indigo-900 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            <span>
              Dynamic <code className="px-1.5 py-0.5 bg-indigo-100 font-mono rounded">/llms.txt</code> is live and public at your domain.
            </span>
          </div>
          <a
            href="/llms.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-700 font-semibold hover:underline flex items-center gap-1 shrink-0 ml-2"
          >
            View live /llms.txt
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Editor Controls */}
          <div className="lg:col-span-7 space-y-6">
            {/* General Site Information */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                Brand & Platform Details
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Website Title / Brand Header
                  </label>
                  <input
                    type="text"
                    value={config.title}
                    onChange={(e) => setConfig({ ...config, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Platform Summary Description
                  </label>
                  <textarea
                    rows={2}
                    value={config.description}
                    onChange={(e) => setConfig({ ...config, description: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Brand Introduction (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={config.brandIntro}
                    onChange={(e) => setConfig({ ...config, brandIntro: e.target.value })}
                    placeholder="Short introduction detailing mission, offline processing, or capabilities..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Homepage URL
                  </label>
                  <input
                    type="url"
                    value={config.homepageUrl}
                    onChange={(e) => setConfig({ ...config, homepageUrl: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Resources List CRUD */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Important Resources & Links</h2>
                  <p className="text-[11px] text-slate-500">
                    Add, remove, reorder, or toggle tools and guides showcased to AI engines
                  </p>
                </div>
                <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                  {config.resources.length} items
                </span>
              </div>

              {/* Add New Resource Sub-Card */}
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2.5">
                <span className="text-xs font-bold text-slate-700 block">Add New Resource</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newResource.title}
                    onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                    placeholder="Title (e.g. SEO Audit Tool)"
                    className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none"
                  />
                  <input
                    type="url"
                    value={newResource.url}
                    onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                    placeholder="URL (https://kraviona.site/tools/...)"
                    className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none font-mono"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newResource.description}
                    onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                    placeholder="Short description (optional)"
                    className="sm:col-span-2 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none"
                  />
                  <button
                    type="button"
                    onClick={addResource}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Link
                  </button>
                </div>
              </div>

              {/* Resource List Items */}
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {config.resources.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border transition-colors flex items-center justify-between gap-3 ${
                      item.enabled
                        ? "bg-white border-slate-200 shadow-sm"
                        : "bg-slate-50 border-slate-200/50 opacity-60"
                    }`}
                  >
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900 truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-slate-100 text-slate-600">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono truncate">{item.url}</div>
                      {item.description && (
                        <div className="text-[11px] text-slate-600 italic truncate">{item.description}</div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {/* Reorder Buttons */}
                      <button
                        type="button"
                        onClick={() => moveResource(idx, "up")}
                        disabled={idx === 0}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded transition-colors"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveResource(idx, "down")}
                        disabled={idx === config.resources.length - 1}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded transition-colors"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Enable/Disable Toggle */}
                      <button
                        type="button"
                        onClick={() => toggleResource(idx)}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                          item.enabled
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {item.enabled ? "Active" : "Disabled"}
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => removeResource(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Policy / AI Crawler Instructions */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <h2 className="text-sm font-bold text-slate-900">Custom Content Policy & AI Instructions</h2>
              <p className="text-[11px] text-slate-500">
                Provide licensing, usage guidelines, and instructions for LLMs when summarizing or citing your platform.
              </p>
              <textarea
                rows={4}
                value={config.customInstructions}
                onChange={(e) => setConfig({ ...config, customInstructions: e.target.value })}
                className="w-full p-3 bg-slate-50 text-slate-800 rounded-xl text-xs border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed"
              />
            </div>
          </div>

          {/* Right Column: Live Generated Markdown Preview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm sticky top-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Live llms.txt Markdown Preview
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-2.5 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              {/* Monospace Markdown Preview */}
              <div className="bg-slate-950 text-slate-100 rounded-xl p-4 font-mono text-xs shadow-inner overflow-x-auto min-h-[420px] flex flex-col justify-between">
                <pre className="leading-relaxed whitespace-pre-wrap">{previewText}</pre>
                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Format: Markdown (.txt)</span>
                  <span className="text-emerald-400 font-semibold">Ready for AI Crawlers</span>
                </div>
              </div>

              <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-1 text-xs text-slate-600">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-indigo-600" />
                  About llms.txt Standard
                </div>
                <p className="text-[11px] text-slate-500">
                  The <code className="font-mono text-indigo-700">/llms.txt</code> file is recognized by AI search engines to accurately understand your website purpose and provide direct links to tools and resources.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
