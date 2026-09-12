import prisma from "../../config/prisma";
import type { CreateOrderInput } from "./order.validation";

const createOrder = async (data: CreateOrderInput) => {
	return prisma.$transaction(async (tx) => {
		const uniqueProductIds = new Set(data.items.map((item) => item.productId));

		if (uniqueProductIds.size < 3) {
			throw new Error("You must select at least 3 different products");
		}

		let totalAmount = 0;

		const orderItems = [];

		for (const item of data.items) {
			const product = await tx.product.findUnique({
				where: {
					id: item.productId,
				},
			});

			if (!product || !product.isActive) {
				throw new Error(`Product ${item.productId} is not available`);
			}

			const inventory = await tx.productInventory.findUnique({
				where: {
					productId_size: {
						productId: item.productId,
						size: item.size,
					},
				},
			});

			if (!inventory) {
				throw new Error(
					`Size ${item.size} is not available for product ${product.name}`,
				);
			}

			if (inventory.stock < item.quantity) {
				throw new Error(`Not enough stock for ${product.name} - ${item.size}`);
			}

			const itemTotal = Number(product.price) * item.quantity;

			totalAmount += itemTotal;

			orderItems.push({
				productId: product.id,
				size: item.size,
				quantity: item.quantity,
				price: product.price,
			});

			await tx.productInventory.update({
				where: {
					id: inventory.id,
				},
				data: {
					stock: {
						decrement: item.quantity,
					},
				},
			});
		}

		const order = await tx.order.create({
			data: {
				customerName: data.customerName,
				phone: data.phone,
				address: data.address,
				totalAmount,
				items: {
					create: orderItems,
				},
			},
			include: {
				items: {
					include: {
						product: true,
					},
				},
			},
		});

		return order;
	});
};

const getAllOrders = async () => {
	const orders = await prisma.order.findMany({
		include: {
			items: {
				include: {
					product: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return orders;
};

const getOrderById = async (id: number) => {
	const order = await prisma.order.findUnique({
		where: {
			id,
		},
		include: {
			items: {
				include: {
					product: true,
				},
			},
		},
	});

	if (!order) {
		throw new Error("Order not found");
	}

	return order;
};

const updateOrderStatus = async (
	id: number,
	status: "PENDING" | "CONFIRMED" | "DELIVERED" | "CANCELLED",
) => {
	return prisma.$transaction(async (tx) => {
		const order = await tx.order.findUnique({
			where: {
				id,
			},
			include: {
				items: true,
			},
		});

		if (!order) {
			throw new Error("Order not found");
		}

		if (order.status === "CANCELLED") {
			throw new Error("Cancelled order cannot be updated");
		}

		if (order.status === "DELIVERED" && status !== "DELIVERED") {
			throw new Error("Delivered order cannot be changed");
		}

		if (status === "CANCELLED") {
			for (const item of order.items) {
				await tx.productInventory.update({
					where: {
						productId_size: {
							productId: item.productId,
							size: item.size,
						},
					},
					data: {
						stock: {
							increment: item.quantity,
						},
					},
				});
			}
		}

		const updatedOrder = await tx.order.update({
			where: {
				id,
			},
			data: {
				status,
			},
			include: {
				items: {
					include: {
						product: true,
					},
				},
			},
		});

		return updatedOrder;
	});
};

export default {
	createOrder,
	getAllOrders,
	getOrderById,
	updateOrderStatus,
};
