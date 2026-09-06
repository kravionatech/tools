import { Router } from "express";
import { listTools, updateTool } from "../controller/tools.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();
router.use(requireAuth);
router.get("/", listTools);
router.patch("/:slug", updateTool);

export default router;
