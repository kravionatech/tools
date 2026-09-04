import dotenv from "dotenv";
dotenv.config();

const env = (key, fallback = "") => process.env[key]?.trim() || fallback;

export const config = {
  PORT: Number(env("PORT", "5000")),
  MONGODB_URI: env("MONGODB_URI", ""),
  DB_NAME: env("DB_NAME", "kravioantools"),
  CLIENT_ORIGIN: env("CLIENT_ORIGIN", "http://localhost:3000"),
  MOZ_ACCESS_ID: env("MOZ_ACCESS_ID", ""),
  MOZ_SECRET_KEY: env("MOZ_SECRET_KEY", ""),
  MOZ_API_KEY: env("MOZ_API_KEY", ""),
  RATE_LIMIT_WINDOW_MS: Number(env("RATE_LIMIT_WINDOW_MS", "60000")),
  RATE_LIMIT_MAX: Number(env("RATE_LIMIT_MAX", "20")),
};
