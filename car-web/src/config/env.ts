import dotenv from "dotenv";

dotenv.config();

export const env = {
	PORT: Number(process.env.PORT) || 3000,

	SPRING_API_URL: process.env.SPRING_API_URL || "http://localhost:8080",
};
