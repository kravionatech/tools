import { ApiConfigModel } from "../model/settings/api-config.model.js";
import { logAdminActivity } from "./activity.controller.js";

export async function listApiConfigs(_req, res) {
  const rawConfigs = await ApiConfigModel.find().sort({ provider: 1 }).lean();

  // Safely decorate with environment presence without exposing secrets
  const configs = rawConfigs.map((c) => ({
    ...c,
    hasEnvSecret: Boolean(process.env[c.secretEnvName]),
    maskedKeyPreview: process.env[c.secretEnvName]
      ? `••••••••${process.env[c.secretEnvName].slice(-4)}`
      : "Not set in .env",
  }));

  res.json({ configs });
}

export async function createApiConfig(req, res) {
  const { provider, endpoint, secretEnvName, enabled = false, requestLimit = 0, notes = "" } = req.body;
  if (!provider || !endpoint || !secretEnvName) {
    return res.status(400).json({ message: "Provider, endpoint, and secret environment name are required" });
  }

  const config = await ApiConfigModel.create({
    provider: provider.trim(),
    endpoint: endpoint.trim(),
    secretEnvName: secretEnvName.trim(),
    enabled: Boolean(enabled),
    requestLimit: Number(requestLimit) || 0,
    notes: String(notes || "").trim(),
  });

  await logAdminActivity({
    email: req.user?.email || "admin@kraviona.site",
    name: req.user?.name || "Admin",
    action: "api_config_created",
    target: provider,
    details: `Created API config for ${provider}`,
  });

  res.status(201).json({ config });
}

export async function updateApiConfig(req, res) {
  const updates = {};
  for (const field of ["provider", "endpoint", "secretEnvName", "enabled", "requestLimit", "notes"]) {
    if (field in req.body) updates[field] = req.body[field];
  }

  const config = await ApiConfigModel.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).lean();

  if (!config) return res.status(404).json({ message: "API configuration not found" });

  await logAdminActivity({
    email: req.user?.email || "admin@kraviona.site",
    name: req.user?.name || "Admin",
    action: "api_config_updated",
    target: config.provider,
    details: `Updated API config (${Object.keys(updates).join(", ")})`,
  });

  res.json({ config });
}

export async function deleteApiConfig(req, res) {
  const config = await ApiConfigModel.findByIdAndDelete(req.params.id).lean();
  if (!config) return res.status(404).json({ message: "API configuration not found" });

  await logAdminActivity({
    email: req.user?.email || "admin@kraviona.site",
    name: req.user?.name || "Admin",
    action: "api_config_deleted",
    target: config.provider,
    details: `Deleted API config for ${config.provider}`,
  });

  res.json({ message: "API configuration deleted successfully" });
}

export async function testApiConfig(req, res) {
  const config = await ApiConfigModel.findById(req.params.id).lean();
  if (!config) return res.status(404).json({ message: "API configuration not found" });

  const hasSecret = Boolean(process.env[config.secretEnvName]);

  // Attempt lightweight fetch ping if endpoint is http/https
  let pingStatus = "skipped";
  let pingLatencyMs = 0;
  if (config.endpoint && (config.endpoint.startsWith("http://") || config.endpoint.startsWith("https://"))) {
    try {
      const start = Date.now();
      const ctrl = new AbortController();
      const timeout = setTimeout(() => ctrl.abort(), 5000);
      const resp = await fetch(config.endpoint, { method: "HEAD", signal: ctrl.signal });
      clearTimeout(timeout);
      pingLatencyMs = Date.now() - start;
      pingStatus = resp.ok || resp.status < 500 ? "reachable" : "http_error_" + resp.status;
    } catch (err) {
      pingStatus = "unreachable";
    }
  }

  res.json({
    provider: config.provider,
    enabled: config.enabled,
    hasEnvSecret: hasSecret,
    pingStatus,
    pingLatencyMs,
    testedAt: new Date(),
  });
}
