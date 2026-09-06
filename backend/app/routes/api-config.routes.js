import { Router } from "express";
import {
  createApiConfig,
  deleteApiConfig,
  listApiConfigs,
  testApiConfig,
  updateApiConfig,
} from "../controller/api-config.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();
router.use(requireAuth);
router.get("/", listApiConfigs);
router.post("/", createApiConfig);
router.patch("/:id", updateApiConfig);
router.delete("/:id", deleteApiConfig);
router.post("/:id/test", testApiConfig);

export default router;
