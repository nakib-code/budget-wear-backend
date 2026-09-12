import prisma from "../../config/prisma";
import type {
	CreateProductInput,
	UpdateProductInput,
} from "./product.validation";

const createProduct = async (data: CreateProductInput) => {
	const product = await prisma.product.create({
		data: {
			name: data.name,
			description: data.description,
			price: data.price,
			imageUrl: data.imageUrl,
		},
	});

	return product;
};

const getAllProducts = async () => {
	const products = await prisma.product.findMany({
		where: {
			isActive: true,
			inventories: {
				some: {
					stock: {
						gt: 0,
					},
				},
			},
		},
		include: {
			inventories: true,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return products;
};
const getProductById = async (id: number) => {
	const product = await prisma.product.findUnique({
		where: {
			id,
		},
	});

	if (!product) {
		throw new Error("Product not found");
	}

	return product;
};

const updateProduct = async (id: number, data: UpdateProductInput) => {
	const existingProduct = await prisma.product.findUnique({
		where: {
			id,
		},
	});

	if (!existingProduct) {
		throw new Error("Product not found");
	}

	const product = await prisma.product.update({
		where: {
			id,
		},
		data,
	});

	return product;
};

const deleteProduct = async (id: number) => {
	const existingProduct = await prisma.product.findUnique({
		where: {
			id,
		},
	});

	if (!existingProduct) {
		throw new Error("Product not found");
	}

	await prisma.product.delete({
		where: {
			id,
		},
	});

	return null;
};

export default {
	createProduct,
	getAllProducts,
	getProductById,
	updateProduct,
	deleteProduct,
};
