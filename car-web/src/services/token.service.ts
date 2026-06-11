import { springApi } from "./spring-api";

export const refreshAccessToken = async (refreshToken: string) => {
	const response = await springApi.post("/auth/refresh", {
		refreshToken,
	});

	return response.data;
};
