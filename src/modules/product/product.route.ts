import { Router } from "express";

import productController from "./product.controller";

import authMiddleware from "../../middlewares/auth.middleware";
import upload from "../../middlewares/upload.middleware";

const router = Router();

// Public routes
router.get("/", productController.getAllProducts);

router.get("/:id", productController.getProductById);

// Admin routes
router.post(
	"/",
	authMiddleware,
	upload.single("image"),
	productController.createProduct,
);

router.patch(
	"/:id",
	authMiddleware,
	upload.single("image"),
	productController.updateProduct,
);

router.delete("/:id", authMiddleware, productController.deleteProduct);

export const productRoute = router;
