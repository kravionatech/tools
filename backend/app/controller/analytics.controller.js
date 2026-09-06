import { createHmac } from "node:crypto";
import { EventModel } from "../model/analytics/event.model.js";
import { config } from "../config/env.js";

function getClientIp(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return forwarded || req.socket.remoteAddress || "127.0.0.1";
}

function maskIp(ip) {
  if (!ip || ip === "unknown") return "unknown";
  if (ip.includes(":")) {
    // IPv6
    const parts = ip.split(":");
    return parts.slice(0, 2).join(":") + ":***:***";
  }
  // IPv4
  const parts = ip.split(".");
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.***.***`;
  }
  return ip.slice(0, 5) + "***";
}

function visitorHash(ip) {
  return createHmac("sha256", config.jwtSecret || "development-only-analytics-key").update(ip).digest("hex");
}

function sanitizePath(value) {
  return String(value || "/").trim().slice(0, 500) || "/";
}

function normalizeReferrer(value) {
  if (!value) return "Direct";
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");
    if (host.includes("google")) return "Google Search";
    if (host.includes("bing")) return "Bing Search";
    if (host.includes("yahoo") || host.includes("duckduckgo")) return "Search Engine";
    if (host.includes("twitter") || host.includes("t.co") || host.includes("x.com")) return "Twitter / X";
    if (host.includes("linkedin")) return "LinkedIn";
    if (host.includes("facebook") || host.includes("fb.com")) return "Facebook";
    if (host.includes("reddit")) return "Reddit";
    if (host.includes("localhost") || host.includes("127.0.0.1")) return "Direct / Local";
    return host || "Direct";
  } catch {
    return String(value).slice(0, 80) || "Direct";
  }
}

function deviceType(userAgent) {
  if (/mobile/i.test(userAgent)) return "mobile";
  if (/tablet|ipad/i.test(userAgent)) return "tablet";
  if (userAgent) return "desktop";
  return "unknown";
}

function browserName(userAgent) {
  if (/edg/i.test(userAgent)) return "Edge";
  if (/opr|opera/i.test(userAgent)) return "Opera";
  if (/chrome|crios/i.test(userAgent)) return "Chrome";
  if (/firefox/i.test(userAgent)) return "Firefox";
  if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) return "Safari";
  return "Other";
}

function detectCountry(req, providedCountry) {
  if (providedCountry && typeof providedCountry === "string" && providedCountry.trim().length === 2) {
    return providedCountry.trim().toUpperCase();
  }
  const cf = req.headers["cf-ipcountry"] || req.headers["x-country-code"] || req.headers["geoip-country-code"];
  if (cf && typeof cf === "string" && cf.trim().length === 2) {
    return cf.trim().toUpperCase();
  }
  const lang = String(req.headers["accept-language"] || "");
  const match = lang.match(/[-_]([A-Za-z]{2})/);
  if (match) return match[1].toUpperCase();
  return "US"; // default plausible region
}

export async function recordEvent(req, res) {
  if (!config.mongoUri) return res.status(202).json({ accepted: false, reason: "Analytics database is not configured" });
  const { type = "page_view", path, title, toolSlug, referrer, country: clientCountry } = req.body;
  if (!path || !["page_view", "tool_use"].includes(type)) {
    return res.status(400).json({ message: "A valid path and event type are required" });
  }

  const rawIp = getClientIp(req);
  const userAgent = String(req.headers["user-agent"] || "");
  const country = detectCountry(req, clientCountry);

  await EventModel.create({
    type,
    path: sanitizePath(path),
    title: title ? String(title).slice(0, 200) : "",
    toolSlug: toolSlug ? String(toolSlug).slice(0, 120) : "",
    referrer: normalizeReferrer(referrer),
    deviceType: deviceType(userAgent),
    browser: browserName(userAgent),
    country,
    ip: rawIp,
    visitorHash: visitorHash(rawIp),
  });

  return res.status(201).json({ accepted: true });
}

export async function summary(req, res) {
  if (!config.mongoUri) {
    return res.json({
      totalVisits: 0,
      uniqueVisitors: 0,
      pageViews: 0,
      toolUses: 0,
      trends: { visitsChange: 0, visitorsChange: 0, pageViewsChange: 0, toolUsesChange: 0 },
      timeline: [],
      topPages: [],
      topTools: [],
      countries: [],
      devices: [],
      browsers: [],
      sources: [],
      recentEvents: [],
    });
  }

  const days = Math.min(Math.max(Number(req.query.days) || 30, 1), 365);
  const now = Date.now();
  const currentSince = new Date(now - days * 86400000);
  const previousSince = new Date(now - days * 2 * 86400000);

  const [
    currentTotals,
    previousTotals,
    topPages,
    topTools,
    countries,
    devices,
    browsers,
    sources,
    recentEvents,
    timelineData,
  ] = await Promise.all([
    // Current period totals
    EventModel.aggregate([
      { $match: { createdAt: { $gte: currentSince } } },
      {
        $group: {
          _id: null,
          totalVisits: { $sum: 1 },
          uniqueVisitors: { $addToSet: "$visitorHash" },
          pageViews: { $sum: { $cond: [{ $eq: ["$type", "page_view"] }, 1, 0] } },
          toolUses: { $sum: { $cond: [{ $eq: ["$type", "tool_use"] }, 1, 0] } },
        },
      },
    ]),

    // Previous period totals for % change calculation
    EventModel.aggregate([
      { $match: { createdAt: { $gte: previousSince, $lt: currentSince } } },
      {
        $group: {
          _id: null,
          totalVisits: { $sum: 1 },
          uniqueVisitors: { $addToSet: "$visitorHash" },
          pageViews: { $sum: { $cond: [{ $eq: ["$type", "page_view"] }, 1, 0] } },
          toolUses: { $sum: { $cond: [{ $eq: ["$type", "tool_use"] }, 1, 0] } },
        },
      },
    ]),

    // Top Pages
    EventModel.aggregate([
      { $match: { createdAt: { $gte: currentSince }, type: "page_view" } },
      { $group: { _id: "$path", views: { $sum: 1 }, uniqueVisitors: { $addToSet: "$visitorHash" } } },
      { $sort: { views: -1 } },
      { $limit: 10 },
    ]),

    // Top Tools
    EventModel.aggregate([
      { $match: { createdAt: { $gte: currentSince }, type: "tool_use" } },
      { $group: { _id: "$toolSlug", uses: { $sum: 1 }, uniqueUsers: { $addToSet: "$visitorHash" } } },
      { $sort: { uses: -1 } },
      { $limit: 10 },
    ]),

    // Countries
    EventModel.aggregate([
      { $match: { createdAt: { $gte: currentSince }, country: { $exists: true, $ne: "" } } },
      {
        $group: {
          _id: "$country",
          visitors: { $addToSet: "$visitorHash" },
          pageViews: { $sum: { $cond: [{ $eq: ["$type", "page_view"] }, 1, 0] } },
        },
      },
      { $project: { _id: 1, visitors: { $size: "$visitors" }, pageViews: 1 } },
      { $sort: { visitors: -1 } },
      { $limit: 8 },
    ]),

    // Devices
    EventModel.aggregate([
      { $match: { createdAt: { $gte: currentSince }, deviceType: { $exists: true } } },
      { $group: { _id: "$deviceType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]),

    // Browsers
    EventModel.aggregate([
      { $match: { createdAt: { $gte: currentSince }, browser: { $exists: true } } },
      { $group: { _id: "$browser", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]),

    // Traffic Sources
    EventModel.aggregate([
      { $match: { createdAt: { $gte: currentSince }, referrer: { $exists: true, $ne: "" } } },
      { $group: { _id: "$referrer", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]),

    // Recent 15 events
    EventModel.find({ createdAt: { $gte: currentSince } }).sort({ createdAt: -1 }).limit(15).lean(),

    // Daily Timeline for charts
    EventModel.aggregate([
      { $match: { createdAt: { $gte: currentSince } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          visits: { $sum: 1 },
          visitors: { $addToSet: "$visitorHash" },
          pageViews: { $sum: { $cond: [{ $eq: ["$type", "page_view"] }, 1, 0] } },
          toolUses: { $sum: { $cond: [{ $eq: ["$type", "tool_use"] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const curr = currentTotals[0] || { totalVisits: 0, uniqueVisitors: [], pageViews: 0, toolUses: 0 };
  const prev = previousTotals[0] || { totalVisits: 0, uniqueVisitors: [], pageViews: 0, toolUses: 0 };

  const calcChange = (c, p) => {
    if (!p) return c > 0 ? 100 : 0;
    return Number((((c - p) / p) * 100).toFixed(1));
  };

  const currUnique = Array.isArray(curr.uniqueVisitors) ? curr.uniqueVisitors.length : 0;
  const prevUnique = Array.isArray(prev.uniqueVisitors) ? prev.uniqueVisitors.length : 0;

  const trends = {
    visitsChange: calcChange(curr.totalVisits || 0, prev.totalVisits || 0),
    visitorsChange: calcChange(currUnique, prevUnique),
    pageViewsChange: calcChange(curr.pageViews || 0, prev.pageViews || 0),
    toolUsesChange: calcChange(curr.toolUses || 0, prev.toolUses || 0),
  };

  const topPagesWithStats = topPages.map((page) => ({
    _id: page._id,
    views: page.views,
    uniqueVisitors: page.uniqueVisitors.length,
    percentage: curr.pageViews ? Number(((page.views / curr.pageViews) * 100).toFixed(1)) : 0,
  }));

  const topToolsWithStats = topTools.map((tool) => ({
    _id: tool._id,
    uses: tool.uses,
    uniqueUsers: tool.uniqueUsers.length,
    percentage: curr.toolUses ? Number(((tool.uses / curr.toolUses) * 100).toFixed(1)) : 0,
  }));

  // Build timeline formatted array
  const timeline = timelineData.map((d) => ({
    date: d._id,
    visits: d.visits,
    uniqueVisitors: d.visitors.length,
    pageViews: d.pageViews,
    toolUses: d.toolUses,
  }));

  return res.json({
    totalVisits: curr.totalVisits || 0,
    uniqueVisitors: currUnique,
    pageViews: curr.pageViews || 0,
    toolUses: curr.toolUses || 0,
    trends,
    timeline,
    topPages: topPagesWithStats,
    topTools: topToolsWithStats,
    countries: countries.map((c) => ({ _id: c._id || "Unknown", visitors: c.visitors, pageViews: c.pageViews })),
    devices: devices.map((d) => ({ _id: d._id || "Unknown", count: d.count })),
    browsers: browsers.map((b) => ({ _id: b._id || "Unknown", count: b.count })),
    sources: sources.map((s) => ({ _id: s._id || "Direct", count: s.count })),
    recentEvents: recentEvents.map((e) => ({
      _id: e._id,
      type: e.type,
      path: e.path,
      title: e.title,
      toolSlug: e.toolSlug,
      createdAt: e.createdAt,
    })),
  });
}

export async function visitors(req, res) {
  if (!config.mongoUri) return res.json({ visitors: [], total: 0 });

  const days = Math.min(Number(req.query.days) || 30, 365);
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 25));
  const skip = (page - 1) * limit;

  const since = new Date(Date.now() - days * 86400000);
  const filter = { createdAt: { $gte: since } };

  if (req.query.search) {
    const s = String(req.query.search).trim();
    filter.$or = [
      { path: { $regex: s, $options: "i" } },
      { referrer: { $regex: s, $options: "i" } },
      { browser: { $regex: s, $options: "i" } },
      { deviceType: { $regex: s, $options: "i" } },
    ];
  }

  const [visitorsList, total] = await Promise.all([
    EventModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    EventModel.countDocuments(filter),
  ]);

  const showRaw = req.query.rawIp === "true";

  return res.json({
    visitors: visitorsList.map((v) => ({
      _id: v._id,
      type: v.type,
      path: v.path,
      title: v.title,
      country: v.country || "US",
      deviceType: v.deviceType || "Desktop",
      browser: v.browser || "Unknown",
      referrer: v.referrer || "Direct",
      ip: showRaw ? v.ip || "127.0.0.1" : maskIp(v.ip),
      createdAt: v.createdAt,
    })),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1,
    },
  });
}
