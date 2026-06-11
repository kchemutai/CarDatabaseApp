import { Router } from "express";
import { springApi } from "../services/spring-api";

const router = Router();

router.get("/", async (req, res) => {
	const accessToken = req.cookies.access_token;

	if (!accessToken) {
		return res.status(401).json({
			message: "Access token missing",
		});
	}

	try {
		const response = await springApi.get("/api/cars", {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		return res.json(response.data);
	} catch (error: any) {
		if (error.response?.status === 401) {
			try {
				const refreshToken = req.cookies.refresh_token;

				if (!refreshToken) {
					return res.status(401).json({
						message: "Session expired",
					});
				}

				const refreshed = await springApi.post("/auth/refresh", {
					refreshToken,
				});

				const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
					refreshed.data;

				res.cookie("access_token", newAccessToken, {
					httpOnly: true,
					sameSite: "lax",
					secure: false,
					maxAge: 15 * 60 * 1000,
				});

				res.cookie("refresh_token", newRefreshToken, {
					httpOnly: true,
					sameSite: "lax",
					secure: false,
					maxAge: 7 * 24 * 60 * 60 * 1000,
				});

				const retry = await springApi.get("/api/cars", {
					headers: {
						Authorization: `Bearer ${newAccessToken}`,
					},
				});

				return res.json(retry.data);
			} catch (refreshError) {
				console.error("Token refresh failed:", refreshError);

				res.clearCookie("access_token");
				res.clearCookie("refresh_token");

				return res.status(401).json({
					message: "Session expired",
				});
			}
		}

		console.error(error);

		return res.status(500).json({
			message: "Failed to fetch cars",
		});
	}
});

export default router;
