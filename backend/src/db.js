import mongoose from "mongoose";
import { config } from "./config/config.js";

export async function connectDB() {
  if (!config.MONGODB_URI) return;
  try {
    await mongoose.connect(config.MONGODB_URI, { serverSelectionTimeoutMS: 2000 });
    console.log(`MongoDB connected: ${mongoose.connection.name}`);
  } catch (error) {
    console.warn(`MongoDB notice: ${error.message} (Backend continuing in memory mode)`);
  }
}
