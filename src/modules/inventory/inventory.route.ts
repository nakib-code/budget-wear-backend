import { Router } from "express";
import inventoryController from "./inventory.controller";
import authMiddleware from "../../middlewares/auth.middleware";

const router = Router();

// Admin only
router.post("/", authMiddleware, inventoryController.createInventory);

router.get(
	"/product/:productId",
	authMiddleware,
	inventoryController.getProductInventory,
);

router.patch("/:id", authMiddleware, inventoryController.updateInventory);

router.delete("/:id", authMiddleware, inventoryController.deleteInventory);

export const inventoryRoute = router;
