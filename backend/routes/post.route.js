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

router.get("/all", protectRoute, validateRequest({ query: feedQuerySchema }), getAllPosts);
router.get("/following", protectRoute, validateRequest({ query: feedQuerySchema }), getFollowingPosts);

router.get("/likes/:id", protectRoute, validateRequest({ params: userIdParamsSchema, query: feedQuerySchema }), getLikedPosts);
router.get("/bookmarks/:id", protectRoute, validateRequest({ params: userIdParamsSchema, query: feedQuerySchema }), getBookmarkedPosts);
router.get("/reposts/:id", protectRoute, validateRequest({ params: userIdParamsSchema, query: feedQuerySchema }), getRepostedPosts);
router.get("/user/:username", protectRoute, validateRequest({ params: usernameParamsSchema, query: feedQuerySchema }), getUserPosts);

router.post("/create", protectRoute, validateRequest({ body: createPostBodySchema }), createPost);
router.post("/like/:id", protectRoute, validateRequest({ params: postIdParamsSchema }), likeUnlikePost);
router.post("/bookmark/:id", protectRoute, validateRequest({ params: postIdParamsSchema }), bookmarkTogglePost);
router.post("/repost/:id", protectRoute, validateRequest({ params: postIdParamsSchema }), repostTogglePost);
router.post("/comment/:id", protectRoute, validateRequest({ params: postIdParamsSchema, body: commentBodySchema }), commentOnPost);
router.delete("/:id", protectRoute, validateRequest({ params: postIdParamsSchema }), deletePost);

export default router;