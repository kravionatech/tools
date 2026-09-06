import { Router } from "express";
import { recordEvent, summary, visitors } from "../controller/analytics.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();
router.post("/events", recordEvent);
router.get("/summary", requireAuth, summary);
router.get("/overview", requireAuth, summary);
router.get("/visitors", requireAuth, visitors);
export default router;
