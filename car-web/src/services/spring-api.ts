import axios from "axios";

import { env } from "../config/env";

export const springApi = axios.create({
	baseURL: env.SPRING_API_URL,

	timeout: 10000,

	headers: {
		"Content-Type": "application/json",
	},
});
