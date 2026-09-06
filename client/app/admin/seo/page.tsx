"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Globe,
  Save,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Search,
  Share2,
  AlertTriangle,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/components/admin/AdminContext";
import { seoService } from "@/services";
import { siteConfig } from "@/lib/site-config";

export default function SeoManagementPage() {
  const { token, showToast } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    siteName: "Kraviona Tools",
    siteUrl: siteConfig.siteUrl,
    defaultTitle: "Kraviona Tools — Free Online Tools for SEO, Images & Text",
    defaultDescription: "Free browser-based tools for SEO professionals, content writers, and digital marketers.",
    googleVerification: "",
    bingVerification: "",
    analyticsMeasurementId: "",
    allowIndexing: true,
    robotsTxt: `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/admin/\nDisallow: /dashboard/\nDisallow: /login/\nDisallow: /private/\n\nSitemap: ${siteConfig.siteUrl}/sitemap.xml`,
    socialShareImage: `${siteConfig.siteUrl}/og-image.png`,
  });

  useEffect(() => {
    let active = true;
    async function loadSettings() {
      if (!token) return;
      setLoading(true);
      try {
        const data = await seoService.getSiteSettings(token);
        if (active && data.settings) {
          setForm((prev) => ({
            ...prev,
            siteName: data.settings.siteName || prev.siteName,
            siteUrl: data.settings.siteUrl || prev.siteUrl,
            defaultTitle: data.settings.defaultTitle || prev.defaultTitle,
            defaultDescription: data.settings.defaultDescription || prev.defaultDescription,
            googleVerification: data.settings.googleVerification || "",
            bingVerification: data.settings.bingVerification || "",
            analyticsMeasurementId: data.settings.analyticsMeasurementId || "",
            allowIndexing: data.settings.allowIndexing ?? true,
            robotsTxt: data.settings.robotsTxt || prev.robotsTxt,
            socialShareImage: data.settings.socialShareImage || prev.socialShareImage,
          }));
        }
      } catch (err) {
        console.error("Failed to load SEO settings:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSettings();
    return () => {
      active = false;
    };
  }, [token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await seoService.updateSiteSettings(form as any, token);
      showToast("SEO configuration saved successfully", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to save SEO settings", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout pageTitle="SEO Management" showDateRange={false}>
      <form onSubmit={handleSave} className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">SEO & Metadata Configuration</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Control search engine crawl directives, verification tags, and OpenGraph social previews.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 shadow-xs transition-all disabled:opacity-50 self-start sm:self-auto"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Saving Changes..." : "Save SEO Settings"}</span>
          </button>
        </div>

        {/* SEO Status Health Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Sitemap Status</div>
              <div className="text-xs font-bold text-slate-900">Dynamic (/sitemap.xml)</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Robots.txt</div>
              <div className="text-xs font-bold text-slate-900">Operational (/robots.txt)</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Canonical URL</div>
              <div className="text-xs font-bold text-slate-900 truncate max-w-[130px]">{form.siteUrl}</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                form.allowIndexing ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
              }`}
            >
              <Search className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Indexing Directives</div>
              <div className="text-xs font-bold text-slate-900">
                {form.allowIndexing ? "Index, Follow" : "Noindex, Nofollow"}
              </div>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main SEO Inputs (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Meta Tags Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-900">Global Meta Information</h3>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Default Title Template
                </label>
                <input
                  type="text"
                  value={form.defaultTitle}
                  onChange={(e) => setForm({ ...form, defaultTitle: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {form.defaultTitle.length} characters (Recommended: 50-60 chars)
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Default Meta Description
                </label>
                <textarea
                  rows={3}
                  value={form.defaultDescription}
                  onChange={(e) => setForm({ ...form, defaultDescription: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {form.defaultDescription.length} characters (Recommended: 150-160 chars)
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Canonical Production Site URL
                </label>
                <input
                  type="url"
                  value={form.siteUrl}
                  onChange={(e) => setForm({ ...form, siteUrl: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">Search Engine Indexing</div>
                  <div className="text-[11px] text-slate-400">
                    Instruct crawlers to index and rank your pages
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.allowIndexing}
                    onChange={(e) => setForm({ ...form, allowIndexing: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600"></div>
                </label>
              </div>
            </div>

            {/* Verification & Analytics Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-900">Webmaster Verification & Telemetry</h3>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Google Search Console Verification Token
                </label>
                <input
                  type="text"
                  value={form.googleVerification}
                  onChange={(e) => setForm({ ...form, googleVerification: e.target.value })}
                  placeholder="e.g. google-site-verification=abc123..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Bing Webmaster Verification Code
                </label>
                <input
                  type="text"
                  value={form.bingVerification}
                  onChange={(e) => setForm({ ...form, bingVerification: e.target.value })}
                  placeholder="e.g. BING_VERIFICATION_TOKEN"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Google Analytics 4 Measurement ID
                </label>
                <input
                  type="text"
                  value={form.analyticsMeasurementId}
                  onChange={(e) => setForm({ ...form, analyticsMeasurementId: e.target.value })}
                  placeholder="e.g. G-XXXXXXXXXX"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                />
              </div>
            </div>

            {/* Robots.txt Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Robots.txt Directives</h3>
                  <p className="text-slate-400">Rules served to search engine spiders</p>
                </div>
                <Link
                  href="/robots.txt"
                  target="_blank"
                  className="text-violet-600 hover:text-violet-700 font-semibold flex items-center gap-1"
                >
                  <span>View Live</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <textarea
                rows={4}
                value={form.robotsTxt}
                onChange={(e) => setForm({ ...form, robotsTxt: e.target.value })}
                className="w-full p-2.5 bg-slate-900 text-emerald-400 border border-slate-800 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
          </div>

          {/* Social Share & SERP Preview Card (1 Col) */}
          <div className="space-y-6">
            {/* SERP Search Preview */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-xs space-y-3">
              <div className="flex items-center gap-2 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <Search className="w-3.5 h-3.5 text-blue-600" />
                <span>Google Search Result Preview</span>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
                <div className="text-[11px] text-slate-500 font-mono truncate">{form.siteUrl}</div>
                <div className="text-sm font-semibold text-blue-800 hover:underline line-clamp-1 cursor-pointer">
                  {form.defaultTitle}
                </div>
                <div className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {form.defaultDescription}
                </div>
              </div>
            </div>

            {/* Social Share OpenGraph Preview */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-xs space-y-3">
              <div className="flex items-center gap-2 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <Share2 className="w-3.5 h-3.5 text-violet-600" />
                <span>Social Share (OpenGraph) Card</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                  Social Sharing Image URL
                </label>
                <input
                  type="url"
                  value={form.socialShareImage}
                  onChange={(e) => setForm({ ...form, socialShareImage: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px]"
                />
              </div>

              <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                <div className="h-28 bg-gradient-to-br from-violet-600 to-indigo-800 flex items-center justify-center text-white font-bold text-sm">
                  Kraviona Tools
                </div>
                <div className="p-3 bg-white space-y-1">
                  <div className="text-[10px] uppercase font-mono text-slate-400">kraviona.site</div>
                  <div className="font-semibold text-slate-900 line-clamp-1">{form.defaultTitle}</div>
                  <div className="text-[11px] text-slate-500 line-clamp-2">{form.defaultDescription}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
