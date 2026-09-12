import express from "express";
import cors from "cors";
import helmet from "helmet";
import errorMiddleware from "./middlewares/error.middleware";
import { authRouter } from "./modules/auth/auth.route";
import { productRoute } from "./modules/product/product.route";
import { inventoryRoute } from "./modules/inventory/inventory.route";
import { orderRoute } from "./modules/order/order.route";
import { dashboardRoute } from "./modules/dashboard/dashboard.route";
import env from "./config/env";

const app = express();

app.use(helmet());
app.use(
	cors({
		origin: env.frontendUrl,
		credentials: true,
	}),
);
app.use(express.json());

app.get("/", (_req, res) => {
	res.json({
		success: true,
		message: "E-commerce API is running",
	});
});
app.use("/api/auth", authRouter);
app.use("/api/products", productRoute);
app.use("/api/inventory", inventoryRoute);
app.use("/api/orders", orderRoute);
app.use("/api/dashboard", dashboardRoute);

app.use(errorMiddleware);

export default app;
