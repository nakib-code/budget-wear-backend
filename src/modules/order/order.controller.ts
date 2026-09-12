import { Request, Response } from "express";
import orderService from "./order.service";
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from "./order.validation";

const createOrder = async (req: Request, res: Response) => {
  const validatedData = createOrderSchema.parse(req.body);

  const order = await orderService.createOrder(validatedData);

  return res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: order,
  });
};

const getAllOrders = async (_req: Request, res: Response) => {
  const orders = await orderService.getAllOrders();

  return res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    data: orders,
  });
};

const getOrderById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const order = await orderService.getOrderById(id);

  return res.status(200).json({
    success: true,
    message: "Order fetched successfully",
    data: order,
  });
};

const updateOrderStatus = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const { status } = updateOrderStatusSchema.parse(req.body);

  const order = await orderService.updateOrderStatus(id, status);

  return res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    data: order,
  });
};


export default {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus
};