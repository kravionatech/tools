"use client";

import React, { useEffect, useState } from "react";
import {
  Bot,
  Save,
  RotateCcw,
  Copy,
  Check,
  ShieldAlert,
  AlertTriangle,
  Plus,
  Trash2,
  ExternalLink,
  Info,
  CheckCircle2,
  FileCode,
  Globe,
  Sliders,
  Sparkles,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/components/admin/AdminContext";
import { siteConfig } from "@/lib/site-config";
import { seoService } from "@/services";
import { RobotsConfig } from "@/types";

const DEFAULT_RECOMMENDED: RobotsConfig = {
  enabled: true,
  allowIndexing: true,
  blockAllCrawlers: false,
  allowRules: ["/"],
  disallowRules: ["/admin/", "/api/admin/", "/dashboard/", "/login/", "/private/"],
  sitemapUrl: `${siteConfig.siteUrl}/sitemap.xml`,
  customDirectives: "",
};

export default function RobotsAdminPage() {
  const { token, showToast } = useAdmin();
  const [config, setConfig] = useState<RobotsConfig>(DEFAULT_RECOMMENDED);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [newAllowRule, setNewAllowRule] = useState("");
  const [newDisallowRule, setNewDisallowRule] = useState("");
  const [showBlockConfirmModal, setShowBlockConfirmModal] = useState(false);
  const [pendingBlockChoice, setPendingBlockChoice] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadConfig() {
      if (!token) return;
      setLoading(true);
      try {
        const data = await seoService.getRobots(token);
        if (active && data.config) {
          setConfig({
            enabled: data.config.enabled ?? true,
            allowIndexing: data.config.allowIndexing ?? true,
            blockAllCrawlers: Boolean(data.config.blockAllCrawlers),
            allowRules: data.config.allowRules || ["/"],
            disallowRules: data.config.disallowRules || [
              "/admin/",
              "/api/admin/",
              "/dashboard/",
              "/login/",
              "/private/",
            ],
            sitemapUrl: data.config.sitemapUrl || `${siteConfig.siteUrl}/sitemap.xml`,
            customDirectives: data.config.customDirectives || "",
          });
        }
      } catch (err) {
        console.error("Failed to load robots configuration:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadConfig();
    return () => {
      active = false;
    };
  }, [token]);

  // Compute live generated robots.txt text
  function generatePreview(cfg: RobotsConfig): string {
    if (cfg.blockAllCrawlers || !cfg.allowIndexing) {
      return `# Robots.txt - ALL SEARCH ENGINE CRAWLERS BLOCKED\nUser-agent: *\nDisallow: /\n`;
    }

    let text = `User-agent: *\n`;
    const allows = cfg.allowRules.length > 0 ? cfg.allowRules : ["/"];
    for (const rule of allows) {
      if (rule.trim()) text += `Allow: ${rule.trim()}\n`;
    }

    for (const rule of cfg.disallowRules) {
      if (rule.trim()) text += `Disallow: ${rule.trim()}\n`;
    }

    if (cfg.customDirectives && cfg.customDirectives.trim()) {
      text += `\n# Custom Directives\n${cfg.customDirectives.trim()}\n`;
    }

    const sitemap = cfg.sitemapUrl && cfg.sitemapUrl.trim() ? cfg.sitemapUrl.trim() : `${siteConfig.siteUrl}/sitemap.xml`;
    text += `\nSitemap: ${sitemap}\n`;
    return text;
  }

  const previewText = generatePreview(config);

  const handleCopy = () => {
    navigator.clipboard.writeText(previewText);
    setCopied(true);
    showToast("Robots.txt content copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBlockAllToggle = (checked: boolean) => {
    if (checked) {
      // Require confirmation
      setPendingBlockChoice(true);
      setShowBlockConfirmModal(true);
    } else {
      setConfig((prev) => ({ ...prev, blockAllCrawlers: false, allowIndexing: true }));
    }
  };

  const confirmBlockAll = () => {
    setConfig((prev) => ({ ...prev, blockAllCrawlers: true, allowIndexing: false }));
    setShowBlockConfirmModal(false);
    showToast("Emergency 'Block all crawlers' mode active", "warning");
  };

  const addAllowRule = () => {
    const trimmed = newAllowRule.trim();
    if (!trimmed) return;
    const rule = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    if (!config.allowRules.includes(rule)) {
      setConfig((prev) => ({ ...prev, allowRules: [...prev.allowRules, rule] }));
      setNewAllowRule("");
    }
  };

  const removeAllowRule = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      allowRules: prev.allowRules.filter((_, i) => i !== index),
    }));
  };

  const addDisallowRule = () => {
    const trimmed = newDisallowRule.trim();
    if (!trimmed) return;
    const rule = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    if (!config.disallowRules.includes(rule)) {
      setConfig((prev) => ({ ...prev, disallowRules: [...prev.disallowRules, rule] }));
      setNewDisallowRule("");
    }
  };

  const removeDisallowRule = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      disallowRules: prev.disallowRules.filter((_, i) => i !== index),
    }));
  };

  const handleResetDefaults = () => {
    if (confirm("Reset robots.txt settings to Kraviona recommended defaults?")) {
      setConfig(DEFAULT_RECOMMENDED);
      showToast("Reset to recommended SEO defaults", "info");
    }
  };

  const handleSave = async () => {
    // Validation
    if (!config.sitemapUrl.trim()) {
      showToast("Sitemap URL cannot be empty", "error");
      return;
    }
    if (!config.sitemapUrl.startsWith("http://") && !config.sitemapUrl.startsWith("https://")) {
      showToast("Sitemap URL must be an absolute URL (https://...)", "error");
      return;
    }

    setSaving(true);
    try {
      await seoService.updateRobots(config, token);
      showToast("Robots.txt settings saved successfully!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to save robots settings", "error");
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
            <div className="w-12 h-12 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 shadow-sm">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">Robots.txt Management</h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Dynamic
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage search engine crawler access, indexing rules, and protected admin routes in real time.
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
              className="px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-50 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>

        {/* Crawler Status Banner */}
        {config.blockAllCrawlers ? (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold block text-sm">Caution: All Search Engine Crawlers Are Blocked!</span>
              <p>
                Your website is currently serving <code className="px-1.5 py-0.5 bg-rose-100 rounded font-mono">Disallow: /</code>.
                Search engines like Google and Bing are instructed to deindex and avoid crawling your pages.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-emerald-800 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                Search indexing is active. Public tools are allowed while administrative routes (<code className="px-1 bg-emerald-100/70 rounded font-mono">/admin/</code>, <code className="px-1 bg-emerald-100/70 rounded font-mono">/dashboard/</code>) are protected.
              </span>
            </div>
            <a
              href="/robots.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 font-semibold hover:underline flex items-center gap-1 shrink-0 ml-2"
            >
              View live /robots.txt
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-7 space-y-6">
            {/* Global Controls Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-violet-600" />
                Indexing & Crawling Presets
              </h2>

              <div className="space-y-3">
                {/* Enable Indexing */}
                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/70 rounded-xl">
                  <div>
                    <label className="text-xs font-semibold text-slate-800 block">Allow Search Engine Indexing</label>
                    <p className="text-[11px] text-slate-500">Allow search crawlers to scan and index public content</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.allowIndexing && !config.blockAllCrawlers}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setConfig((p) => ({ ...p, allowIndexing: true, blockAllCrawlers: false }));
                      } else {
                        handleBlockAllToggle(true);
                      }
                    }}
                    className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
                  />
                </div>

                {/* Block All Crawlers Switch */}
                <div className="flex items-center justify-between p-3.5 bg-rose-50/50 border border-rose-200/60 rounded-xl">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-rose-900">Block All Crawlers (Disallow: /)</span>
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    </div>
                    <p className="text-[11px] text-rose-600">
                      Emergency killswitch: blocks all bots from every page on the domain
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.blockAllCrawlers}
                    onChange={(e) => handleBlockAllToggle(e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Sitemap URL */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  XML Sitemap Directive
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={config.sitemapUrl}
                      onChange={(e) => setConfig({ ...config, sitemapUrl: e.target.value })}
                      placeholder="https://kraviona.site/sitemap.xml"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, sitemapUrl: `${siteConfig.siteUrl}/sitemap.xml` })}
                    className="px-2.5 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shrink-0"
                  >
                    Auto-fill
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Absolute URL announced to crawlers inside the generated robots.txt
                </p>
              </div>
            </div>

            {/* Custom Allow Rules */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Allowed Paths (Allow:)</h2>
                  <p className="text-[11px] text-slate-500">Public URL patterns open to all crawlers</p>
                </div>
                <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                  {config.allowRules.length} rules
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAllowRule}
                  onChange={(e) => setNewAllowRule(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAllowRule())}
                  placeholder="/ or /tools/"
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none"
                />
                <button
                  type="button"
                  onClick={addAllowRule}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {config.allowRules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3 py-1.5 bg-slate-50 border border-slate-200/60 rounded-lg text-xs font-mono"
                  >
                    <span className="text-emerald-700 font-semibold">Allow: {rule}</span>
                    <button
                      type="button"
                      onClick={() => removeAllowRule(idx)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Disallow Rules */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Disallowed Paths (Disallow:)</h2>
                  <p className="text-[11px] text-slate-500">Private, administrative, and internal routes hidden from crawlers</p>
                </div>
                <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                  {config.disallowRules.length} rules
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newDisallowRule}
                  onChange={(e) => setNewDisallowRule(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addDisallowRule())}
                  placeholder="/admin/ or /private/"
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none"
                />
                <button
                  type="button"
                  onClick={addDisallowRule}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>

              <div className="space-y-1.5 max-h-56 overflow-y-auto">
                {config.disallowRules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3 py-1.5 bg-slate-50 border border-slate-200/60 rounded-lg text-xs font-mono"
                  >
                    <span className="text-rose-700 font-semibold">Disallow: {rule}</span>
                    <button
                      type="button"
                      onClick={() => removeDisallowRule(idx)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Directives Textarea */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <h2 className="text-sm font-bold text-slate-900">Custom Robots Directives (Optional)</h2>
              <p className="text-[11px] text-slate-500">
                Add specialized crawler rules (e.g. <code className="font-mono">User-agent: GPTBot\nDisallow: /</code>, <code className="font-mono">Crawl-delay: 10</code>)
              </p>
              <textarea
                rows={4}
                value={config.customDirectives}
                onChange={(e) => setConfig({ ...config, customDirectives: e.target.value })}
                placeholder="# Example:&#10;User-agent: ClaudeBot&#10;Disallow: /private/&#10;Crawl-delay: 5"
                className="w-full p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs border border-slate-800 outline-none focus:ring-2 focus:ring-violet-500/40 leading-relaxed"
              />
            </div>
          </div>

          {/* Right Column: Live Interactive Preview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm sticky top-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-violet-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Live robots.txt Preview</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-2.5 py-1 text-xs font-medium text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              {/* Code display window */}
              <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-xs shadow-inner overflow-x-auto min-h-[360px] flex flex-col justify-between">
                <pre className="leading-relaxed whitespace-pre-wrap">{previewText}</pre>
                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Domain: {siteConfig.siteUrl}</span>
                  <span className="text-emerald-400 font-semibold">Status: HTTP 200 OK</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl space-y-1.5 text-xs text-slate-600">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-violet-600" />
                  Production Deployment Notes
                </div>
                <p className="text-[11px] text-slate-500">
                  Next.js serves this dynamically at <code className="font-mono text-violet-700">/robots.txt</code>.
                  Search engines re-fetch this file every few hours.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Warning Confirmation Modal */}
        {showBlockConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl border border-rose-200 shadow-2xl max-w-md w-full p-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-base font-bold text-slate-900">Are you sure you want to block all crawlers?</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enabling <strong>Block all crawlers</strong> will generate <code className="font-mono text-rose-600">Disallow: /</code>.
                  This will instruct Google, Bing, Yahoo, and AI engines to <strong>deindex and stop indexing your entire website</strong>.
                </p>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBlockConfirmModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel (Keep Indexed)
                </button>
                <button
                  type="button"
                  onClick={confirmBlockAll}
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-sm"
                >
                  Yes, Block All Bots
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
