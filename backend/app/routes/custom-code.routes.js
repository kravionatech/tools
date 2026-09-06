import { Router } from "express";
import {
  getCustomCode,
  getPublicCustomCode,
  updateCustomCode,
  validateCustomCode,
} from "../controller/custom-code.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// Public injection endpoint (unauthenticated, safe cached read)
router.get("/public", getPublicCustomCode);

// Protected administrative management endpoints
router.get("/", requireAuth, getCustomCode);
router.put("/", requireAuth, updateCustomCode);
router.post("/validate", requireAuth, validateCustomCode);

export default router;
