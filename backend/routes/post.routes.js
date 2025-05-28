import express from 'express';
import{protectRoute} from "../middleware/protectRoute.js";
import { createPost, deletePost, commentOnPost,likeUnlikePost,getAllPosts,getLikedPosts,getFollowingPosts,getUserPosts } from '../controllers/post.controller.js';
 
const router = express.Router();

router.get('/all', protectRoute,getAllPosts);
router.get('/following', protectRoute,getFollowingPosts); // Assuming this is for posts from followed users
router.get('/user/:username', protectRoute,getUserPosts); // Assuming this is for liked posts by a user
router.post('/create', protectRoute,createPost);
router.post('/like/:id', protectRoute,likeUnlikePost);
router.post('/comment/:id', protectRoute,commentOnPost);
router.delete('/:id', protectRoute,deletePost);
router.get('/likes/:id',protectRoute,getLikedPosts);
  
export default router;