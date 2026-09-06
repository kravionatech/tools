import "dotenv/config";

export const config = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || "development",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  mongoUri: process.env.MONGODB_URI || "",
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "8h",
};

export function assertProductionConfig() {
  if (config.nodeEnv === "production" && (!config.mongoUri || !config.jwtSecret)) {
    throw new Error("MONGODB_URI and JWT_SECRET are required in production");
  }
}
