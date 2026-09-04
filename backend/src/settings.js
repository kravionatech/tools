import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "./config/config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "../data");
const settingsFile = path.join(dataDir, "settings.json");

const defaultSettings = {
  headerScripts: "",
  bodyStartScripts: "",
  bodyEndScripts: "",
  mozAccessId: config.MOZ_ACCESS_ID || "",
  mozSecretKey: config.MOZ_SECRET_KEY || "",
  mozApiKey: config.MOZ_API_KEY || "",
  enableDemoAuthority: false,
  siteTitle: "Kraviona | SEO & Image Tools",
};

let memorySettings = { ...defaultSettings };

// Ensure data directory exists
try {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (fs.existsSync(settingsFile)) {
    const raw = fs.readFileSync(settingsFile, "utf-8");
    memorySettings = { ...defaultSettings, ...JSON.parse(raw) };
  } else {
    fs.writeFileSync(settingsFile, JSON.stringify(defaultSettings, null, 2), "utf-8");
  }
} catch (err) {
  console.warn("Notice: settings storage initialized in memory:", err.message);
}

export function getSettings() {
  return { ...memorySettings };
}

export function getPublicSettings() {
  return {
    headerScripts: memorySettings.headerScripts || "",
    bodyStartScripts: memorySettings.bodyStartScripts || "",
    bodyEndScripts: memorySettings.bodyEndScripts || "",
    siteTitle: memorySettings.siteTitle || defaultSettings.siteTitle,
  };
}

export function updateSettings(newSettings) {
  memorySettings = {
    ...memorySettings,
    ...newSettings,
  };

  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(settingsFile, JSON.stringify(memorySettings, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to persist settings file:", err.message);
  }

  return { ...memorySettings };
}
