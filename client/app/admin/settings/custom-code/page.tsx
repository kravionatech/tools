"use client";

import React, { useEffect, useState } from "react";
import {
  Code2,
  Save,
  RotateCcw,
  ShieldAlert,
  CheckCircle2,
  Copy,
  Check,
  Trash2,
  Sliders,
  Sparkles,
  AlertTriangle,
  HelpCircle,
  Clock,
  Layers,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/components/admin/AdminContext";
import { customCodeService } from "@/services";
import { CustomCodeConfig } from "@/types";

const DEFAULT_CONFIG: CustomCodeConfig = {
  head: { enabled: true, code: "", scope: "sitewide" },
  bodyStart: { enabled: true, code: "", scope: "sitewide" },
  bodyEnd: { enabled: true, code: "", scope: "sitewide" },
  gtm: { enabled: false, containerId: "" },
  ga4: { enabled: false, measurementId: "" },
  metaPixel: { enabled: false, pixelId: "" },
};

export default function CustomCodeAdminPage() {
  const { token, showToast } = useAdmin();
  const [config, setConfig] = useState<CustomCodeConfig>(DEFAULT_CONFIG);
  const [initialConfig, setInitialConfig] = useState<CustomCodeConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  } | null>(null);

  // Quick Preset Helper State
  const [presetTab, setPresetTab] = useState<"gtm" | "ga4" | "gsc" | "meta" | "templates">("gtm");

  useEffect(() => {
    let active = true;
    async function loadCustomCode() {
      if (!token) return;
      setLoading(true);
      try {
        const data = await customCodeService.getCustomCode(token);
        if (active && data.customCode) {
          setConfig(data.customCode);
          setInitialConfig(data.customCode);
        }
      } catch (err) {
        console.error("Failed to load custom code:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCustomCode();
    return () => {
      active = false;
    };
  }, [token]);

  const handleCopy = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast("Copied to clipboard", "info");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleValidate = async () => {
    try {
      const allCode = `${config.head.code}\n${config.bodyStart.code}\n${config.bodyEnd.code}`;
      const data = await customCodeService.validateCode(allCode, token);
      setValidationResult(data);
      if (data.valid) {
        showToast("Code passed syntax check with zero errors", "success");
      } else {
        showToast(`Validation warning: ${data.errors[0] || "Check tags"}`, "warning");
      }
    } catch {
      showToast("Validation check failed to execute", "error");
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const data = await customCodeService.updateCustomCode(config, token);
      setConfig(data.customCode);
      setInitialConfig(data.customCode);
      showToast("Custom code settings successfully saved and applied", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to save custom code", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm("Discard unsaved changes and reset back to last saved configuration?")) {
      setConfig(initialConfig);
      setValidationResult(null);
      showToast("Reset to last saved configuration", "info");
    }
  };

  // Preset Generator Helpers
  const generateGtmHead = (id: string) =>
    `<!-- Google Tag Manager -->\n<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':\nnew Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],\nj=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=\n'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);\n})(window,document,'script','dataLayer','${id || "GTM-XXXXXXX"}');</script>\n<!-- End Google Tag Manager -->`;

  const generateGtmBody = (id: string) =>
    `<!-- Google Tag Manager (noscript) -->\n<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${id || "GTM-XXXXXXX"}"\nheight="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>\n<!-- End Google Tag Manager (noscript) -->`;

  const generateGa4Snippet = (id: string) =>
    `<!-- Google Analytics 4 (gtag.js) -->\n<script async src="https://www.googletagmanager.com/gtag/js?id=${id || "G-XXXXXXXXXX"}"></script>\n<script>\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n  gtag('config', '${id || "G-XXXXXXXXXX"}');\n</script>`;

  const generateMetaPixelSnippet = (id: string) =>
    `<!-- Meta Pixel Code -->\n<script>\n!function(f,b,e,v,n,t,s)\n{if(f.fbq)return;n=f.fbq=function(){n.callMethod?\nn.callMethod.apply(n,arguments):n.queue.push(arguments)};\nif(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';\nn.queue=[];t=b.createElement(e);t.async=!0;\nt.src=v;s=b.getElementsByTagName(e)[0];\ns.parentNode.insertBefore(t,s)}(window, document,'script',\n'https://connect.facebook.net/en_US/fbevents.js');\nfbq('init', '${id || "YOUR_PIXEL_ID"}');\nfbq('track', 'PageView');\n</script>`;

  const appendToHead = (snippet: string, title: string) => {
    const existing = config.head.code.trim();
    const updated = existing ? `${existing}\n\n${snippet}` : snippet;
    setConfig((prev) => ({
      ...prev,
      head: { ...prev.head, code: updated, enabled: true },
    }));
    showToast(`Appended ${title} to Head Code`, "success");
  };

  const appendToBodyEnd = (snippet: string, title: string) => {
    const existing = config.bodyEnd.code.trim();
    const updated = existing ? `${existing}\n\n${snippet}` : snippet;
    setConfig((prev) => ({
      ...prev,
      bodyEnd: { ...prev.bodyEnd, code: updated, enabled: true },
    }));
    showToast(`Appended ${title} to Body End Code`, "success");
  };

  return (
    <AdminLayout pageTitle="Custom Code" showDateRange={false}>
      <div className="space-y-6 max-w-6xl">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Custom Code Management</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage tracking, verification meta tags, and third-party JavaScript without modifying source files.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={handleValidate}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200/60 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-violet-600" />
              <span>Validate Syntax</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave()}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 shadow-xs transition-all disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </div>

        {/* Security & Isolation Notice */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-start gap-3.5 text-xs shadow-sm">
          <ShieldAlert className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-100">Safe Execution & Admin Isolation</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                ACTIVE
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Only add code from trusted providers (e.g. Google, Meta, Microsoft). Custom scripts only run on public visitor routes and are strictly prevented from executing on administrative <code className="text-violet-300 font-mono">/admin/*</code> pages.
            </p>
          </div>
        </div>

        {/* Validation Result Banner (if run) */}
        {validationResult && (
          <div
            className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
              validationResult.valid
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-amber-50 border-amber-200 text-amber-900"
            }`}
          >
            {validationResult.valid ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <div className="font-semibold">
                {validationResult.valid
                  ? "Syntax Check Passed"
                  : `Validation Issues Detected (${validationResult.errors.length} errors)`}
              </div>
              {validationResult.errors.map((err, i) => (
                <div key={i} className="text-[11px] font-mono">
                  • {err}
                </div>
              ))}
              {validationResult.warnings.map((warn, i) => (
                <div key={i} className="text-[11px] font-mono text-amber-700">
                  ⚠ {warn}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Presets & Template Generators */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-600" />
                <h3 className="text-sm font-bold text-slate-900">Integration Presets & Generator</h3>
              </div>
              <p className="text-xs text-slate-400">
                Configure official tags with 1-click generation and automatic injection.
              </p>
            </div>

            {/* Preset Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium self-start sm:self-auto">
              {[
                { id: "gtm", label: "GTM" },
                { id: "ga4", label: "GA4" },
                { id: "gsc", label: "Search Console" },
                { id: "meta", label: "Meta Pixel" },
                { id: "templates", label: "Other Presets" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setPresetTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    presetTab === tab.id
                      ? "bg-white text-slate-900 font-semibold shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* PRESET 1: GOOGLE TAG MANAGER */}
          {presetTab === "gtm" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs pt-1">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 uppercase tracking-wider">
                    Google Tag Manager Container ID
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.gtm.enabled}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          gtm: { ...config.gtm, enabled: e.target.checked },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600"></div>
                  </label>
                </div>

                <input
                  type="text"
                  value={config.gtm.containerId}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      gtm: { ...config.gtm, containerId: e.target.value.trim() },
                    })
                  }
                  placeholder="GTM-XXXXXXX"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />

                <p className="text-slate-500 text-[11px] leading-relaxed">
                  When enabled, Kraviona automatically injects the GTM head script into <code className="font-mono">&lt;head&gt;</code> and the noscript fallback into <code className="font-mono">&lt;body&gt;</code> on all public pages.
                </p>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => appendToHead(generateGtmHead(config.gtm.containerId), "GTM Head")}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                  >
                    Copy to Head Field
                  </button>
                  <button
                    type="button"
                    onClick={() => appendToBodyEnd(generateGtmBody(config.gtm.containerId), "GTM Body")}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                  >
                    Copy to Body Field
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 text-slate-300 p-4 rounded-xl font-mono text-[11px] space-y-2 overflow-x-auto">
                <div className="text-slate-500 font-sans font-semibold">Generated GTM Integration:</div>
                <div className="text-emerald-400">&lt;!-- Auto-injected in Head --&gt;</div>
                <pre className="text-slate-300">{generateGtmHead(config.gtm.containerId)}</pre>
              </div>
            </div>
          )}

          {/* PRESET 2: GA4 */}
          {presetTab === "ga4" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs pt-1">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 uppercase tracking-wider">
                    Google Analytics 4 Measurement ID
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.ga4.enabled}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          ga4: { ...config.ga4, enabled: e.target.checked },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600"></div>
                  </label>
                </div>

                <input
                  type="text"
                  value={config.ga4.measurementId}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      ga4: { ...config.ga4, measurementId: e.target.value.trim() },
                    })
                  }
                  placeholder="G-XXXXXXXXXX"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />

                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Enabling this automatically injects official Google tag (<code className="font-mono">gtag.js</code>) telemetry directly into document head.
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => appendToHead(generateGa4Snippet(config.ga4.measurementId), "GA4 gtag.js")}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                  >
                    Paste into Head Field
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 text-slate-300 p-4 rounded-xl font-mono text-[11px] space-y-2 overflow-x-auto">
                <div className="text-slate-500 font-sans font-semibold">Generated GA4 Snippet:</div>
                <pre className="text-slate-300">{generateGa4Snippet(config.ga4.measurementId)}</pre>
              </div>
            </div>
          )}

          {/* PRESET 3: SEARCH CONSOLE */}
          {presetTab === "gsc" && (
            <div className="space-y-4 text-xs pt-1 max-w-2xl">
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">Google Search Console Verification Tag</h4>
                <p className="text-slate-500 text-[11px] mb-2">
                  In Google Search Console, select <strong>HTML tag</strong> verification method, copy the tag, and paste it into Head Code.
                </p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-800">
                  &lt;meta name="google-site-verification" content="YOUR_VERIFICATION_TOKEN" /&gt;
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  appendToHead(
                    '<meta name="google-site-verification" content="PASTE_YOUR_TOKEN_HERE" />',
                    "GSC Verification Meta Tag"
                  )
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-violet-50 text-violet-700 hover:bg-violet-100"
              >
                <span>Insert Template to Head</span>
              </button>
            </div>
          )}

          {/* PRESET 4: META PIXEL */}
          {presetTab === "meta" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs pt-1">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 uppercase tracking-wider">
                    Meta (Facebook) Pixel ID
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.metaPixel.enabled}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          metaPixel: { ...config.metaPixel, enabled: e.target.checked },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600"></div>
                  </label>
                </div>

                <input
                  type="text"
                  value={config.metaPixel.pixelId}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      metaPixel: { ...config.metaPixel, pixelId: e.target.value.trim() },
                    })
                  }
                  placeholder="e.g. 123456789012345"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />

                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Enabling this initializes Meta Pixel and triggers PageView events on visitor navigation.
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      appendToHead(generateMetaPixelSnippet(config.metaPixel.pixelId), "Meta Pixel")
                    }
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                  >
                    Paste into Head Field
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 text-slate-300 p-4 rounded-xl font-mono text-[11px] space-y-2 overflow-x-auto">
                <div className="text-slate-500 font-sans font-semibold">Generated Meta Pixel Snippet:</div>
                <pre className="text-slate-300">{generateMetaPixelSnippet(config.metaPixel.pixelId)}</pre>
              </div>
            </div>
          )}

          {/* PRESET 5: OTHER TEMPLATES */}
          {presetTab === "templates" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-1">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="font-semibold text-slate-800">Microsoft Clarity</div>
                <p className="text-[11px] text-slate-500">Heatmaps and session recording telemetry.</p>
                <button
                  type="button"
                  onClick={() =>
                    appendToHead(
                      '<!-- Microsoft Clarity -->\n<script type="text/javascript">\n    (function(c,l,a,r,i,t,y){\n        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};\n        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;\n        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);\n    })(window, document, "clarity", "script", "YOUR_PROJECT_ID");\n</script>',
                      "Microsoft Clarity"
                    )
                  }
                  className="w-full py-1.5 text-[11px] font-semibold text-violet-700 bg-white border border-violet-200 rounded-lg hover:bg-violet-50"
                >
                  Insert to Head
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="font-semibold text-slate-800">Ahrefs Verification</div>
                <p className="text-[11px] text-slate-500">Ownership verification tag for Ahrefs Webmaster Tools.</p>
                <button
                  type="button"
                  onClick={() =>
                    appendToHead(
                      '<meta name="ahrefs-site-verification" content="YOUR_AHREFS_KEY" />',
                      "Ahrefs Verification"
                    )
                  }
                  className="w-full py-1.5 text-[11px] font-semibold text-violet-700 bg-white border border-violet-200 rounded-lg hover:bg-violet-50"
                >
                  Insert to Head
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="font-semibold text-slate-800">Chat Widget / Support</div>
                <p className="text-[11px] text-slate-500">Live chat widgets (Crisp, Tawk.to, Intercom).</p>
                <button
                  type="button"
                  onClick={() =>
                    appendToBodyEnd(
                      '<!-- Live Support Widget -->\n<script>\n  // Paste vendor widget script here\n</script>',
                      "Chat Widget"
                    )
                  }
                  className="w-full py-1.5 text-[11px] font-semibold text-violet-700 bg-white border border-violet-200 rounded-lg hover:bg-violet-50"
                >
                  Insert to Body End
                </button>
              </div>
            </div>
          )}
        </div>

        {/* FIELD 1: HEAD CODE */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-violet-600" />
                <h3 className="text-sm font-bold text-slate-900">Head Code (&lt;head&gt; ... &lt;/head&gt;)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Verification tags, analytics scripts, and fonts that must load inside the document head.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              {/* Scope Selector */}
              <select
                value={config.head.scope}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    head: { ...config.head, scope: e.target.value as any },
                  })
                }
                className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
              >
                <option value="sitewide">Sitewide (All Pages)</option>
                <option value="home_only">Homepage Only</option>
                <option value="tools_only">Tool Pages Only</option>
              </select>

              {/* Enable Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-600">
                  {config.head.enabled ? "Active" : "Disabled"}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.head.enabled}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        head: { ...config.head, enabled: e.target.checked },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Editor Textarea */}
          <div className="relative">
            <textarea
              rows={8}
              value={config.head.code}
              onChange={(e) =>
                setConfig({
                  ...config,
                  head: { ...config.head, code: e.target.value },
                })
              }
              placeholder="<!-- Paste verification tags, analytics, or CSS stylesheets here -->&#10;<meta name='google-site-verification' content='...' />"
              className="w-full p-4 bg-slate-950 text-slate-100 font-mono text-xs rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/30 leading-relaxed tracking-wide selection:bg-violet-600 selection:text-white"
            />

            {/* Quick Actions overlay */}
            <div className="absolute right-3 top-3 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleCopy(config.head.code, "head")}
                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Copy code"
              >
                {copiedKey === "head" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() =>
                  setConfig({
                    ...config,
                    head: { ...config.head, code: "" },
                  })
                }
                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-950 text-slate-300 hover:text-rose-400 transition-colors"
                title="Clear code"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Location: <code className="font-mono text-slate-600">&lt;head&gt;</code> tag</span>
            <span>{config.head.code.length} characters</span>
          </div>
        </div>

        {/* FIELD 2: BODY START CODE */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Body Start Code (&lt;body&gt; ...)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Code that must execute immediately after the opening body tag, such as GTM noscript.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <select
                value={config.bodyStart.scope}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    bodyStart: { ...config.bodyStart, scope: e.target.value as any },
                  })
                }
                className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
              >
                <option value="sitewide">Sitewide (All Pages)</option>
                <option value="home_only">Homepage Only</option>
                <option value="tools_only">Tool Pages Only</option>
              </select>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-600">
                  {config.bodyStart.enabled ? "Active" : "Disabled"}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.bodyStart.enabled}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        bodyStart: { ...config.bodyStart, enabled: e.target.checked },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="relative">
            <textarea
              rows={6}
              value={config.bodyStart.code}
              onChange={(e) =>
                setConfig({
                  ...config,
                  bodyStart: { ...config.bodyStart, code: e.target.value },
                })
              }
              placeholder="<!-- Google Tag Manager (noscript) -->&#10;<noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-XXXX' ...></iframe></noscript>"
              className="w-full p-4 bg-slate-950 text-slate-100 font-mono text-xs rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/30 leading-relaxed tracking-wide"
            />

            <div className="absolute right-3 top-3 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleCopy(config.bodyStart.code, "bodyStart")}
                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white"
                title="Copy code"
              >
                {copiedKey === "bodyStart" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() =>
                  setConfig({
                    ...config,
                    bodyStart: { ...config.bodyStart, code: "" },
                  })
                }
                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-950 text-slate-300 hover:text-rose-400"
                title="Clear code"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Location: Top of <code className="font-mono text-slate-600">&lt;body&gt;</code></span>
            <span>{config.bodyStart.code.length} characters</span>
          </div>
        </div>

        {/* FIELD 3: BODY END CODE */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Body End Code (... &lt;/body&gt;)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Scripts or widgets that should load before the closing body tag, such as live chat or custom JS.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <select
                value={config.bodyEnd.scope}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    bodyEnd: { ...config.bodyEnd, scope: e.target.value as any },
                  })
                }
                className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
              >
                <option value="sitewide">Sitewide (All Pages)</option>
                <option value="home_only">Homepage Only</option>
                <option value="tools_only">Tool Pages Only</option>
              </select>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-600">
                  {config.bodyEnd.enabled ? "Active" : "Disabled"}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.bodyEnd.enabled}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        bodyEnd: { ...config.bodyEnd, enabled: e.target.checked },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="relative">
            <textarea
              rows={6}
              value={config.bodyEnd.code}
              onChange={(e) =>
                setConfig({
                  ...config,
                  bodyEnd: { ...config.bodyEnd, code: e.target.value },
                })
              }
              placeholder="<!-- Chat widgets, customer support beacons, and late scripts -->&#10;<script>console.log('Kraviona live');</script>"
              className="w-full p-4 bg-slate-950 text-slate-100 font-mono text-xs rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/30 leading-relaxed tracking-wide"
            />

            <div className="absolute right-3 top-3 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleCopy(config.bodyEnd.code, "bodyEnd")}
                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white"
                title="Copy code"
              >
                {copiedKey === "bodyEnd" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() =>
                  setConfig({
                    ...config,
                    bodyEnd: { ...config.bodyEnd, code: "" },
                  })
                }
                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-950 text-slate-300 hover:text-rose-400"
                title="Clear code"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Location: Bottom of <code className="font-mono text-slate-600">&lt;body&gt;</code></span>
            <span>{config.bodyEnd.code.length} characters</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 pt-2 border-t border-slate-200/80">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            <span>
              Last updated:{" "}
              {config.lastUpdated
                ? new Date(config.lastUpdated).toLocaleString()
                : "Initial Configuration"}
            </span>
          </div>
          <div>Updated by: <span className="font-mono text-slate-600">{config.updatedBy || "admin"}</span></div>
        </div>
      </div>
    </AdminLayout>
  );
}
