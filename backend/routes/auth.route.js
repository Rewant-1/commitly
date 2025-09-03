// Authentication routes - handles user signup, login, logout, and profile access
import express from "express";
import { getMe, login, logout, signup } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// Get current user profile (protected route)
router.get("/me", protectRoute, getMe);

// Public auth routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;