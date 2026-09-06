import { Router } from "express";
import {
  getRobotsSettings,
  updateRobotsSettings,
  getLlmsSettings,
  updateLlmsSettings,
  getPublicRobotsTxt,
  getPublicLlmsTxt,
} from "../controller/seo-settings.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// Public crawler endpoints
router.get("/robots.txt", getPublicRobotsTxt);
router.get("/robots", getPublicRobotsTxt);
router.get("/llms.txt", getPublicLlmsTxt);
router.get("/llms", getPublicLlmsTxt);

// Protected Admin endpoints for robots.txt
router.get("/admin/robots", requireAuth, getRobotsSettings);
router.put("/admin/robots", requireAuth, updateRobotsSettings);

// Protected Admin endpoints for llms.txt
router.get("/admin/llms", requireAuth, getLlmsSettings);
router.put("/admin/llms", requireAuth, updateLlmsSettings);

export default router;
