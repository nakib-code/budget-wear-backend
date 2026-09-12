import prisma from "../../config/prisma";

import {
	deleteImageFromCloudinary,
	uploadImageToCloudinary,
} from "../../utils/cloudinaryUpload";
import type { CreateProductInput } from "./inventory.validation";

const createProduct = async (
	data: CreateProductInput,
	image: Express.Multer.File,
) => {
	if (!image) {
		throw new Error("Product image is required");
	}

	const uploadedImage = await uploadImageToCloudinary(image.buffer);

	try {
		const product = await prisma.$transaction(async (tx) => {
			const createdProduct = await tx.product.create({
				data: {
					name: data.name,
					description: data.description || null,
					price: data.price,
					imageUrl: uploadedImage.secure_url,
					publicId: uploadedImage.public_id,
				},
			});

			await tx.productInventory.createMany({
				data: data.sizes.map((item) => ({
					productId: createdProduct.id,
					size: item.size,
					stock: item.stock,
				})),
			});

			return tx.product.findUnique({
				where: {
					id: createdProduct.id,
				},
				include: {
					inventories: {
						orderBy: {
							size: "asc",
						},
					},
				},
			});
		});

		return product;
	} catch (error) {
		await deleteImageFromCloudinary(uploadedImage.public_id);

		throw error;
	}
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
		include: {
			inventories: true,
		},
	});

	if (!product) {
		throw new Error("Product not found");
	}

	return product;
};

const updateProduct = async (
	id: number,
	data: UpdateProductInput,
	image?: Express.Multer.File,
) => {
	const existingProduct = await prisma.product.findUnique({
		where: {
			id,
		},
	});

	if (!existingProduct) {
		throw new Error("Product not found");
	}

	let imageData = {};

	if (image) {
		const uploadedImage = await uploadImageToCloudinary(image.buffer);

		imageData = {
			imageUrl: uploadedImage.secure_url,
			publicId: uploadedImage.public_id,
		};

		if (existingProduct.publicId) {
			await deleteImageFromCloudinary(existingProduct.publicId);
		}
	}

	const product = await prisma.product.update({
		where: {
			id,
		},
		data: {
			...data,
			...imageData,
		},
		include: {
			inventories: true,
		},
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

	if (existingProduct.publicId) {
		await deleteImageFromCloudinary(existingProduct.publicId);
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
