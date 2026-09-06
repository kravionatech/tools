import { Router } from "express";
import { getSystemStatus } from "../controller/system.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();
router.use(requireAuth);
router.get("/status", getSystemStatus);

export default router;
