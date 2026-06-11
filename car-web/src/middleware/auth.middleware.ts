import { Request, Response, NextFunction } from "express";

export const requireAccessToken = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const accessToken = req.cookies.access_token;

	if (!accessToken) {
		return res.status(401).json({
			message: "Access token missing",
		});
	}

	next();
};
