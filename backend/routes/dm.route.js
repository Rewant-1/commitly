import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  startConversation,
  sendMessage,
  getConversations,
  getMessages,
} from "../controllers/dm.controller.js";

const router = express.Router();

router.post("/start", protectRoute, startConversation);
router.post("/message/:conversationId", protectRoute, sendMessage);
router.get("/conversations", protectRoute, getConversations);
router.get("/messages/:conversationId", protectRoute, getMessages);

export default router; 