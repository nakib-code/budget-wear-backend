import { z } from "zod";

export const createInventorySchema = z.object({
  productId: z.coerce
    .number()
    .int()
    .positive("Invalid product ID"),

  size: z
    .string()
    .trim()
    .min(1, "Size is required"),

  stock: z.coerce
    .number()
    .int()
    .min(0, "Stock cannot be negative"),
});

export const updateInventorySchema = z.object({
  stock: z.coerce
    .number()
    .int()
    .min(0, "Stock cannot be negative"),
});

export type CreateInventoryInput = z.infer<
  typeof createInventorySchema
>;

export type UpdateInventoryInput = z.infer<
  typeof updateInventorySchema
>;