import type { Request, Response } from "express";
import inventoryService from "./inventory.service";
import {
	createInventorySchema,
	updateInventorySchema,
} from "./inventory.validation";

const createInventory = async (req: Request, res: Response) => {
	const validatedData = createInventorySchema.parse(req.body);

	const inventory = await inventoryService.createInventory(validatedData);

	return res.status(201).json({
		success: true,
		message: "Inventory created successfully",
		data: inventory,
	});
};

const getProductInventory = async (req: Request, res: Response) => {
	const productId = Number(req.params.productId);

	const inventory = await inventoryService.getProductInventory(productId);

	return res.status(200).json({
		success: true,
		message: "Product inventory fetched successfully",
		data: inventory,
	});
};

const updateInventory = async (req: Request, res: Response) => {
	const id = Number(req.params.id);

	const validatedData = updateInventorySchema.parse(req.body);

	const inventory = await inventoryService.updateInventory(id, validatedData);

	return res.status(200).json({
		success: true,
		message: "Inventory updated successfully",
		data: inventory,
	});
};

const deleteInventory = async (req: Request, res: Response) => {
	const id = Number(req.params.id);

	await inventoryService.deleteInventory(id);

	return res.status(200).json({
		success: true,
		message: "Inventory deleted successfully",
	});
};

export default {
	createInventory,
	getProductInventory,
	updateInventory,
	deleteInventory,
};
