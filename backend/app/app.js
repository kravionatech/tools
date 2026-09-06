import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import apiConfigRoutes from "./routes/api-config.routes.js";
import activityRoutes from "./routes/activity.routes.js";
import systemRoutes from "./routes/system.routes.js";
import toolsRoutes from "./routes/tools.routes.js";
import contentRoutes from "./routes/content.routes.js";
import customCodeRoutes from "./routes/custom-code.routes.js";
import seoSettingsRoutes from "./routes/seo-settings.routes.js";
import { notFoundHandler, globalErrorHandler } from "./middleware/error.middleware.js";

export const app = express();

app.disable("x-powered-by");
app.use(helmet({ contentSecurityPolicy: false })); // allow custom script tag injection
app.use(cors({ origin: config.clientOrigin, credentials: true }));
app.use(express.json({ limit: "64kb" }));
app.use(express.urlencoded({ extended: false, limit: "64kb" }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many authentication attempts. Try again later." },
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "kraviona-backend", timestamp: new Date() });
});

// Crawler & SEO routes (Public & Admin)
app.use("/api/seo", seoSettingsRoutes);
app.use("/api/settings/seo", seoSettingsRoutes);

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/settings/custom-code", customCodeRoutes);
app.use("/api/custom-code", customCodeRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/configured-apis", apiConfigRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/system", systemRoutes);
app.use("/api/tools", toolsRoutes);
app.use("/api/content", contentRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);