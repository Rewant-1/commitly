// Post-related routes - feed, create, like, comment, bookmark, repost functionality
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
	bookmarkTogglePost,
	repostTogglePost,
	getBookmarkedPosts,
	getRepostedPosts,
} from "../controllers/post.controller.js";

const router = express.Router();

// All post routes require authentication
// Feed routes
router.get("/all", protectRoute, getAllPosts);              // Main feed
router.get("/following", protectRoute, getFollowingPosts);  // Following feed

// User-specific post collections
router.get("/likes/:id", protectRoute, getLikedPosts);      // Posts user liked
router.get("/bookmarks/:id", protectRoute, getBookmarkedPosts);
router.get("/reposts/:id", protectRoute, getRepostedPosts);
router.get("/user/:username", protectRoute, getUserPosts);  // User's posts

// Post management
router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/bookmark/:id", protectRoute, bookmarkTogglePost);
router.post("/repost/:id", protectRoute, repostTogglePost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.delete("/:id", protectRoute, deletePost);

export default router;