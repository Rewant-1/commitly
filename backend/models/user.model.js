// User model schema - defines user structure and relationships in MongoDB
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		// Basic user information
		username: {
			type: String,
			required: true,
			unique: true,
		},
		fullName: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
			minLength: 6,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		
		// Social connections
		followers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				default: [],
			},
		],
		following: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				default: [],
			},
		],
		
		// Profile customization
		profileImg: {
			type: String,
			default: "",
		},
		coverImg: {
			type: String,
			default: "",
		},
		bio: {
			type: String,
			default: "",
		},
		link: {
			type: String,
			default: "",
		},
		
		// User interaction history
		likedPosts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Post",
				default: [],
			},
		],
		bookmarkedPosts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Post",
				default: [],
			},
		],
		retweetedPosts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Post",
				default: [],
			},
		],
		conversations: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Conversation",
				default: [],
			},
		],
		
		// Custom terminal theme field
		dotfile: {
			type: String,
			default: '',
		},
	},
	{ 
		timestamps: true,           // Add createdAt and updatedAt fields
		toJSON: { virtuals: true }, // Include virtual fields in JSON output
		toObject: { virtuals: true } 
	}
);

// Virtual populate: posts authored by this user
userSchema.virtual("posts", {
	ref: "Post",
	localField: "_id",
	foreignField: "user",
});

const User = mongoose.model("User", userSchema);

export default User;