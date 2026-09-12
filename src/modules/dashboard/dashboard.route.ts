import { Router } from "express";
import dashboardController from "./dashboard.controller";
import authMiddleware from "../../middlewares/auth.middleware";

const router = Router();

router.get("/stats", authMiddleware, dashboardController.getDashboardStats);

export const dashboardRoute = router;
