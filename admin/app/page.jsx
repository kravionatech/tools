"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("scripts"); // 'scripts' | 'seo' | 'diagnostics'
  
  const [headerScripts, setHeaderScripts] = useState("");
  const [bodyStartScripts, setBodyStartScripts] = useState("");
  const [bodyEndScripts, setBodyEndScripts] = useState("");
  const [mozAccessId, setMozAccessId] = useState("");
  const [mozSecretKey, setMozSecretKey] = useState("");
  const [mozApiKey, setMozApiKey] = useState("");
  const [enableDemoAuthority, setEnableDemoAuthority] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [testDomain, setTestDomain] = useState("kraviona.site");
  const [diagResult, setDiagResult] = useState(null);
  const [diagLoading, setDiagLoading] = useState(false);
  const [diagError, setDiagError] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
        setErrorMessage("Could not connect to backend settings endpoint. Ensure the backend API is running on port 5000.");
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
      if (!res.ok || !json.success) throw new Error(json.message || "Failed to save settings.");

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
      if (!res.ok || !json.success) throw new Error(json.message || "Diagnostic test failed");
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
    <main>
      <div className="header-bar">
        <p className="eyebrow">Kraviona / Operations Console</p>
        <h1>Site & Tools Management</h1>
        <p className="subtitle">
          Manage header and body code injections (GA4, GTM, Meta Pixel, GSC verification), SEO provider credentials, and system diagnostics.
        </p>
      </div>

      {loading ? (
        <div style={{ padding: "40px 0", textAlign: "center", color: "#666" }}>
          <p>Connecting to backend API...</p>
        </div>
      ) : (
        <div>
          {/* Tabs */}
          <div className="tabs-nav">
            <button
              type="button"
              className={`tab-btn ${activeTab === "scripts" ? "active" : ""}`}
              onClick={() => setActiveTab("scripts")}
            >
              Code Injections (GA4, GTM, Pixel, GSC)
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === "seo" ? "active" : ""}`}
              onClick={() => setActiveTab("seo")}
            >
              SEO & Moz Authority Settings
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === "diagnostics" ? "active" : ""}`}
              onClick={() => setActiveTab("diagnostics")}
            >
              Live Diagnostics Test
            </button>
          </div>

          {saveSuccess && <div className="alert success">{saveSuccess}</div>}
          {errorMessage && <div className="alert error">{errorMessage}</div>}

          {/* TAB 1: CODE INJECTIONS */}
          {activeTab === "scripts" && (
            <form onSubmit={handleSave} className="card-box">
              <div className="title-row">
                <h3>Header Code Injection (&lt;head&gt;)</h3>
                <div className="btn-group">
                  <button type="button" className="pill" onClick={insertSampleGSC}>+ GSC Verification</button>
                  <button type="button" className="pill" onClick={insertSampleGA4}>+ GA4</button>
                  <button type="button" className="pill" onClick={insertSampleGTM}>+ GTM</button>
                  <button type="button" className="pill" onClick={insertSamplePixel}>+ Meta Pixel</button>
                </div>
              </div>
              <p className="hint">Injected into the &lt;head&gt; of all website pages.</p>
              <textarea
                value={headerScripts}
                onChange={(e) => setHeaderScripts(e.target.value)}
                placeholder="<!-- Paste <head> tags, meta verification tags, or analytics scripts here -->"
                rows={7}
                className="code-area"
              />

              <div className="title-row" style={{ marginTop: "24px" }}>
                <h3>Body Start Code (&lt;body&gt; Opening)</h3>
              </div>
              <p className="hint">Injected immediately after opening &lt;body&gt; tag (e.g. GTM noscript iframe).</p>
              <textarea
                value={bodyStartScripts}
                onChange={(e) => setBodyStartScripts(e.target.value)}
                placeholder="<!-- Paste GTM <noscript> or body start tags here -->"
                rows={4}
                className="code-area"
              />

              <div className="title-row" style={{ marginTop: "24px" }}>
                <h3>Body End Code (Before &lt;/body&gt; Closing)</h3>
              </div>
              <p className="hint">Injected right before closing &lt;/body&gt; tag (e.g. Chat widgets, footer tracking).</p>
              <textarea
                value={bodyEndScripts}
                onChange={(e) => setBodyEndScripts(e.target.value)}
                placeholder="<!-- Paste chat widgets, footer pixels, or scripts here -->"
                rows={4}
                className="code-area"
              />

              <button type="submit" className="save-btn" disabled={saving}>
                {saving ? "Saving..." : "Save Code Injections"}
              </button>
            </form>
          )}

          {/* TAB 2: SEO SETTINGS */}
          {activeTab === "seo" && (
            <form onSubmit={handleSave} className="card-box">
              <h3>Moz API Credentials (DA / PA / Spam Score)</h3>
              <p className="hint">Enter Moz API v2 credentials to fetch live Domain and Page Authority metrics.</p>

              <div className="field-group">
                <label>Moz Access ID</label>
                <input
                  type="text"
                  value={mozAccessId}
                  onChange={(e) => setMozAccessId(e.target.value)}
                  placeholder="e.g. moz-access-id-xxxx"
                  className="text-input"
                />
              </div>

              <div className="field-group">
                <label>Moz Secret Key</label>
                <input
                  type="password"
                  value={mozSecretKey}
                  onChange={(e) => setMozSecretKey(e.target.value)}
                  placeholder="••••••••••••••••••••••••"
                  className="text-input"
                />
              </div>

              <div className="field-group">
                <label>Alternative: Moz Bearer Token</label>
                <input
                  type="text"
                  value={mozApiKey}
                  onChange={(e) => setMozApiKey(e.target.value)}
                  placeholder="e.g. x-moz-token"
                  className="text-input"
                />
              </div>

              <div className="demo-toggle-box">
                <label style={{ display: "flex", gap: "10px", alignItems: "flex-start", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={enableDemoAuthority}
                    onChange={(e) => setEnableDemoAuthority(e.target.checked)}
                    style={{ marginTop: "4px", width: "18px", height: "18px" }}
                  />
                  <div>
                    <strong>Enable Authority Demo Mode (Testing without Moz Paid Plan)</strong>
                    <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "#166534" }}>
                      Enabling this computes deterministic benchmark scores (DA, PA, Spam Score) alongside authentic live RDAP domain age for full functionality demo!
                    </p>
                  </div>
                </label>
              </div>

              <button type="submit" className="save-btn" disabled={saving}>
                {saving ? "Saving..." : "Save SEO Settings"}
              </button>
            </form>
          )}

          {/* TAB 3: DIAGNOSTICS */}
          {activeTab === "diagnostics" && (
            <div className="card-box">
              <h3>Live Endpoint Diagnostic Test</h3>
              <p className="hint">Test domain age lookup and authority scores directly through the backend API.</p>

              <div style={{ display: "flex", gap: "10px", margin: "16px 0 20px" }}>
                <input
                  type="text"
                  value={testDomain}
                  onChange={(e) => setTestDomain(e.target.value)}
                  className="text-input"
                  style={{ flex: 1 }}
                />
                <button type="button" className="save-btn" onClick={handleRunDiagnostic} disabled={diagLoading}>
                  {diagLoading ? "Testing..." : "Run Test"}
                </button>
              </div>

              {diagError && <div className="alert error">{diagError}</div>}

              {diagResult && (
                <div style={{ background: "#f8faf9", padding: "16px", borderRadius: "6px", border: "1px solid #ddd" }}>
                  <h4>Results for {diagResult.domain}</h4>
                  <p><strong>Domain Age:</strong> {diagResult.domainAge.available ? diagResult.domainAge.age : "Unavailable"} ({diagResult.domainAge.registrar || "No registrar"})</p>
                  <p><strong>DA / PA:</strong> {diagResult.metrics.available ? `${diagResult.metrics.domainAuthority} / ${diagResult.metrics.pageAuthority}` : "Unconfigured"}</p>
                  <pre style={{ background: "#111", color: "#4ade80", padding: "12px", borderRadius: "4px", fontSize: "0.8rem", overflowX: "auto" }}>
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
