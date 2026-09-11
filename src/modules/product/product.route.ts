import { Router } from "express";
import productController from "./product.controller";
import authMiddleware from "../../middlewares/auth.middleware";

const router = Router();

// Public routes
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// Admin routes
router.post(
  "/",
  authMiddleware,
  productController.createProduct,
);

router.patch(
  "/:id",
  authMiddleware,
  productController.updateProduct,
);

router.delete(
  "/:id",
  authMiddleware,
  productController.deleteProduct,
);

export const productRoute = router;