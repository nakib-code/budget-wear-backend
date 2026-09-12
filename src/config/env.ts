import dotenv from "dotenv";
import path from "path";

dotenv.config({
	path: path.join(process.cwd(), ".env"),
});

const requiredEnv = (key: string): string => {
	const value = process.env[key];

	if (!value) {
		throw new Error(`${key} is missing in .env`);
	}

	return value;
};

const env = {
	port: Number(process.env.PORT) || 5001,

	databaseUrl: requiredEnv("DATABASE_URL"),
	jwtSecret: requiredEnv("JWT_SECRET"),
	frontendUrl: requiredEnv("FRONTEND_URL"),
};

export default env;
