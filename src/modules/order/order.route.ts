import { Router } from "express";
import orderController from "./order.controller";
import authMiddleware from "../../middlewares/auth.middleware";

const router = Router();

// Customer can create order without login
router.post("/", orderController.createOrder);
router.get(
  "/",
  authMiddleware,
  orderController.getAllOrders,
);

router.get(
  "/:id",
  authMiddleware,
  orderController.getOrderById,
);

router.patch(
  "/:id/status",
  authMiddleware,
  orderController.updateOrderStatus,
);

export const orderRoute = router;