"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Code,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Save,
  Globe,
  Loader2,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function AdminConsolePage() {
  const [activeTab, setActiveTab] = useState("scripts"); // 'scripts' | 'seo' | 'diagnostics'
  
  // Settings state
  const [headerScripts, setHeaderScripts] = useState("");
  const [bodyStartScripts, setBodyStartScripts] = useState("");
  const [bodyEndScripts, setBodyEndScripts] = useState("");
  const [mozAccessId, setMozAccessId] = useState("");
  const [mozSecretKey, setMozSecretKey] = useState("");
  const [mozApiKey, setMozApiKey] = useState("");
  const [enableDemoAuthority, setEnableDemoAuthority] = useState(false);

  // Status state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Diagnostics test state
  const [testDomain, setTestDomain] = useState("kraviona.site");
  const [diagResult, setDiagResult] = useState(null);
  const [diagLoading, setDiagLoading] = useState(false);
  const [diagError, setDiagError] = useState("");

  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

  // Load current settings from backend
  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/admin/settings`);
        if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch admin settings`);
        const json = await res.json();
        if (json.success && json.data) {
          setHeaderScripts(json.data.headerScripts || "");
          setBodyStartScripts(json.data.bodyStartScripts || "");
          setBodyEndScripts(json.data.bodyEndScripts || "");
          setMozAccessId(json.data.mozAccessId || "");
          setMozSecretKey(json.data.mozSecretKey || "");
          setMozApiKey(json.data.mozApiKey || "");
          setEnableDemoAuthority(Boolean(json.data.enableDemoAuthority));
        }
      } catch (err) {
        setErrorMessage("Could not connect to backend settings endpoint. Ensure the backend API is running.");
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, [apiUrl]);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSaveSuccess("");
    setErrorMessage("");

    try {
      const res = await fetch(`${apiUrl}/api/admin/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headerScripts,
          bodyStartScripts,
          bodyEndScripts,
          mozAccessId,
          mozSecretKey,
          mozApiKey,
          enableDemoAuthority,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to save settings.");
      }

      setSaveSuccess("Settings saved successfully! All updates are live across Kraviona.");
      setTimeout(() => setSaveSuccess(""), 6000);
    } catch (err) {
      setErrorMessage(err.message || "Failed to update settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleRunDiagnostic = async () => {
    if (!testDomain.trim()) return;
    setDiagLoading(true);
    setDiagError("");
    setDiagResult(null);

    try {
      const res = await fetch(`${apiUrl}/api/seo/domain-check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: testDomain }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Diagnostic test failed");
      }
      setDiagResult(json.data);
    } catch (err) {
      setDiagError(err.message || "Failed to run diagnostic test.");
    } finally {
      setDiagLoading(false);
    }
  };

  // Sample templates inserters
  const insertSampleGA4 = () => {
    const sample = `<!-- Google tag (gtag.js) -->\n<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>\n<script>\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n\n  gtag('config', 'G-XXXXXXXXXX');\n</script>`;
    setHeaderScripts((prev) => (prev ? `${prev}\n\n${sample}` : sample));
  };

  const insertSampleGTM = () => {
    const headSample = `<!-- Google Tag Manager -->\n<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':\nnew Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],\nj=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=\n'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);\n})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>\n<!-- End Google Tag Manager -->`;
    const bodySample = `<!-- Google Tag Manager (noscript) -->\n<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"\nheight="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>\n<!-- End Google Tag Manager (noscript) -->`;
    setHeaderScripts((prev) => (prev ? `${prev}\n\n${headSample}` : headSample));
    setBodyStartScripts((prev) => (prev ? `${prev}\n\n${bodySample}` : bodySample));
  };

  const insertSampleGSC = () => {
    const sample = `<meta name="google-site-verification" content="YOUR_GOOGLE_SEARCH_CONSOLE_CODE_HERE" />`;
    setHeaderScripts((prev) => (prev ? `${prev}\n\n${sample}` : sample));
  };

  const insertSamplePixel = () => {
    const sample = `<!-- Meta Pixel Code -->\n<script>\n!function(f,b,e,v,n,t,s)\n{if(f.fbq)return;n=f.fbq=function(){n.callMethod?\nn.callMethod.apply(n,arguments):n.queue.push(arguments)};\nif(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';\nn.queue=[];t=b.createElement(e);t.async=!0;\nt.src=v;s=b.getElementsByTagName(e)[0];\ns.parentNode.insertBefore(t,s)}(window, document,'script',\n'https://connect.facebook.net/en_US/fbevents.js');\nfbq('init', 'YOUR_PIXEL_ID');\nfbq('track', 'PageView');\n</script>\n<!-- End Meta Pixel Code -->`;
    setHeaderScripts((prev) => (prev ? `${prev}\n\n${sample}` : sample));
  };

  return (
    <main className="page" style={{ maxWidth: "1000px" }}>
      <div className="intro">
        <p className="eyebrow">Kraviona Administration</p>
        <h1>Site & Tools Management Console</h1>
        <p>
          Configure code injections (GA4, GTM, Meta Pixel, Search Console verification), manage Moz API credentials, enable authority demo mode, and run live diagnostic checks.
        </p>
      </div>

      {loading ? (
        <div style={{ padding: "60px 0", textAlign: "center", color: "var(--muted)" }}>
          <Loader2 className="spin" size={32} style={{ margin: "0 auto 14px" }} />
          <p>Connecting to Kraviona backend settings...</p>
        </div>
      ) : (
        <div className="admin-container">
          {/* Tabs Navigation */}
          <div className="admin-tabs" style={{ display: "flex", gap: "8px", borderBottom: "2px solid var(--line)", marginBottom: "28px" }}>
            <button
              type="button"
              className={`pill-btn ${activeTab === "scripts" ? "active" : ""}`}
              onClick={() => setActiveTab("scripts")}
              style={{ borderRadius: "6px 6px 0 0", borderBottom: "none" }}
            >
              <Code size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
              Code Injections (GA4, GTM, Pixel, GSC)
            </button>
            <button
              type="button"
              className={`pill-btn ${activeTab === "seo" ? "active" : ""}`}
              onClick={() => setActiveTab("seo")}
              style={{ borderRadius: "6px 6px 0 0", borderBottom: "none" }}
            >
              <Sliders size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
              SEO & Authority Settings
            </button>
            <button
              type="button"
              className={`pill-btn ${activeTab === "diagnostics" ? "active" : ""}`}
              onClick={() => setActiveTab("diagnostics")}
              style={{ borderRadius: "6px 6px 0 0", borderBottom: "none" }}
            >
              <Zap size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
              Live Diagnostics Test
            </button>
          </div>

          {/* Feedback Messages */}
          {saveSuccess && (
            <div className="status-banner" style={{ background: "#ecfdf5", borderColor: "#a7f3d0", color: "#065f46", marginBottom: "20px" }}>
              <CheckCircle2 size={20} />
              <div>
                <strong>Saved Successfully</strong>
                <p>{saveSuccess}</p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="status-banner error" style={{ marginBottom: "20px" }}>
              <AlertCircle size={20} />
              <div>
                <strong>Notice</strong>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          {/* TAB 1: CODE INJECTIONS */}
          {activeTab === "scripts" && (
            <form onSubmit={handleSave} className="admin-form-card" style={{ background: "white", padding: "30px", border: "1px solid var(--line)", borderRadius: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <h2 style={{ fontSize: "1.3rem", margin: "0 0 6px" }}>Header Code Injection (&lt;head&gt;)</h2>
                  <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.88rem" }}>
                    Injected into the HTML &lt;head&gt; of all public pages. Perfect for GA4, GTM head scripts, Google Search Console verification meta tags, and Meta Pixels.
                  </p>
                </div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  <button type="button" className="sample-pill" onClick={insertSampleGSC}>+ GSC Meta</button>
                  <button type="button" className="sample-pill" onClick={insertSampleGA4}>+ GA4</button>
                  <button type="button" className="sample-pill" onClick={insertSampleGTM}>+ GTM</button>
                  <button type="button" className="sample-pill" onClick={insertSamplePixel}>+ Pixel</button>
                </div>
              </div>

              <textarea
                value={headerScripts}
                onChange={(e) => setHeaderScripts(e.target.value)}
                placeholder="<!-- Paste <head> tags, meta verification tags, or analytics scripts here -->"
                rows={7}
                style={{ width: "100%", padding: "12px", fontFamily: "monospace", fontSize: "0.85rem", border: "1px solid var(--line-strong)", borderRadius: "6px", marginBottom: "24px" }}
              />

              <h2 style={{ fontSize: "1.3rem", margin: "0 0 6px" }}>Body Start Code (&lt;body&gt; Opening)</h2>
              <p style={{ margin: "0 0 12px", color: "var(--muted)", fontSize: "0.88rem" }}>
                Injected immediately after the opening &lt;body&gt; tag. Recommended for Google Tag Manager (GTM) &lt;noscript&gt; iframes.
              </p>
              <textarea
                value={bodyStartScripts}
                onChange={(e) => setBodyStartScripts(e.target.value)}
                placeholder="<!-- Paste GTM <noscript> or body start tags here -->"
                rows={4}
                style={{ width: "100%", padding: "12px", fontFamily: "monospace", fontSize: "0.85rem", border: "1px solid var(--line-strong)", borderRadius: "6px", marginBottom: "24px" }}
              />

              <h2 style={{ fontSize: "1.3rem", margin: "0 0 6px" }}>Body End Code (Before &lt;/body&gt; Closing)</h2>
              <p style={{ margin: "0 0 12px", color: "var(--muted)", fontSize: "0.88rem" }}>
                Injected right before the closing &lt;/body&gt; tag. Ideal for customer chat widgets, conversion tracking pixels, or third-party footer code.
              </p>
              <textarea
                value={bodyEndScripts}
                onChange={(e) => setBodyEndScripts(e.target.value)}
                placeholder="<!-- Paste chat widgets, footer pixels, or scripts here -->"
                rows={4}
                style={{ width: "100%", padding: "12px", fontFamily: "monospace", fontSize: "0.85rem", border: "1px solid var(--line-strong)", borderRadius: "6px", marginBottom: "24px" }}
              />

              <button type="submit" className="button" disabled={saving} style={{ minWidth: "180px" }}>
                {saving ? <><Loader2 className="spin" size={16} /> Saving...</> : <><Save size={16} style={{ marginRight: "6px" }} /> Save Code Injections</>}
              </button>
            </form>
          )}

          {/* TAB 2: SEO & AUTHORITY SETTINGS */}
          {activeTab === "seo" && (
            <form onSubmit={handleSave} className="admin-form-card" style={{ background: "white", padding: "30px", border: "1px solid var(--line)", borderRadius: "8px" }}>
              <div style={{ marginBottom: "24px" }}>
                <h2 style={{ fontSize: "1.3rem", margin: "0 0 6px" }}>Moz API Configuration (DA / PA / Spam Score)</h2>
                <p style={{ color: "var(--muted)", fontSize: "0.88rem", margin: 0 }}>
                  Enter your licensed Moz API v2 credentials to fetch live Domain Authority and Page Authority scores.
                </p>
              </div>

              <div style={{ display: "grid", gap: "18px", marginBottom: "28px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "6px" }}>
                    Moz Access ID
                  </label>
                  <input
                    type="text"
                    value={mozAccessId}
                    onChange={(e) => setMozAccessId(e.target.value)}
                    placeholder="e.g., moz-access-id-xxxx"
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--line-strong)", borderRadius: "6px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "6px" }}>
                    Moz Secret Key
                  </label>
                  <input
                    type="password"
                    value={mozSecretKey}
                    onChange={(e) => setMozSecretKey(e.target.value)}
                    placeholder="••••••••••••••••••••••••"
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--line-strong)", borderRadius: "6px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "6px" }}>
                    Alternative: Moz Token / Bearer Key
                  </label>
                  <input
                    type="text"
                    value={mozApiKey}
                    onChange={(e) => setMozApiKey(e.target.value)}
                    placeholder="e.g., x-moz-token"
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--line-strong)", borderRadius: "6px" }}
                  />
                </div>
              </div>

              {/* Demo Mode Toggle */}
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "20px", borderRadius: "6px", marginBottom: "28px" }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={enableDemoAuthority}
                    onChange={(e) => setEnableDemoAuthority(e.target.checked)}
                    style={{ width: "18px", height: "18px", accentColor: "var(--green)", marginTop: "2px" }}
                  />
                  <div>
                    <strong style={{ fontSize: "0.95rem", color: "#166534" }}>Enable Authority Demo Mode (For Testing without Moz Paid API)</strong>
                    <p style={{ margin: "4px 0 0", fontSize: "0.84rem", color: "#15803d" }}>
                      If you don't currently have a paid Moz API plan, enabling this will compute deterministic benchmark scores (DA 1-100, PA, Spam Score) alongside authentic live RDAP domain age so you can preview the complete user experience!
                    </p>
                  </div>
                </label>
              </div>

              <button type="submit" className="button" disabled={saving} style={{ minWidth: "180px" }}>
                {saving ? <><Loader2 className="spin" size={16} /> Saving...</> : <><Save size={16} style={{ marginRight: "6px" }} /> Save SEO Settings</>}
              </button>
            </form>
          )}

          {/* TAB 3: DIAGNOSTICS */}
          {activeTab === "diagnostics" && (
            <div className="admin-form-card" style={{ background: "white", padding: "30px", border: "1px solid var(--line)", borderRadius: "8px" }}>
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ fontSize: "1.3rem", margin: "0 0 6px" }}>Live Endpoint Diagnostic Test</h2>
                <p style={{ color: "var(--muted)", fontSize: "0.88rem", margin: 0 }}>
                  Test the backend API connection, RDAP registry lookup, and SEO Provider directly to confirm end-to-end functionality.
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
                <input
                  type="text"
                  value={testDomain}
                  onChange={(e) => setTestDomain(e.target.value)}
                  placeholder="Enter test domain (e.g. kraviona.site or github.com)"
                  style={{ flex: 1, padding: "10px 14px", border: "1px solid var(--line-strong)", borderRadius: "6px" }}
                />
                <button type="button" className="button" onClick={handleRunDiagnostic} disabled={diagLoading}>
                  {diagLoading ? <><Loader2 className="spin" size={16} /> Testing...</> : "Run Diagnostic"}
                </button>
              </div>

              {diagError && (
                <div className="status-banner error" style={{ marginBottom: "20px" }}>
                  <AlertCircle size={20} />
                  <div>
                    <strong>Diagnostic Error</strong>
                    <p>{diagError}</p>
                  </div>
                </div>
              )}

              {diagResult && (
                <div style={{ background: "#f8faf9", border: "1px solid var(--line)", borderRadius: "6px", padding: "20px" }}>
                  <h3 style={{ margin: "0 0 12px", fontSize: "1.1rem" }}>Diagnostic Report for: <strong>{diagResult.domain}</strong></h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ background: "white", padding: "12px", border: "1px solid var(--line)", borderRadius: "4px" }}>
                      <span style={{ fontSize: "0.78rem", color: "var(--muted)", display: "block" }}>Domain Age</span>
                      <strong style={{ fontSize: "1.2rem", color: "var(--green)" }}>
                        {diagResult.domainAge.available ? diagResult.domainAge.age : "Unavailable"}
                      </strong>
                      <small style={{ display: "block", color: "var(--muted)", marginTop: "4px" }}>
                        {diagResult.domainAge.available ? `Registered: ${new Date(diagResult.domainAge.createdAt).toLocaleDateString()}` : diagResult.domainAge.reason}
                      </small>
                    </div>

                    <div style={{ background: "white", padding: "12px", border: "1px solid var(--line)", borderRadius: "4px" }}>
                      <span style={{ fontSize: "0.78rem", color: "var(--muted)", display: "block" }}>Registrar</span>
                      <strong style={{ fontSize: "1.1rem" }}>
                        {diagResult.domainAge.registrar || "Not specified"}
                      </strong>
                    </div>

                    <div style={{ background: "white", padding: "12px", border: "1px solid var(--line)", borderRadius: "4px" }}>
                      <span style={{ fontSize: "0.78rem", color: "var(--muted)", display: "block" }}>Domain Authority (DA)</span>
                      <strong style={{ fontSize: "1.2rem" }}>
                        {diagResult.metrics.available && diagResult.metrics.domainAuthority !== null ? `${diagResult.metrics.domainAuthority} / 100` : "Unconfigured"}
                      </strong>
                      <small style={{ display: "block", color: "var(--muted)", marginTop: "4px" }}>
                        Provider: {diagResult.metrics.provider}
                      </small>
                    </div>

                    <div style={{ background: "white", padding: "12px", border: "1px solid var(--line)", borderRadius: "4px" }}>
                      <span style={{ fontSize: "0.78rem", color: "var(--muted)", display: "block" }}>Page Authority (PA)</span>
                      <strong style={{ fontSize: "1.2rem" }}>
                        {diagResult.metrics.available && diagResult.metrics.pageAuthority !== null ? `${diagResult.metrics.pageAuthority} / 100` : "Unconfigured"}
                      </strong>
                    </div>
                  </div>

                  <pre style={{ background: "#111827", color: "#34d399", padding: "14px", borderRadius: "6px", fontSize: "0.78rem", overflowX: "auto" }}>
                    {JSON.stringify(diagResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
