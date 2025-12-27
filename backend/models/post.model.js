// Post model schema - defines structure for social media posts
import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
	{
		// Post author reference
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		
		// Post content
		text: {
			type: String,
		},
		img: {
			type: String, // Cloudinary URL for uploaded images
		},
		
		// Social interactions
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		reposts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		
		// Comments on the post
		comments: [
			{
				text: {
					type: String,
					required: true,
				},
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
			},
		],
	},
	{ timestamps: true } // Add createdAt and updatedAt automatically
);

postSchema.index({ createdAt: -1 });
postSchema.index({ user: 1, createdAt: -1 });

const Post = mongoose.model("Post", postSchema);

export default Post;