import { config } from "../config/config.js";

/**
 * SEO Provider Interface & Implementation
 * 
 * In accordance with strict SEO data rules:
 * - DA, PA, and Spam Score are proprietary metrics (primarily Moz).
 * - We NEVER fabricate or generate random scores.
 * - If licensed Moz credentials are provided in .env, live metrics are fetched.
 * - Otherwise, an honest unavailable status is returned detailing configuration steps.
 */

export class MozProvider {
  constructor(options = {}) {
    this.accessId = options.accessId || config.MOZ_ACCESS_ID;
    this.secretKey = options.secretKey || config.MOZ_SECRET_KEY;
    this.apiKey = options.apiKey || config.MOZ_API_KEY;
  }

  isConfigured() {
    return Boolean((this.accessId && this.secretKey) || this.apiKey);
  }

  async fetchMetrics(domain) {
    if (!this.isConfigured()) {
      return {
        available: false,
        provider: "Moz API v2",
        reason:
          "Licensed Moz API credentials not configured. Configure MOZ_ACCESS_ID and MOZ_SECRET_KEY in backend/.env to enable live Domain Authority, Page Authority, and Spam Score.",
        domainAuthority: null,
        pageAuthority: null,
        spamScore: null,
      };
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const headers = {
        "Content-Type": "application/json",
        "User-Agent": "Kraviona-SEO-Platform/1.0 (+https://kraviona.site)",
      };

      if (this.apiKey) {
        headers["x-moz-token"] = this.apiKey;
      } else {
        const auth = Buffer.from(`${this.accessId}:${this.secretKey}`).toString("base64");
        headers["Authorization"] = `Basic ${auth}`;
      }

      const response = await fetch("https://lsapi.seomoz.com/v2/url_metrics", {
        method: "POST",
        headers,
        body: JSON.stringify({ targets: [domain] }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        return {
          available: false,
          provider: "Moz API v2",
          reason: `Moz API returned HTTP ${response.status}: ${response.statusText}`,
          domainAuthority: null,
          pageAuthority: null,
          spamScore: null,
        };
      }

      const json = await response.json();
      const result = json?.results?.[0];

      if (!result) {
        return {
          available: false,
          provider: "Moz API v2",
          reason: "No metric records found for this domain.",
          domainAuthority: null,
          pageAuthority: null,
          spamScore: null,
        };
      }

      return {
        available: true,
        provider: "Moz API v2",
        domainAuthority: typeof result.domain_authority === "number" ? Math.round(result.domain_authority) : null,
        pageAuthority: typeof result.page_authority === "number" ? Math.round(result.page_authority) : null,
        spamScore: typeof result.spam_score === "number" ? Math.round(result.spam_score) : null,
        linkingDomains: result.root_domains_to_root_domain || null,
        totalInboundLinks: result.pages_to_root_domain || null,
      };
    } catch (err) {
      return {
        available: false,
        provider: "Moz API v2",
        reason: err.name === "AbortError" ? "Moz API request timed out." : `Moz API error: ${err.message}`,
        domainAuthority: null,
        pageAuthority: null,
        spamScore: null,
      };
    }
  }
}

// Default provider instance
export const seoProvider = new MozProvider();
