import { Router } from "express";
import { listActivity } from "../controller/activity.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();
router.use(requireAuth);
router.get("/", listActivity);

export default router;
