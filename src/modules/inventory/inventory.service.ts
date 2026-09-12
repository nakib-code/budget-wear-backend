import prisma from "../../config/prisma";
import type {
	CreateInventoryInput,
	UpdateInventoryInput,
} from "./inventory.validation";

const createInventory = async (data: CreateInventoryInput) => {
	const product = await prisma.product.findUnique({
		where: {
			id: data.productId,
		},
	});

	if (!product) {
		throw new Error("Product not found");
	}

	const existingInventory = await prisma.productInventory.findUnique({
		where: {
			productId_size: {
				productId: data.productId,
				size: data.size,
			},
		},
	});

	if (existingInventory) {
		throw new Error("Inventory for this size already exists");
	}

	const inventory = await prisma.productInventory.create({
		data: {
			productId: data.productId,
			size: data.size,
			stock: data.stock,
		},
	});

	return inventory;
};

const getProductInventory = async (productId: number) => {
	const product = await prisma.product.findUnique({
		where: {
			id: productId,
		},
	});

	if (!product) {
		throw new Error("Product not found");
	}

	const inventory = await prisma.productInventory.findMany({
		where: {
			productId,
		},
		orderBy: {
			size: "asc",
		},
	});

	return inventory;
};

const updateInventory = async (id: number, data: UpdateInventoryInput) => {
	const existingInventory = await prisma.productInventory.findUnique({
		where: {
			id,
		},
	});

	if (!existingInventory) {
		throw new Error("Inventory not found");
	}

	const inventory = await prisma.productInventory.update({
		where: {
			id,
		},
		data: {
			stock: data.stock,
		},
	});

	return inventory;
};

const deleteInventory = async (id: number) => {
	const existingInventory = await prisma.productInventory.findUnique({
		where: {
			id,
		},
	});

	if (!existingInventory) {
		throw new Error("Inventory not found");
	}

	await prisma.productInventory.delete({
		where: {
			id,
		},
	});
};

export default {
	createInventory,
	getProductInventory,
	updateInventory,
	deleteInventory,
};
