import type { Request, Response } from "express";
import productService from "./product.service";
import { createProductSchema, updateProductSchema } from "./product.validation";

const createProduct = async (req: Request, res: Response) => {
	const validatedData = createProductSchema.parse(req.body);

	const product = await productService.createProduct(validatedData);

	return res.status(201).json({
		success: true,
		message: "Product created successfully",
		data: product,
	});
};

const getAllProducts = async (_req: Request, res: Response) => {
	const products = await productService.getAllProducts();

	return res.status(200).json({
		success: true,
		message: "Products fetched successfully",
		data: products,
	});
};

const getProductById = async (req: Request, res: Response) => {
	const id = Number(req.params.id);

	const product = await productService.getProductById(id);

	return res.status(200).json({
		success: true,
		message: "Product fetched successfully",
		data: product,
	});
};

const updateProduct = async (req: Request, res: Response) => {
	const id = Number(req.params.id);

	const validatedData = updateProductSchema.parse(req.body);

	const product = await productService.updateProduct(id, validatedData);

	return res.status(200).json({
		success: true,
		message: "Product updated successfully",
		data: product,
	});
};

const deleteProduct = async (req: Request, res: Response) => {
	const id = Number(req.params.id);

	await productService.deleteProduct(id);

	return res.status(200).json({
		success: true,
		message: "Product deleted successfully",
	});
};

export default {
	createProduct,
	getAllProducts,
	getProductById,
	updateProduct,
	deleteProduct,
};
