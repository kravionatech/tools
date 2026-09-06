"use client";

import React, { useEffect, useState } from "react";
import {
  FileText,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  HelpCircle,
  Home,
  Info,
  Layers,
  Sparkles,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/components/admin/AdminContext";

export default function ContentManagementPage() {
  const { token, apiBase, showToast } = useAdmin();
  const [activeTab, setActiveTab] = useState<"homepage" | "faqs" | "about" | "footer">("homepage");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states
  const [heroData, setHeroData] = useState({
    title: "All the Tools You Need in One Place",
    subtitle: "Fast, private, and 100% free browser-based tools for SEO professionals, content writers, and digital creators.",
    badgeText: "100% Browser-Based • Privacy-First",
    ctaPrimary: "Explore All Tools",
    ctaSecondary: "Browse Text Tools",
  });

  const [faqItems, setFaqItems] = useState([
    {
      q: "Are the tools on Kraviona free to use?",
      a: "Yes! All tools on Kraviona are 100% free with no account required, no usage limits, and no subscription fees.",
    },
    {
      q: "Is my data safe and private?",
      a: "Absolutely. All processing occurs entirely inside your local browser. We never upload, store, or transmit your images, documents, or texts to any remote server.",
    },
    {
      q: "Do I need to install any software or extensions?",
      a: "No installation is required. Kraviona runs natively inside any modern browser on desktop, tablet, or mobile.",
    },
  ]);

  const [aboutData, setAboutData] = useState({
    title: "About Kraviona Tools",
    description: "Kraviona Tools was built to provide developers, marketers, and content writers with fast, privacy-preserving utilities that run entirely client-side without bloated ads or paywalls.",
    mission: "To build the web's cleanest, fastest utility toolbox with zero friction.",
    supportEmail: "support@kraviona.site",
  });

  const [footerData, setFooterData] = useState({
    privacyNotice: "Your privacy is protected. All tools on Kraviona process files and text locally in your browser. We do not upload, store, or transmit your data to any server.",
    copyrightText: "Kraviona Tools. Free browser-based tools for professionals.",
  });

  // Load existing content from backend
  useEffect(() => {
    let active = true;
    async function loadContent() {
      if (!token) return;
      setLoading(true);
      try {
        const res = await fetch(`${apiBase}/api/content/${activeTab}`);
        if (res.ok) {
          const json = await res.json();
          if (active && json.content) {
            if (activeTab === "homepage") setHeroData(json.content);
            if (activeTab === "faqs") setFaqItems(json.content.items || faqItems);
            if (activeTab === "about") setAboutData(json.content);
            if (activeTab === "footer") setFooterData(json.content);
          }
        }
      } catch (err) {
        console.error("Error loading content:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadContent();
    return () => {
      active = false;
    };
  }, [activeTab, token, apiBase]);

  const handleSave = async () => {
    setSaving(true);
    let payloadData: any = {};
    let title = "";

    if (activeTab === "homepage") {
      payloadData = heroData;
      title = "Homepage Hero Content";
    } else if (activeTab === "faqs") {
      payloadData = { items: faqItems };
      title = "Platform FAQs";
    } else if (activeTab === "about") {
      payloadData = aboutData;
      title = "About Page Content";
    } else if (activeTab === "footer") {
      payloadData = footerData;
      title = "Footer Settings";
    }

    try {
      const res = await fetch(`${apiBase}/api/content/${activeTab}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          section: activeTab,
          title,
          data: payloadData,
        }),
      });

      if (res.ok) {
        showToast(`Saved ${activeTab} content successfully`, "success");
      } else {
        showToast("Failed to update content", "error");
      }
    } catch {
      showToast("Network error saving content", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAddFaq = () => {
    setFaqItems([...faqItems, { q: "New Question Title", a: "Detailed answer explaining the topic..." }]);
  };

  const handleRemoveFaq = (idx: number) => {
    setFaqItems(faqItems.filter((_, i) => i !== idx));
  };

  return (
    <AdminLayout pageTitle="Content Management" showDateRange={false}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Content Management</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Customize text copy, FAQs, and marketing messages without rebuilding the application.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 shadow-xs transition-all disabled:opacity-50 self-start sm:self-auto"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Saving Changes..." : "Save Content"}</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-200/80 pb-px overflow-x-auto">
          {[
            { id: "homepage", label: "Homepage Hero", icon: Home },
            { id: "faqs", label: "FAQ Library", icon: HelpCircle },
            { id: "about", label: "About Page", icon: Info },
            { id: "footer", label: "Footer & Notices", icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? "border-violet-600 text-violet-700 bg-violet-50/50 rounded-t-lg"
                    : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Container */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          {/* TAB 1: HOMEPAGE HERO */}
          {activeTab === "homepage" && (
            <div className="space-y-4 max-w-2xl text-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-2">Homepage Hero Headline & Copy</h3>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Hero Badge Tagline
                </label>
                <input
                  type="text"
                  value={heroData.badgeText}
                  onChange={(e) => setHeroData({ ...heroData, badgeText: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={heroData.title}
                  onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Subtitle Description
                </label>
                <textarea
                  rows={3}
                  value={heroData.subtitle}
                  onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Primary CTA Text
                  </label>
                  <input
                    type="text"
                    value={heroData.ctaPrimary}
                    onChange={(e) => setHeroData({ ...heroData, ctaPrimary: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Secondary CTA Text
                  </label>
                  <input
                    type="text"
                    value={heroData.ctaSecondary}
                    onChange={(e) => setHeroData({ ...heroData, ctaSecondary: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FAQS */}
          {activeTab === "faqs" && (
            <div className="space-y-4 max-w-3xl text-xs">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Frequently Asked Questions</h3>
                  <p className="text-slate-400">Manage questions displayed on informational pages</p>
                </div>
                <button
                  onClick={handleAddFaq}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-50 text-violet-700 hover:bg-violet-100"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add FAQ</span>
                </button>
              </div>

              <div className="space-y-4">
                {faqItems.map((faq, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 relative">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={faq.q}
                        onChange={(e) => {
                          const updated = [...faqItems];
                          updated[idx].q = e.target.value;
                          setFaqItems(updated);
                        }}
                        placeholder="Question title"
                        className="font-semibold text-slate-900 bg-white border border-slate-200 p-2 rounded-lg w-full"
                      />
                      <button
                        onClick={() => handleRemoveFaq(idx)}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Delete Question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={faq.a}
                      onChange={(e) => {
                        const updated = [...faqItems];
                        updated[idx].a = e.target.value;
                        setFaqItems(updated);
                      }}
                      placeholder="Answer text"
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ABOUT PAGE */}
          {activeTab === "about" && (
            <div className="space-y-4 max-w-2xl text-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-2">About Page Information</h3>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Page Title
                </label>
                <input
                  type="text"
                  value={aboutData.title}
                  onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Mission Statement
                </label>
                <input
                  type="text"
                  value={aboutData.mission}
                  onChange={(e) => setAboutData({ ...aboutData, mission: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Story Description
                </label>
                <textarea
                  rows={4}
                  value={aboutData.description}
                  onChange={(e) => setAboutData({ ...aboutData, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Public Inquiries Contact Email
                </label>
                <input
                  type="email"
                  value={aboutData.supportEmail}
                  onChange={(e) => setAboutData({ ...aboutData, supportEmail: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>
            </div>
          )}

          {/* TAB 4: FOOTER */}
          {activeTab === "footer" && (
            <div className="space-y-4 max-w-2xl text-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-2">Global Footer Configuration</h3>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Privacy Box Notice Text
                </label>
                <textarea
                  rows={3}
                  value={footerData.privacyNotice}
                  onChange={(e) => setFooterData({ ...footerData, privacyNotice: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Copyright Line
                </label>
                <input
                  type="text"
                  value={footerData.copyrightText}
                  onChange={(e) => setFooterData({ ...footerData, copyrightText: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
