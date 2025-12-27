// Post-related routes - feed, create, like, comment, bookmark, repost functionality
import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { validateRequest } from "../middleware/validateRequest.js";
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
import {
	commentBodySchema,
	createPostBodySchema,
	feedQuerySchema,
	postIdParamsSchema,
	userIdParamsSchema,
	usernameParamsSchema,
} from "../validation/posts.js";

const router = express.Router();

// All post routes require authentication
// Feed routes
router.get("/all", protectRoute, validateRequest({ query: feedQuerySchema }), getAllPosts);              // Main feed
router.get("/following", protectRoute, validateRequest({ query: feedQuerySchema }), getFollowingPosts);  // Following feed

// User-specific post collections
router.get("/likes/:id", protectRoute, validateRequest({ params: userIdParamsSchema, query: feedQuerySchema }), getLikedPosts);      // Posts user liked
router.get("/bookmarks/:id", protectRoute, validateRequest({ params: userIdParamsSchema, query: feedQuerySchema }), getBookmarkedPosts);
router.get("/reposts/:id", protectRoute, validateRequest({ params: userIdParamsSchema, query: feedQuerySchema }), getRepostedPosts);
router.get("/user/:username", protectRoute, validateRequest({ params: usernameParamsSchema, query: feedQuerySchema }), getUserPosts);  // User's posts

// Post management
router.post("/create", protectRoute, validateRequest({ body: createPostBodySchema }), createPost);
router.post("/like/:id", protectRoute, validateRequest({ params: postIdParamsSchema }), likeUnlikePost);
router.post("/bookmark/:id", protectRoute, validateRequest({ params: postIdParamsSchema }), bookmarkTogglePost);
router.post("/repost/:id", protectRoute, validateRequest({ params: postIdParamsSchema }), repostTogglePost);
router.post("/comment/:id", protectRoute, validateRequest({ params: postIdParamsSchema, body: commentBodySchema }), commentOnPost);
router.delete("/:id", protectRoute, validateRequest({ params: postIdParamsSchema }), deletePost);

export default router;