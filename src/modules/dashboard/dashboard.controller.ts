import type { Request, Response } from "express";
import dashboardService from "./dashboard.service";

const getDashboardStats = async (_req: Request, res: Response) => {
	const stats = await dashboardService.getDashboardStats();

	return res.status(200).json({
		success: true,
		message: "Dashboard statistics fetched successfully",
		data: stats,
	});
};

export default {
	getDashboardStats,
};
