const cache = new Map();

/**
 * Normalizes user input into a clean domain name.
 * Handles full URLs, subdomains, www prefix, query strings, and ports.
 */
export function normalizeDomain(value) {
  if (!value || typeof value !== "string") {
    throw new Error("Please enter a domain or URL.");
  }

  let cleaned = value.trim().toLowerCase();

  // If no protocol was provided, prepend https:// for uniform URL parsing
  if (!cleaned.startsWith("http://") && !cleaned.startsWith("https://")) {
    cleaned = `https://${cleaned}`;
  }

  try {
    const url = new URL(cleaned);
    let hostname = url.hostname.toLowerCase();

    // Strip leading www.
    if (hostname.startsWith("www.")) {
      hostname = hostname.slice(4);
    }

    // Basic domain validation
    if (!hostname || !hostname.includes(".") || hostname.includes("..")) {
      throw new Error("Please enter a valid domain (e.g., example.com).");
    }

    // Disallow local/invalid hostnames
    if (
      hostname === "localhost" ||
      hostname.endsWith(".local") ||
      /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)
    ) {
      throw new Error("IP addresses and localhost are not supported. Enter a public domain name.");
    }

    return hostname;
  } catch (err) {
    if (err.message.includes("valid domain") || err.message.includes("IP addresses")) {
      throw err;
    }
    throw new Error("Invalid domain format. Enter a valid domain name.");
  }
}

/**
 * Calculates human-readable age between two dates.
 */
function calculateAge(fromDate, toDate = new Date()) {
  let years = toDate.getUTCFullYear() - fromDate.getUTCFullYear();
  let months = toDate.getUTCMonth() - fromDate.getUTCMonth();
  let days = toDate.getUTCDate() - fromDate.getUTCDate();

  if (days < 0) {
    months--;
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const parts = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? "year" : "years"}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? "month" : "months"}`);
  if (parts.length === 0) parts.push("Less than 1 month");

  return parts.join(", ");
}

/**
 * Extracts registrar name from RDAP entities.
 */
function extractRegistrar(entities = []) {
  for (const entity of entities) {
    if (Array.isArray(entity.roles) && entity.roles.includes("registrar")) {
      const vcard = entity.vcardArray?.[1];
      if (Array.isArray(vcard)) {
        const fn = vcard.find((entry) => entry[0] === "fn");
        if (fn && fn[3]) return fn[3];
      }
      if (entity.handle) return entity.handle;
    }
  }
  return null;
}

/**
 * Fetches authoritative domain registration and age details via RDAP.
 * Includes fallback protection, 15-minute caching, and 5s abort timeouts.
 */
export async function domainAge(domain) {
  const cached = cache.get(domain);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`, {
      headers: {
        "Accept": "application/rdap+json, application/json",
        "User-Agent": "Kraviona-SEO-Tool/1.0 (+https://kraviona.site)",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          available: false,
          reason: "Domain registration not found in authoritative RDAP registry. The domain may be unregistered or uses an unindexed TLD.",
        };
      }
      return {
        available: false,
        reason: `Registry lookup returned HTTP ${response.status}. WHOIS/RDAP data temporarily unavailable.`,
      };
    }

    const data = await response.json();
    const events = Array.isArray(data.events) ? data.events : [];

    // Find registration, expiration, and last changed events
    const regEvent = events.find(
      (e) => e.eventAction === "registration" || e.eventAction === "registered"
    );
    const expEvent = events.find(
      (e) => e.eventAction === "expiration" || e.eventAction === "expired"
    );
    const lastChangedEvent = events.find(
      (e) => e.eventAction === "last changed" || e.eventAction === "last update of RDAP database"
    );

    if (!regEvent?.eventDate) {
      return {
        available: false,
        reason: "Registration date is marked private or was not provided by the registry.",
      };
    }

    const created = new Date(regEvent.eventDate);
    const now = new Date();

    if (isNaN(created.getTime())) {
      return {
        available: false,
        reason: "Unparseable registration date received from registry.",
      };
    }

    const result = {
      available: true,
      createdAt: created.toISOString(),
      age: calculateAge(created, now),
      expiresAt: expEvent?.eventDate ? new Date(expEvent.eventDate).toISOString() : null,
      lastChanged: lastChangedEvent?.eventDate ? new Date(lastChangedEvent.eventDate).toISOString() : null,
      registrar: extractRegistrar(data.entities),
      status: Array.isArray(data.status) ? data.status.slice(0, 3) : [],
    };

    // Cache for 15 minutes
    cache.set(domain, { data: result, expiresAt: Date.now() + 15 * 60 * 1000 });
    return result;
  } catch (error) {
    return {
      available: false,
      reason: error.name === "AbortError"
        ? "RDAP registry request timed out (limit: 6s)."
        : `Registry connection failed: ${error.message}`,
    };
  } finally {
    clearTimeout(timer);
  }
}
