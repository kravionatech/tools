import { config } from "../config/config.js";
import { getSettings } from "../settings.js";

/**
 * SEO Provider Interface & Implementation
 * 
 * Supports:
 * 1. Live Moz API v2 (credentials from .env or Admin Settings)
 * 2. Demo Authority Mode (toggled from Admin Settings)
 * 3. Transparent Unconfigured Status (default)
 */

export class MozProvider {
  getCredentials() {
    const settings = getSettings();
    return {
      accessId: settings.mozAccessId || config.MOZ_ACCESS_ID,
      secretKey: settings.mozSecretKey || config.MOZ_SECRET_KEY,
      apiKey: settings.mozApiKey || config.MOZ_API_KEY,
      enableDemoAuthority: Boolean(settings.enableDemoAuthority),
    };
  }

  isConfigured() {
    const { accessId, secretKey, apiKey, enableDemoAuthority } = this.getCredentials();
    return Boolean((accessId && secretKey) || apiKey || enableDemoAuthority);
  }

  async fetchMetrics(domain) {
    const { accessId, secretKey, apiKey, enableDemoAuthority } = this.getCredentials();

    // 1. Live Moz API
    if ((accessId && secretKey) || apiKey) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        const headers = {
          "Content-Type": "application/json",
          "User-Agent": "Kraviona-SEO-Platform/1.0 (+https://kraviona.site)",
        };

        if (apiKey) {
          headers["x-moz-token"] = apiKey;
        } else {
          const auth = Buffer.from(`${accessId}:${secretKey}`).toString("base64");
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
            reason: "No metric records found for this domain in Moz index.",
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

    // 2. Demo Authority Mode (Enabled via Admin)
    if (enableDemoAuthority) {
      // Deterministic calculation based on domain hash
      let hash = 0;
      for (let i = 0; i < domain.length; i++) {
        hash = (hash << 5) - hash + domain.charCodeAt(i);
        hash |= 0;
      }
      const absHash = Math.abs(hash);
      const da = Math.max(12, (absHash % 75) + 15);
      const pa = Math.max(10, Math.min(da - 5, (absHash % 60) + 10));
      const spam = (absHash % 12);

      return {
        available: true,
        provider: "Kraviona Authority Engine (Admin Demo Mode)",
        domainAuthority: da,
        pageAuthority: pa,
        spamScore: spam,
        note: "Configured via Admin Panel Demo Mode.",
      };
    }

    // 3. Unconfigured Status
    return {
      available: false,
      provider: "Moz API v2",
      reason:
        "Licensed Moz API credentials not configured. You can configure credentials or enable Demo Mode in the Admin Panel.",
      domainAuthority: null,
      pageAuthority: null,
      spamScore: null,
    };
  }
}

export const seoProvider = new MozProvider();
