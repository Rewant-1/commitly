import User from '../models/user.model.js';
import {v2 as cloudinary} from 'cloudinary';
import Post from '../models/post.model.js';
import Notification from '../models/notification.model.js';
export const createPost = async (req, res) => {
    try {
        const { text} = req.body;
        let { img } = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (!text && !img) {
            return res.status(400).json({ error: "Post must contain text or an image" });
        }
        if(img){
            constuploadedResponse= await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url; // Get the secure URL of the uploaded image
        }
        const newPost=new Post ({
            user: userId,
            text: text ,
            img: img ,
        })
        await newPost.save();
        res.status(201).json(newPost);
    }catch (error) {
        console.log("Error in createPost:", error.message);
        res.status(500).json({ error: error.message });
    }}
export const deletePost = async (req, res) => {
    try {

        const post = await Post.findById(paramsId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        if (post.user.toString() !== userId) {
            return res.status(403).json({ error: "You can only delete your own posts" });
        }
        if(post.img) {
            // If the post has an image, delete it from Cloudinary
            const imgId = post.img.split('/').pop().split('.')[0]; // Extract public ID from URL
            await cloudinary.uploader.destroy(imgId);
        }
        await Post.findByIdAndDelete(req.paramsId);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.log("Error in deletePost:", error.message);
        res.status(500).json({ error: error.message });
    }
}
export const commentOnPost = async (req, res) => {
   
    try {
         const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id.toString();
        if (!text) {
            return res.status(400).json({ error: "Comment text is required" });
        }
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        const comment = {
            user: userId,
            text: text,
        };
        post.comments.push(comment);
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        console.log("Error in commentOnPost:", error.message);
        res.status(500).json({ error: error.message });
    }
}
export const likeUnlikePost = async (req, res) => {
    try {
        const {id:postId} = req.params;
        const userId = req.user._id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        const isLiked = post.likes.includes(userId);
        if (isLiked) {
            await Post.updateOne({_id:postId},{$pull:{likes:userId}})
            await user.updateOne({_id:userId},{$pull:{likedPosts:postId}}) // Remove post from user's likedPosts
            const updatedLikes=post.likes.filter((id)=> id.toString() !== userId.toString());
             // Update the likes array
            res.status(200).json(updatedLikes) // Remove user from likes
        } else {
            post.likes.push(userId);
            await User.updateOne({_id:userId},{$push:{likedPosts:postId}}) // Add post to user's likedPosts
            await post.save();
            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like",
             // Add user to likes
        })
        await notification.save();
        const updatedLikes=post.likes; // Get the updated likes array
            res.status(200).json(post.likes);
        
    } }catch (error) {
        console.log("Error in likeUnlikePost:", error.message);
        res.status(500).json({ error: error.message });
    }
}
export const getAllPosts = async (req, res) => {
    try {
        
        if(posts.length === 0) {
            return res.status(404).json({ message: "No posts found" });}
            const posts = await Post.find().sort({ createdAt: -1 })
             .populate({path: 'user', select: "-password -email -__v"})
             .populate({path: 'comments.user', select: "-password -email -__v"})
             .populate({path: 'likes', select: "-password -email -__v"})
             .sort({ createdAt: -1 }); // Sort by creation date, most recent first
        res.status(200).json(posts);
    } catch (error) {
        console.log("Error in getAllPosts:", error.message);
        res.status(500).json({ error: error.message });
    }
}
export const getLikedPosts = async (req, res) => {
    const userId=req.params.id;
    try {
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
            .populate({ path: 'user', select: "-password -email -__v" })
            .populate({ path: 'comments.user', select: "-password -email -__v" })
            .populate({ path: 'likes', select: "-password -email -__v" })
            .sort({ createdAt: -1 });
            res.status(200).json(likedPosts); // Sort by creation date, most recent first
}catch (error) {
        console.log("Error in getLikedPosts:", error.message);
        res.status(500).json({ error: error.message });
    }
}
export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        } 
        const following=user.following; 
        const feedPosts= await Post.find({ user: { $in: following } })
        .sort({ createdAt: -1 })
        .populate({ path: 'user', select: "-password -email -__v" })
        .populate({ path: 'comments.user', select: "-password -email -__v" }) 
        .populate({ path: 'likes', select: "-password -email -__v" });
        res.status(200).json(feedPosts);}
    catch (error) {
        console.log("Error in getFollowingPosts:", error.message);
        res.status(500).json({ error: error.message });
    }
}
export const getUserPosts = async (req, res) => {
    try {
        const {username} = req.params;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const posts= await Post.find({ user: user._id }).sort({ createdAt: -1 })
            .populate({ path: 'user', select: "-password -email -__v" })
            .populate({ path: 'comments.user', select: "-password -email -__v" })
            .populate({ path: 'likes', select: "-password -email -__v" });
            res.status(200).json(posts);
    }
    catch (error) {
        console.log("Error in getUserPosts:", error.message);
        res.status(500).json({ error: error.message });
    }}