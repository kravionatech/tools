import { Router } from "express";
import { getSettings, updateSettings } from "../controller/settings.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();
router.use(requireAuth);
router.get("/", getSettings);
router.patch("/", updateSettings);
router.put("/", updateSettings);
export default router;
