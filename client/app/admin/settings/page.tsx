"use client";

import React, { useEffect, useState } from "react";
import {
  Settings,
  Save,
  Palette,
  Globe,
  ShieldCheck,
  Mail,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/components/admin/AdminContext";
import { siteConfig } from "@/lib/site-config";

export default function SiteSettingsPage() {
  const { token, apiBase, showToast } = useAdmin();
  const [activeSection, setActiveSection] = useState<"general" | "branding" | "seo" | "privacy">("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    siteName: "Kraviona Tools",
    siteUrl: siteConfig.siteUrl,
    contactEmail: "support@kraviona.site",
    adminEmail: "admin@kraviona.site",
    primaryColor: "#6c3ce1",
    themeMode: "system",
    logoUrl: "",
    faviconUrl: "",
    defaultTitle: "Kraviona Tools — Free Online Tools for SEO, Images & Text",
    defaultDescription: "Free browser-based tools for SEO professionals, content writers, and digital marketers.",
    googleVerification: "",
    analyticsMeasurementId: "",
    allowIndexing: true,
  });

  useEffect(() => {
    let active = true;
    async function loadSettings() {
      if (!token) return;
      setLoading(true);
      try {
        const res = await fetch(`${apiBase}/api/settings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json = await res.json();
          if (active && json.settings) {
            setForm((prev) => ({
              ...prev,
              siteName: json.settings.siteName || prev.siteName,
              siteUrl: json.settings.siteUrl || prev.siteUrl,
              contactEmail: json.settings.contactEmail || prev.contactEmail,
              adminEmail: json.settings.adminEmail || prev.adminEmail,
              primaryColor: json.settings.primaryColor || prev.primaryColor,
              themeMode: json.settings.themeMode || prev.themeMode,
              logoUrl: json.settings.logoUrl || prev.logoUrl,
              faviconUrl: json.settings.faviconUrl || prev.faviconUrl,
              defaultTitle: json.settings.defaultTitle || prev.defaultTitle,
              defaultDescription: json.settings.defaultDescription || prev.defaultDescription,
              googleVerification: json.settings.googleVerification || prev.googleVerification,
              analyticsMeasurementId: json.settings.analyticsMeasurementId || prev.analyticsMeasurementId,
              allowIndexing: json.settings.allowIndexing ?? prev.allowIndexing,
            }));
          }
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSettings();
    return () => {
      active = false;
    };
  }, [token, apiBase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${apiBase}/api/settings`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        showToast("Settings updated successfully", "success");
      } else {
        showToast("Failed to save settings", "error");
      }
    } catch {
      showToast("Network error updating settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: "general", label: "General & Contact", icon: Settings, desc: "Platform branding and administrative emails" },
    { id: "branding", label: "Visual Branding", icon: Palette, desc: "Color theme, appearance, and asset URLs" },
    { id: "seo", label: "SEO & Search Indexing", icon: Globe, desc: "Global titles, meta tags, and robots directives" },
    { id: "privacy", label: "Telemetry & Privacy", icon: ShieldCheck, desc: "Analytics collection mode and security" },
  ];

  return (
    <AdminLayout pageTitle="Site Settings" showDateRange={false}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Platform Settings</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Configure global operational parameters, contact addresses, and brand styling.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 shadow-xs transition-all disabled:opacity-50 self-start sm:self-auto"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Saving Changes..." : "Save Configuration"}</span>
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id as any)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isActive
                    ? "bg-white border-violet-600 ring-2 ring-violet-500/10 shadow-xs"
                    : "bg-white/60 border-slate-200/80 hover:bg-white hover:border-slate-300"
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2.5 ${
                  isActive ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-600"
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900">{sec.label}</div>
                <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{sec.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Main Settings Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          {/* 1. GENERAL & CONTACT */}
          {activeSection === "general" && (
            <div className="space-y-4 max-w-2xl text-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3">General Platform Identification</h3>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  required
                  value={form.siteName}
                  onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Public Canonical Site URL
                </label>
                <input
                  type="url"
                  required
                  value={form.siteUrl}
                  onChange={(e) => setForm({ ...form, siteUrl: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Public Contact / Support Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.contactEmail}
                    onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Shown to visitors on the contact page.
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    System Administrator Alert Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.adminEmail}
                    onChange={(e) => setForm({ ...form, adminEmail: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Target for security alerts & server warnings.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 2. VISUAL BRANDING */}
          {activeSection === "branding" && (
            <div className="space-y-4 max-w-2xl text-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Branding & Color Theme</h3>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Primary Accent Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={form.primaryColor}
                    onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                    className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={form.primaryColor}
                    onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                    className="w-32 p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                  <span className="text-[11px] text-slate-400">Default: #6c3ce1 (Kraviona Violet)</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Theme Appearance Mode
                </label>
                <select
                  value={form.themeMode}
                  onChange={(e) => setForm({ ...form, themeMode: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                >
                  <option value="system">System Synchronized (Follows OS light/dark preference)</option>
                  <option value="light">Strict Light Mode</option>
                  <option value="dark">Strict Dark Mode</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Custom Logo Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={form.logoUrl}
                    onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                    placeholder="https://kraviona.site/logo.svg"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Custom Favicon URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={form.faviconUrl}
                    onChange={(e) => setForm({ ...form, faviconUrl: e.target.value })}
                    placeholder="https://kraviona.site/favicon.ico"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. SEO */}
          {activeSection === "seo" && (
            <div className="space-y-4 max-w-2xl text-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3">SEO Defaults</h3>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Default Title Template
                </label>
                <input
                  type="text"
                  value={form.defaultTitle}
                  onChange={(e) => setForm({ ...form, defaultTitle: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Default Description
                </label>
                <textarea
                  rows={3}
                  value={form.defaultDescription}
                  onChange={(e) => setForm({ ...form, defaultDescription: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Google Verification Token
                </label>
                <input
                  type="text"
                  value={form.googleVerification}
                  onChange={(e) => setForm({ ...form, googleVerification: e.target.value })}
                  placeholder="google-site-verification token..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <div>
                  <div className="font-semibold text-slate-800">Search Engine Indexing Directive</div>
                  <div className="text-[11px] text-slate-400">Allow search crawlers to index and rank Kraviona</div>
                </div>
                <input
                  type="checkbox"
                  checked={form.allowIndexing}
                  onChange={(e) => setForm({ ...form, allowIndexing: e.target.checked })}
                  className="w-4 h-4 text-violet-600 rounded"
                />
              </div>
            </div>
          )}

          {/* 4. PRIVACY & TELEMETRY */}
          {activeSection === "privacy" && (
            <div className="space-y-4 max-w-2xl text-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Analytics & Privacy Policies</h3>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Google Analytics 4 Measurement ID
                </label>
                <input
                  type="text"
                  value={form.analyticsMeasurementId}
                  onChange={(e) => setForm({ ...form, analyticsMeasurementId: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Optional external GA4 integration. Kraviona native analytics runs independently.
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-semibold text-slate-800">Telemetry Storage Mode</div>
                <p className="text-slate-500 leading-relaxed text-[11px]">
                  Kraviona uses a salt-keyed SHA-256 HMAC hash for visitor identification. Raw IP addresses are masked by default across administrative views.
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Compliant with GDPR & ePrivacy Directive</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </AdminLayout>
  );
}
