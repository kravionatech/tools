import jwt from "jsonwebtoken";
import { AuthModel } from "../model/auth/auth.model.js";
import { config } from "../config/env.js";
import { verifyPassword } from "../utils/password.js";
import { logAdminActivity } from "./activity.controller.js";

export async function login(req, res) {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  const clientIp = forwarded || req.socket.remoteAddress || "unknown";

  if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
  if (!config.mongoUri || !config.jwtSecret) return res.status(503).json({ message: "Authentication is not configured" });

  const user = await AuthModel.findOne({ email }).select("+passwordHash");
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    await logAdminActivity({
      email,
      name: "Guest",
      action: "login_failed",
      target: "Admin Auth",
      details: "Invalid credentials entered",
      status: "warning",
      ip: clientIp,
    });
    return res.status(401).json({ message: "Invalid email or password" });
  }

  user.lastLoginAt = new Date();
  await user.save();

  await logAdminActivity({
    email: user.email,
    name: user.name,
    action: "admin_login",
    target: "Admin Session",
    details: "Authenticated successfully",
    status: "success",
    ip: clientIp,
  });

  const token = jwt.sign(
    { sub: user._id.toString(), role: user.role, email: user.email },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  return res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
}

export function currentUser(req, res) {
  res.json({ user: req.user });
}