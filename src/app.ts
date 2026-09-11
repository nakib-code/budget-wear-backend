import express from "express";
import cors from "cors";
import helmet from "helmet";
import errorMiddleware from "./middlewares/error.middleware";
import { authRouter } from "./modules/auth/auth.route";
import { productRoute } from "./modules/product/product.route";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
	res.json({
		success: true,
		message: "E-commerce API is running",
	});
});
app.use("/api/auth", authRouter);
app.use("/api/products", productRoute);
app.use(errorMiddleware);

export default app;
