import { Router } from "express";
import { springApi } from "../services/spring-api";

const router = Router();

router.get("/health", (_, res) => {
	res.json({
		status: "UP",
		service: "car-web",
	});
});

router.post("/login", async (req, res) => {
	try {
		const response = await springApi.post("/login", req.body);

		const { accessToken, refreshToken } = response.data;

		res.cookie("access_token", accessToken, {
			httpOnly: true,
			secure: false,
			sameSite: "lax",
			maxAge: 15 * 60 * 1000,
		});

		res.cookie("refresh_token", refreshToken, {
			httpOnly: true,
			secure: false,
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		res.json({
			message: "Login successful",
		});
	} catch (error) {
		res.status(401).json({
			message: "Invalid username or password",
		});
	}
});

router.get("/me", async (req, res) => {
	try {
		const accessToken = req.cookies.access_token;

		if (!accessToken) {
			return res.json({
				authenticated: false,
			});
		}

		const response = await springApi.get("/auth/me", {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		return res.json({
			authenticated: true,
			username: response.data,
		});
	} catch {
		return res.json({
			authenticated: false,
		});
	}
});

router.post("/logout", async (req, res) => {
	try {
		const refreshToken = req.cookies.refresh_token;

		if (refreshToken) {
			await springApi.post("/logout", {
				refreshToken,
			});
		}

		res.cookie("access_token", "", {
			httpOnly: true,
			secure: false,
			sameSite: "lax",
			path: "/",
			expires: new Date(0),
		});

		res.cookie("refresh_token", "", {
			httpOnly: true,
			secure: false,
			sameSite: "lax",
			path: "/",
			expires: new Date(0),
		});

		return res.status(200).json({
			message: "Logged out",
		});
	} catch (error) {
		console.error(error);

		return res.status(500).json({
			message: "Logout failed",
		});
	}
});

router.post("/refresh", async (req, res) => {
	try {
		const refreshToken = req.cookies.refresh_token;

		if (!refreshToken) {
			return res.status(401).json({
				message: "Refresh token missing",
			});
		}

		const response = await springApi.post("/auth/refresh", {
			refreshToken,
		});

		const { accessToken, refreshToken: newRefreshToken } = response.data;

		res.cookie("access_token", accessToken, {
			httpOnly: true,
			secure: false,
			sameSite: "lax",
			maxAge: 15 * 60 * 1000,
		});

		res.cookie("refresh_token", newRefreshToken, {
			httpOnly: true,
			secure: false,
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		res.status(200).json({
			message: "Token refreshed",
		});
	} catch (error) {
		res.status(401).json({
			message: "Refresh failed",
		});
	}
});

export default router;
