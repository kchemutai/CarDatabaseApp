import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import carRoutes from "./routes/car.routes";
import authRoutes from "./routes/auth.routes";

import { env } from "./config/env";

const app = express();

app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	}),
);

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

app.use(cookieParser());

app.use("/auth", authRoutes);

app.use("/cars", carRoutes);

app.listen(env.PORT, () => {
	console.log(`car-web running on port ${env.PORT}`);
});
