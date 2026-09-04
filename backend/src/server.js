import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./db.js";
import { config } from "./config/config.js";
import User from "./model/user.model.js";
import { domainAge, normalizeDomain } from "./seo.js";
import { seoProvider } from "./providers/seoProvider.js";
import { getSettings, getPublicSettings, updateSettings } from "./settings.js";

const app = express();

// IP-based sliding rate limiter
const rateLimitMap = new Map();

function rateLimiter(req, res, next) {
  const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const windowMs = config.RATE_LIMIT_WINDOW_MS;
  const max = config.RATE_LIMIT_MAX;

  const timestamps = (rateLimitMap.get(ip) || []).filter((time) => now - time < windowMs);
  
  const remaining = Math.max(0, max - timestamps.length);
  res.setHeader("X-RateLimit-Limit", max);
  res.setHeader("X-RateLimit-Remaining", remaining);
  res.setHeader("X-RateLimit-Reset", Math.ceil((now + windowMs) / 1000));

  if (timestamps.length >= max) {
    return res.status(429).json({
      success: false,
      message: `Rate limit exceeded. Please wait a moment before running another check.`,
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    });
  }

  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  next();
}

// Clean up stale rate limiter entries every 10 minutes
setInterval(() => {
  const cutoff = Date.now() - config.RATE_LIMIT_WINDOW_MS;
  for (const [ip, timestamps] of rateLimitMap.entries()) {
    const fresh = timestamps.filter((t) => t > cutoff);
    if (fresh.length === 0) {
      rateLimitMap.delete(ip);
    } else {
      rateLimitMap.set(ip, fresh);
    }
  }
}, 10 * 60 * 1000);

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow all requests in development or if matching configured client origin
    if (!origin || origin === config.CLIENT_ORIGIN || origin.includes("localhost") || origin.includes("127.0.0.1") || origin.includes("kraviona.site")) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive for public SEO API tools
  },
  credentials: true,
}));

app.use(express.json({ limit: "500kb" }));
app.use(morgan("dev"));

// Settings endpoints
app.get("/api/settings", (req, res) => {
  return res.json({ success: true, data: getPublicSettings() });
});

app.get("/api/admin/settings", (req, res) => {
  return res.json({ success: true, data: getSettings() });
});

app.post("/api/admin/settings", (req, res) => {
  try {
    const updated = updateSettings(req.body);
    return res.json({ success: true, message: "Settings saved successfully", data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Root & Health
app.get("/", (req, res) => {
  res.json({
    service: "kraviona-api",
    version: "1.0.0",
    status: "online",
    docs: "https://kraviona.site",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  });
});

// Domain & SEO Check Route
app.post("/api/seo/domain-check", rateLimiter, async (req, res) => {
  try {
    const rawDomain = req.body?.domain;
    if (!rawDomain) {
      return res.status(400).json({
        success: false,
        message: "Domain or URL is required in request body.",
      });
    }

    const domain = normalizeDomain(rawDomain);

    // Concurrently fetch domain age (RDAP) and SEO authority metrics (Moz Provider)
    const [ageResult, metricsResult] = await Promise.all([
      domainAge(domain),
      seoProvider.fetchMetrics(domain),
    ]);

    return res.json({
      success: true,
      data: {
        domain,
        domainAge: ageResult,
        metrics: metricsResult,
        checkedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to process domain check request.",
    });
  }
});

// Users management endpoint
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({ deletedAt: null }).select("-password").lean();
    return res.json({ success: true, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 404 handler for API routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Gracefully connect to DB without blocking HTTP server
connectDB().catch((error) => console.warn(`MongoDB notice: ${error.message} (Continuing in memory-only mode)`));

const port = config.PORT;
export const server = app.listen(port, () => {
  console.log(`Kraviona API listening on port ${port}`);
});

export default app;
