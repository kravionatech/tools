"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Calendar,
  ShieldAlert,
  BarChart3,
  Globe,
  HelpCircle,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";

export default function DomainChecker({ initialDomain = "" }) {
  const [domain, setDomain] = useState(initialDomain);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const checkDomain = async (e, customDomain) => {
    if (e) e.preventDefault();
    const targetDomain = customDomain || domain;
    if (!targetDomain.trim()) return;

    setLoading(true);
    setError("");
    setData(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    try {
      const response = await fetch(`${apiUrl}/api/seo/domain-check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: targetDomain }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.message || "Failed to retrieve domain information.");
      }

      setData(json.data);
    } catch (err) {
      setError(err.message || "Unable to reach lookup service. Please verify the domain and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (example) => {
    setDomain(example);
    checkDomain(null, example);
  };

  return (
    <div className="domain-checker-container">
      <form className="domain-form-card" onSubmit={(e) => checkDomain(e)}>
        <div className="domain-input-group">
          <Globe className="input-icon" size={20} />
          <input
            type="text"
            required
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Enter domain or URL (e.g., kraviona.site or github.com)"
            aria-label="Domain or URL"
            disabled={loading}
          />
          <button type="submit" className="button check-btn" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="spin" size={18} />
                <span>Checking...</span>
              </>
            ) : (
              <>
                <Search size={18} />
                <span>Check Domain</span>
              </>
            )}
          </button>
        </div>

        <div className="example-domains">
          <span className="example-label">Quick samples:</span>
          {["github.com", "wikipedia.org", "kraviona.site"].map((sample) => (
            <button
              key={sample}
              type="button"
              className="sample-pill"
              onClick={() => handleExampleClick(sample)}
              disabled={loading}
            >
              {sample}
            </button>
          ))}
        </div>
      </form>

      {error && (
        <div className="status-banner error" role="alert">
          <AlertTriangle size={20} />
          <div>
            <strong>Lookup Error</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      {data && (
        <div className="results-wrapper">
          <div className="results-header">
            <div>
              <p className="eyebrow">Audit Results</p>
              <h3>Domain Report for: <strong>{data.domain}</strong></h3>
            </div>
            <span className="check-time">
              Checked on: {new Date(data.checkedAt).toLocaleDateString()} at{" "}
              {new Date(data.checkedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>

          <div className="metrics-grid">
            {/* Domain Authority */}
            <div className="metric-card">
              <div className="metric-top">
                <BarChart3 className="metric-icon" size={20} />
                <span>Domain Authority (DA)</span>
              </div>
              <div className="metric-value">
                {data.metrics.available && data.metrics.domainAuthority !== null ? (
                  <span className="score-live">{data.metrics.domainAuthority} / 100</span>
                ) : (
                  <span className="badge-unconfigured">Unconfigured</span>
                )}
              </div>
              <p className="metric-note">
                {data.metrics.available
                  ? `Supplied via ${data.metrics.provider}`
                  : "Proprietary Moz metric. Live data requires Moz API credentials. Kraviona never fabricates scores."}
              </p>
            </div>

            {/* Page Authority */}
            <div className="metric-card">
              <div className="metric-top">
                <BarChart3 className="metric-icon" size={20} />
                <span>Page Authority (PA)</span>
              </div>
              <div className="metric-value">
                {data.metrics.available && data.metrics.pageAuthority !== null ? (
                  <span className="score-live">{data.metrics.pageAuthority} / 100</span>
                ) : (
                  <span className="badge-unconfigured">Unconfigured</span>
                )}
              </div>
              <p className="metric-note">
                {data.metrics.available
                  ? `Root URL score via ${data.metrics.provider}`
                  : "Requires licensed SEO provider. Unconfigured to protect data truthfulness."}
              </p>
            </div>

            {/* Spam Score */}
            <div className="metric-card">
              <div className="metric-top">
                <ShieldAlert className="metric-icon" size={20} />
                <span>Spam Score</span>
              </div>
              <div className="metric-value">
                {data.metrics.available && data.metrics.spamScore !== null ? (
                  <span className="score-live">{data.metrics.spamScore}%</span>
                ) : (
                  <span className="badge-unconfigured">Unconfigured</span>
                )}
              </div>
              <p className="metric-note">
                {data.metrics.available
                  ? "Risk estimate based on backlink profile similarities"
                  : "Third-party spam signal. Available when provider is connected."}
              </p>
            </div>

            {/* Domain Age */}
            <div className="metric-card featured">
              <div className="metric-top">
                <Calendar className="metric-icon active" size={20} />
                <span>Authoritative Domain Age</span>
              </div>
              <div className="metric-value">
                {data.domainAge.available ? (
                  <span className="age-live">{data.domainAge.age}</span>
                ) : (
                  <span className="badge-notice">Private/Restricted</span>
                )}
              </div>
              <p className="metric-note">
                {data.domainAge.available ? (
                  <>
                    Registered: <strong>{new Date(data.domainAge.createdAt).toLocaleDateString()}</strong>
                    {data.domainAge.registrar ? ` via ${data.domainAge.registrar}` : ""}
                  </>
                ) : (
                  data.domainAge.reason || "Registry registration date hidden by privacy."
                )}
              </p>
            </div>
          </div>

          {/* Technical Registry Metadata */}
          {data.domainAge.available && (
            <div className="registry-details">
              <div className="detail-item">
                <span>Registrar:</span>
                <strong>{data.domainAge.registrar || "Not disclosed"}</strong>
              </div>
              {data.domainAge.expiresAt && (
                <div className="detail-item">
                  <span>Expiration Date:</span>
                  <strong>{new Date(data.domainAge.expiresAt).toLocaleDateString()}</strong>
                </div>
              )}
              {data.domainAge.status && data.domainAge.status.length > 0 && (
                <div className="detail-item">
                  <span>Registry Status:</span>
                  <strong>{data.domainAge.status.join(", ")}</strong>
                </div>
              )}
            </div>
          )}

          {/* Educational Guides Callout */}
          <div className="tool-cta-box">
            <div className="cta-content">
              <h4>Want to learn how to improve your domain authority safely?</h4>
              <p>
                Read our in-depth analysis on Domain Authority vs Page Authority, ranking factors, and how domain age influences search engine trust.
              </p>
            </div>
            <div className="cta-links">
              <Link href="/blog/what-is-domain-authority" className="cta-link-btn">
                What is DA? Guide <ExternalLink size={14} />
              </Link>
              <Link href="/blog/da-vs-pa" className="cta-link-btn alt">
                DA vs PA Comparison <ExternalLink size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
