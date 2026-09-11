import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../config/prisma";
import env from "../../config/env";
import type { LoginInput } from "./auth.validation";

const loginAdmin = async (data: LoginInput) => {
	const admin = await prisma.user.findUnique({
		where: {
			email: data.email,
		},
	});

	if (!admin) {
		throw new Error("Invalid email or password");
	}

	const isPasswordValid = await bcrypt.compare(data.password, admin.password);

	if (!isPasswordValid) {
		throw new Error("Invalid email or password");
	}

	const accessToken = jwt.sign(
		{
			id: admin.id,
			email: admin.email,
		},
		env.jwtSecret,
		{
			expiresIn: "7d",
		},
	);

	return {
		accessToken,
		admin: {
			id: admin.id,
			name: admin.name,
			email: admin.email,
		},
	};
};

const getMe = async (adminId: number) => {
	const admin = await prisma.user.findUnique({
		where: {
			id: adminId,
		},
		select: {
			id: true,
			name: true,
			email: true,
		},
	});

	if (!admin) {
		throw new Error("Admin not found");
	}

	return admin;
};

export default {
	loginAdmin,
	getMe,
};
