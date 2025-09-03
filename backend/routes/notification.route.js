// Notification routes - fetch and manage user notifications
import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { deleteNotifications, getNotifications } from "../controllers/notification.controller.js";

const router = express.Router();

// All notification routes require authentication
router.get("/", protectRoute, getNotifications);        // Get user's notifications
router.delete("/", protectRoute, deleteNotifications);  // Clear all notifications

export default router;