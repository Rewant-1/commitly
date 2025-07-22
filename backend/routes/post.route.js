import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
	commentOnPost,
	createPost,
	deletePost,
	getAllPosts,
	getFollowingPosts,
	getLikedPosts,
	getUserPosts,
	likeUnlikePost,
	bookmarkPost,
	unbookmarkPost,
	retweetPost,
	unretweetPost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/all", protectRoute, getAllPosts);
router.get("/following", protectRoute, getFollowingPosts);
router.get("/likes/:id", protectRoute, getLikedPosts);
router.get("/user/:username", protectRoute, getUserPosts);
router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.post("/bookmark/:id", protectRoute, bookmarkPost);
router.delete("/bookmark/:id", protectRoute, unbookmarkPost);
router.post("/retweet/:id", protectRoute, retweetPost);
router.delete("/retweet/:id", protectRoute, unretweetPost);
router.delete("/:id", protectRoute, deletePost);

export default router;