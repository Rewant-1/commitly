import express from "express";
import { getMessages, sendMessage, getConversations } from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/conversations", protectRoute, getConversations);
router.get("/:username", protectRoute, getMessages);
router.post("/send/:username", protectRoute, sendMessage);

export default router;
