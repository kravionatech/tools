import { SiteSettingsModel } from "../model/settings/site-settings.model.js";
import { logAdminActivity } from "./activity.controller.js";

const editableFields = [
  "siteName",
  "siteUrl",
  "defaultTitle",
  "defaultDescription",
  "googleVerification",
  "analyticsMeasurementId",
  "allowIndexing",
  "contactEmail",
  "adminEmail",
  "primaryColor",
  "themeMode",
  "robotsTxt",
  "bingVerification",
  "socialShareImage",
  "logoUrl",
  "faviconUrl",
];

export async function getSettings(_req, res) {
  const settings = await SiteSettingsModel.findOneAndUpdate(
    { key: "global" },
    {},
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean();
  res.json({ settings });
}

export async function updateSettings(req, res) {
  const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => editableFields.includes(key)));
  const settings = await SiteSettingsModel.findOneAndUpdate(
    { key: "global" },
    { $set: updates },
    { upsert: true, new: true, runValidators: true }
  ).lean();

  await logAdminActivity({
    email: req.user?.email || "admin@kraviona.site",
    name: req.user?.name || "Admin",
    action: "settings_updated",
    target: "Site Settings",
    details: `Updated fields: ${Object.keys(updates).join(", ")}`,
  });

  res.json({ settings });
}
