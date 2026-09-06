import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export function requireAuth(req, res, next) {
  if (!config.jwtSecret) return res.status(503).json({ message: "Authentication is not configured" });
  const token = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : null;
  if (!token) return res.status(401).json({ message: "Authentication required" });

  try {
    req.user = jwt.verify(token, config.jwtSecret);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
}
