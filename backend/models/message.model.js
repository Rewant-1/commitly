import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		recipient: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		message: {
			type: String,
			required: true,
			maxLength: 1000,
		},
		read: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

// Index for efficient querying
messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
