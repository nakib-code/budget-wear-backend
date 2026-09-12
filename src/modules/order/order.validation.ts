import { z } from "zod";

const orderItemSchema = z.object({
  productId: z.number().int().positive("Invalid product ID"),

  size: z.string().min(1, "Size is required"),

  quantity: z.number().int().positive("Quantity must be greater than 0"),
});

export const createOrderSchema = z.object({
  customerName: z
    .string()
    .min(2, "Customer name must be at least 2 characters"),

  phone: z
    .string()
    .min(11, "Phone number must be at least 11 characters"),

  address: z
    .string()
    .min(5, "Address must be at least 5 characters"),

  items: z
    .array(orderItemSchema)
    .min(3, "You must select at least 3 products"),
});


export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "DELIVERED",
    "CANCELLED",
  ]),
});

export type UpdateOrderStatusInput = z.infer<
  typeof updateOrderStatusSchema
>;
