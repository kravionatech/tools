import mongoose from "mongoose";
import { config } from "./config/config.js";

export async function connectDB() {
  if (!config.MONGODB_URI) {
    console.log("MongoDB notice: No MONGODB_URI provided. Running in persistent file/memory mode.");
    return;
  }

  try {
    const opts = {
      serverSelectionTimeoutMS: 5000,
    };
    if (config.DB_NAME) {
      opts.dbName = config.DB_NAME;
    }

    await mongoose.connect(config.MONGODB_URI, opts);
    console.log(`MongoDB connected: ${mongoose.connection.name}`);
  } catch (error) {
    console.warn(`MongoDB notice: ${error.message} (Backend continuing in persistent storage mode)`);
  }
}
