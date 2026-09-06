import mongoose from "mongoose";
import { config } from "../app/config/env.js";
import { AuthModel } from "../app/model/auth/auth.model.js";
import { hashPassword } from "../app/utils/password.js";

const name = process.env.ADMIN_NAME || "Kraviona Admin";
const email = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD || "";

if (!config.mongoUri || !email || !password) {
  throw new Error("Set MONGODB_URI, ADMIN_EMAIL, and ADMIN_PASSWORD before creating an admin");
}

await mongoose.connect(config.mongoUri);
await AuthModel.findOneAndUpdate(
  { email },
  { $set: { name, email, passwordHash: await hashPassword(password), role: "admin" } },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);
console.log(`Admin account provisioned for ${email}`);
await mongoose.disconnect();
