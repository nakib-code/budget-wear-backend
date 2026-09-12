import prisma from "../../config/prisma";

const getDashboardStats = async () => {
	const startOfToday = new Date();
	startOfToday.setHours(0, 0, 0, 0);

	const startOfTomorrow = new Date(startOfToday);
	startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

	const [
		totalProducts,
		availableProducts,
		todayOrders,
		pendingOrders,
		deliveredOrders,
	] = await Promise.all([
		prisma.product.count({
			where: {
				isActive: true,
			},
		}),

		prisma.product.count({
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
		}),

		prisma.order.count({
			where: {
				createdAt: {
					gte: startOfToday,
					lt: startOfTomorrow,
				},
			},
		}),

		prisma.order.count({
			where: {
				status: "PENDING",
			},
		}),

		prisma.order.count({
			where: {
				status: "DELIVERED",
			},
		}),
	]);

	const outOfStockProducts = totalProducts - availableProducts;

	return {
		totalProducts,
		availableProducts,
		outOfStockProducts,
		todayOrders,
		pendingOrders,
		deliveredOrders,
	};
};

export default {
	getDashboardStats,
};
