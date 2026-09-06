import mongoose from "mongoose";
import { config } from "../config/env.js";
import { EventModel } from "../model/analytics/event.model.js";
import { ApiConfigModel } from "../model/settings/api-config.model.js";

export async function getSystemStatus(_req, res) {
  const startTime = Date.now();
  let dbStatus = "operational";
  let dbLatencyMs = 0;
  let totalEvents = 0;
  let lastEventTime = null;

  try {
    if (mongoose.connection.readyState === 1) {
      const pingStart = Date.now();
      await mongoose.connection.db.admin().ping();
      dbLatencyMs = Date.now() - pingStart;

      const [count, latest] = await Promise.all([
        EventModel.countDocuments(),
        EventModel.findOne().sort({ createdAt: -1 }).select("createdAt").lean(),
      ]);
      totalEvents = count;
      lastEventTime = latest ? latest.createdAt : null;
    } else {
      dbStatus = mongoose.connection.readyState === 2 ? "connecting" : "disconnected";
    }
  } catch (err) {
    dbStatus = "error";
  }

  // Check configured APIs
  let configuredApisCount = 0;
  let activeApisCount = 0;
  try {
    const apis = await ApiConfigModel.find().lean();
    configuredApisCount = apis.length;
    activeApisCount = apis.filter((a) => a.enabled).length;
  } catch {}

  const mem = process.memoryUsage();

  const statusReport = {
    backend: {
      status: "operational",
      uptimeSeconds: Math.floor(process.uptime()),
      nodeVersion: process.version,
      memoryUsageMb: Math.round(mem.rss / (1024 * 1024)),
      environment: config.nodeEnv || "development",
    },
    database: {
      status: dbStatus,
      connectionState: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
      pingLatencyMs: dbLatencyMs,
      databaseName: mongoose.connection.name || "kravionatools",
    },
    analytics: {
      status: totalEvents > 0 ? "operational" : "awaiting_traffic",
      totalRecordedEvents: totalEvents,
      lastEventTimestamp: lastEventTime,
    },
    apis: {
      status: configuredApisCount === 0 ? "none_configured" : activeApisCount > 0 ? "operational" : "all_disabled",
      totalConfigured: configuredApisCount,
      activeProviders: activeApisCount,
    },
    environmentAudit: {
      mongoConfigured: Boolean(config.mongoUri),
      jwtConfigured: Boolean(config.jwtSecret),
      clientOrigin: config.clientOrigin,
      port: config.port,
    },
    checkedAt: new Date(),
    responseTimeMs: Date.now() - startTime,
  };

  return res.json(statusReport);
}
