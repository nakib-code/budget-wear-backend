import type { Request, Response } from "express";
import authService from "./auth.service";
import { loginSchema } from "./auth.validation";
import type { AuthRequest } from "../../middlewares/auth.middleware";

const login = async (req: Request, res: Response) => {
	const validatedData = loginSchema.parse(req.body);

	const result = await authService.loginAdmin(validatedData);

	return res.status(200).json({
		success: true,
		message: "Admin login successful",
		data: result,
	});
};

const getMe = async (req: AuthRequest, res: Response) => {
	if (!req.user) {
		return res.status(401).json({
			success: false,
			message: "Unauthorized",
		});
	}

	const admin = await authService.getMe(req.user.id);

	return res.status(200).json({
		success: true,
		message: "Admin profile fetched successfully",
		data: admin,
	});
};

const logout = async (_req: Request, res: Response) => {
	return res.status(200).json({
		success: true,
		message: "Admin logged out successfully",
	});
};

export default {
	login,
	getMe,
	logout,
};
