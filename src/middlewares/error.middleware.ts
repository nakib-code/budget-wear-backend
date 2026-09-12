import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

const errorMiddleware = (
	error: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	console.error(error);

	if (error instanceof ZodError) {
		return res.status(400).json({
			success: false,
			message: "Validation error",
			errors: error.issues.map((issue) => ({
				field: issue.path.join("."),
				message: issue.message,
			})),
		});
	}

	if (error instanceof Error) {
		return res.status(500).json({
			success: false,
			message: error.message || "Internal Server Error",
		});
	}

	return res.status(500).json({
		success: false,
		message: "Internal Server Error",
	});
};

export default errorMiddleware;
