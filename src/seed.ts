import bcrypt from "bcrypt";
import prisma from "./config/prisma";

const seed = async () => {
	const email = "admin@example.com";
	const password = "Admin@123";

	const hashedPassword = await bcrypt.hash(password, 10);

	const admin = await prisma.user.upsert({
		where: {
			email,
		},
		update: {
			password: hashedPassword,
			role: "ADMIN",
		},
		create: {
			name: "Admin",
			email,
			password: hashedPassword,
			role: "ADMIN",
		},
	});

	console.log("Admin created successfully");
	console.log({
		id: admin.id,
		name: admin.name,
		email: admin.email,
		role: admin.role,
	});
};

seed()
	.catch((error) => {
		console.error("Seed failed:", error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
