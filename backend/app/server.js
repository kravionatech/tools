import mongoose from "mongoose";
import { app } from "./app.js";
import { config, assertProductionConfig } from "./config/env.js";

async function startServer() {
  assertProductionConfig();
  if (config.mongoUri) {
    await mongoose.connect(config.mongoUri);
    console.log("MongoDB connected");
  } else if (config.nodeEnv === "production") {
    throw new Error("MONGODB_URI is required in production");
  } else {
    console.warn("MONGODB_URI is not configured; running without database persistence");
  }

  app.listen(config.port, () => {
    console.log(`Kraviona backend running on port ${config.port}`);
  });
}

startServer().catch((error) => {
  console.error("Unable to start backend:", error.message);
  process.exit(1);
});
