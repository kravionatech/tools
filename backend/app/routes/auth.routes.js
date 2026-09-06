import { Router } from "express";
import { currentUser, login } from "../controller/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();
router.post("/login", login);
router.get("/me", requireAuth, currentUser);
export default router;
