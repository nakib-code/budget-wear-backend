import { z } from "zod";

const productSizeSchema = z.object({
	size: z.string().trim().min(1, "Size is required"),
	stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
});

const sizesSchema = z
	.preprocess(
		(value) => {
			if (typeof value === "string") {
				try {
					return JSON.parse(value);
				} catch {
					return value;
				}
			}

			return value;
		},
		z.array(productSizeSchema).min(1, "At least one size is required"),
	)
	.refine(
		(sizes) => new Set(sizes.map((item) => item.size)).size === sizes.length,
		{
			message: "Duplicate sizes are not allowed",
		},
	);

export const createProductSchema = z.object({
	name: z.string().trim().min(2, "Product name must be at least 2 characters"),

	description: z.string().trim().optional(),

	price: z.coerce.number().positive("Price must be greater than 0"),

	sizes: sizesSchema,
});

export const updateProductSchema = z.object({
	name: z.string().trim().min(2).optional(),

	description: z.string().trim().optional(),

	price: z.coerce.number().positive("Price must be greater than 0"),

	isActive: z.coerce.boolean().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export type UpdateProductInput = z.infer<typeof updateProductSchema>;
