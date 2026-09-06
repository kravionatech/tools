import { SiteSettingsModel } from "../model/settings/site-settings.model.js";
import { logAdminActivity } from "./activity.controller.js";

const DEFAULT_CUSTOM_CODE = {
  head: { enabled: true, code: "", scope: "sitewide" },
  bodyStart: { enabled: true, code: "", scope: "sitewide" },
  bodyEnd: { enabled: true, code: "", scope: "sitewide" },
  gtm: { enabled: false, containerId: "" },
  ga4: { enabled: false, measurementId: "" },
  metaPixel: { enabled: false, pixelId: "" },
  lastUpdated: new Date(),
  updatedBy: "admin",
};

export async function getCustomCode(_req, res) {
  try {
    const settings = await SiteSettingsModel.findOne({ key: "global" }).lean();
    const customCode = settings?.customCode || DEFAULT_CUSTOM_CODE;
    res.json({ customCode });
  } catch (error) {
    console.error("Failed to retrieve custom code:", error);
    res.status(500).json({ message: "Failed to retrieve custom code configuration" });
  }
}

export async function updateCustomCode(req, res) {
  try {
    const { head, bodyStart, bodyEnd, gtm, ga4, metaPixel } = req.body;

    const updates = {
      head: {
        enabled: head ? Boolean(head.enabled) : true,
        code: head && typeof head.code === "string" ? head.code : "",
        scope: head && ["sitewide", "home_only", "tools_only"].includes(head.scope) ? head.scope : "sitewide",
      },
      bodyStart: {
        enabled: bodyStart ? Boolean(bodyStart.enabled) : true,
        code: bodyStart && typeof bodyStart.code === "string" ? bodyStart.code : "",
        scope: bodyStart && ["sitewide", "home_only", "tools_only"].includes(bodyStart.scope) ? bodyStart.scope : "sitewide",
      },
      bodyEnd: {
        enabled: bodyEnd ? Boolean(bodyEnd.enabled) : true,
        code: bodyEnd && typeof bodyEnd.code === "string" ? bodyEnd.code : "",
        scope: bodyEnd && ["sitewide", "home_only", "tools_only"].includes(bodyEnd.scope) ? bodyEnd.scope : "sitewide",
      },
      gtm: {
        enabled: gtm ? Boolean(gtm.enabled) : false,
        containerId: gtm && typeof gtm.containerId === "string" ? gtm.containerId.trim() : "",
      },
      ga4: {
        enabled: ga4 ? Boolean(ga4.enabled) : false,
        measurementId: ga4 && typeof ga4.measurementId === "string" ? ga4.measurementId.trim() : "",
      },
      metaPixel: {
        enabled: metaPixel ? Boolean(metaPixel.enabled) : false,
        pixelId: metaPixel && typeof metaPixel.pixelId === "string" ? metaPixel.pixelId.trim() : "",
      },
      lastUpdated: new Date(),
      updatedBy: req.user?.email || "admin@kraviona.site",
    };

    const settings = await SiteSettingsModel.findOneAndUpdate(
      { key: "global" },
      { $set: { customCode: updates } },
      { upsert: true, new: true, runValidators: true }
    ).lean();

    await logAdminActivity({
      email: req.user?.email || "admin@kraviona.site",
      name: req.user?.name || "Admin",
      action: "custom_code_updated",
      target: "Custom Code & Tracking",
      details: `Updated head (${updates.head.enabled ? "on" : "off"}), bodyStart (${updates.bodyStart.enabled ? "on" : "off"}), bodyEnd (${updates.bodyEnd.enabled ? "on" : "off"}), GTM (${updates.gtm.enabled ? "on" : "off"}), GA4 (${updates.ga4.enabled ? "on" : "off"})`,
    });

    res.json({
      message: "Custom code configuration saved successfully",
      customCode: settings.customCode,
    });
  } catch (error) {
    console.error("Failed to update custom code:", error);
    res.status(500).json({ message: "Failed to update custom code configuration" });
  }
}

export function validateCustomCode(req, res) {
  const { code, location = "head" } = req.body;
  if (typeof code !== "string") {
    return res.status(400).json({ valid: false, errors: ["Code must be a string"] });
  }

  const errors = [];
  const warnings = [];

  // Check script tags balancing
  const scriptOpens = (code.match(/<script\b[^>]*>/gi) || []).length;
  const scriptCloses = (code.match(/<\/script>/gi) || []).length;
  if (scriptOpens !== scriptCloses) {
    errors.push(`Mismatched <script> tags: found ${scriptOpens} opening and ${scriptCloses} closing tags.`);
  }

  // Check style tags balancing
  const styleOpens = (code.match(/<style\b[^>]*>/gi) || []).length;
  const styleCloses = (code.match(/<\/style>/gi) || []).length;
  if (styleOpens !== styleCloses) {
    errors.push(`Mismatched <style> tags: found ${styleOpens} opening and ${styleCloses} closing tags.`);
  }

  // Location warnings
  if (location === "head") {
    if (code.includes("<iframe") && !code.includes("googletagmanager.com/ns.html")) {
      warnings.push("Visible <iframe> elements inside <head> are generally invalid in HTML standards.");
    }
  }

  res.json({
    valid: errors.length === 0,
    errors,
    warnings,
    characterCount: code.length,
  });
}

export async function getPublicCustomCode(_req, res) {
  try {
    const settings = await SiteSettingsModel.findOne({ key: "global" })
      .select("customCode")
      .lean();

    const cc = settings?.customCode;
    if (!cc) {
      return res.json({
        head: null,
        bodyStart: null,
        bodyEnd: null,
        gtm: null,
        ga4: null,
        metaPixel: null,
      });
    }

    // Return only enabled configurations for public injection
    res.set("Cache-Control", "public, max-age=60, s-maxage=60");
    return res.json({
      head: cc.head?.enabled && cc.head?.code ? { code: cc.head.code, scope: cc.head.scope } : null,
      bodyStart: cc.bodyStart?.enabled && cc.bodyStart?.code ? { code: cc.bodyStart.code, scope: cc.bodyStart.scope } : null,
      bodyEnd: cc.bodyEnd?.enabled && cc.bodyEnd?.code ? { code: cc.bodyEnd.code, scope: cc.bodyEnd.scope } : null,
      gtm: cc.gtm?.enabled && cc.gtm?.containerId ? { containerId: cc.gtm.containerId } : null,
      ga4: cc.ga4?.enabled && cc.ga4?.measurementId ? { measurementId: cc.ga4.measurementId } : null,
      metaPixel: cc.metaPixel?.enabled && cc.metaPixel?.pixelId ? { pixelId: cc.metaPixel.pixelId } : null,
    });
  } catch (error) {
    console.error("Public custom code error:", error);
    res.status(500).json({ message: "Failed to load public custom code" });
  }
}
