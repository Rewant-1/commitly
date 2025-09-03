// Authentication middleware - protects routes that require user login
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
	try {
		// Extract JWT token from HTTP-only cookie
		const token = req.cookies.jwt;
		if (!token) {
			return res.status(401).json({ error: "Unauthorized: No Token Provided" });
		}

		// Verify token with secret key
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) {
			return res.status(401).json({ error: "Unauthorized: Invalid Token" });
		}

		// Find user from token and exclude password from result
		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Attach user to request object for use in route handlers
		req.user = user;
		next();
	} catch (err) {
		return res.status(500).json({ error: "Internal Server Error" });
	}
};