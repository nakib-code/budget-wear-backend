import { Router } from "express";
import authController from "./auth.controller";
import authMiddleware from "../../middlewares/auth.middleware";

const router = Router();

router.post("/login", authController.login);

router.get("/me", authMiddleware, authController.getMe);

router.post("/logout", authMiddleware, authController.logout);

export const authRouter = router;
