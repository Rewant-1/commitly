// JWT token generation utility for user authentication
import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
	// Create JWT token with user ID and 15-day expiration
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});

	// Set token as HTTP-only cookie for security
	res.cookie("jwt", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000,  // 15 days in milliseconds
		httpOnly: true,                     // Prevent XSS attacks
		sameSite: "strict",                // CSRF protection
		secure: process.env.NODE_ENV !== "development", // HTTPS only in production
	});
};