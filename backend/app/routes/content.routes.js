import { Router } from "express";
import { getContent, listAllContent, updateContent } from "../controller/content.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();
// Public read endpoint for client site hydration if needed
router.get("/:section", getContent);
router.get("/", listAllContent);

// Protected write endpoints
router.put("/:section", requireAuth, updateContent);

export default router;
