import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env";

export interface AuthRequest extends Request {
	user?: {
		id: number;
		email: string;
	};
}

const authMiddleware = (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized",
			});
		}

		const token = authHeader.split(" ")[1];

		const decoded = jwt.verify(token, env.jwtSecret);

		if (typeof decoded === "string" || !("id" in decoded)) {
			return res.status(401).json({
				success: false,
				message: "Invalid token",
			});
		}

		req.user = {
			id: Number(decoded.id),
			email: String(decoded.email),
		};

		next();
	} catch {
		return res.status(401).json({
			success: false,
			message: "Invalid or expired token",
		});
	}
};

export default authMiddleware;
