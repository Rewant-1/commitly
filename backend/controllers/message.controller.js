import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getMessages = async (req, res) => {
	try {
		const { username } = req.params;
		const senderId = req.user._id;

		// Find the recipient user
		const recipient = await User.findOne({ username });
		if (!recipient) {
			return res.status(404).json({ error: "User not found" });
		}

		// Get messages between the two users
		const messages = await Message.find({
			$or: [
				{ sender: senderId, recipient: recipient._id },
				{ sender: recipient._id, recipient: senderId }
			]
		})
		.populate("sender", "username fullName profileImg")
		.populate("recipient", "username fullName profileImg")
		.sort({ createdAt: 1 });

		// Mark messages as read
		await Message.updateMany(
			{ sender: recipient._id, recipient: senderId, read: false },
			{ read: true }
		);

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const sendMessage = async (req, res) => {
	try {
		const { message } = req.body;
		const { username } = req.params;
		const senderId = req.user._id;

		// Find the recipient user
		const recipient = await User.findOne({ username });
		if (!recipient) {
			return res.status(404).json({ error: "User not found" });
		}

		// Prevent sending message to yourself
		if (recipient._id.toString() === senderId.toString()) {
			return res.status(400).json({ error: "You cannot send a message to yourself" });
		}

		// Create new message
		const newMessage = new Message({
			sender: senderId,
			recipient: recipient._id,
			message,
		});

		await newMessage.save();

		// Populate the message before sending response
		await newMessage.populate("sender", "username fullName profileImg");
		await newMessage.populate("recipient", "username fullName profileImg");

		res.status(201).json(newMessage);
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getConversations = async (req, res) => {
	try {
		const userId = req.user._id;

		// Get all unique conversations for the user
		const conversations = await Message.aggregate([
			{
				$match: {
					$or: [{ sender: userId }, { recipient: userId }]
				}
			},
			{
				$sort: { createdAt: -1 }
			},
			{
				$group: {
					_id: {
						$cond: {
							if: { $eq: ["$sender", userId] },
							then: "$recipient",
							else: "$sender"
						}
					},
					lastMessage: { $first: "$$ROOT" },
					unreadCount: {
						$sum: {
							$cond: {
								if: {
									$and: [
										{ $eq: ["$recipient", userId] },
										{ $eq: ["$read", false] }
									]
								},
								then: 1,
								else: 0
							}
						}
					}
				}
			},
			{
				$lookup: {
					from: "users",
					localField: "_id",
					foreignField: "_id",
					as: "user"
				}
			},
			{
				$unwind: "$user"
			},
			{
				$project: {
					user: {
						_id: 1,
						username: 1,
						fullName: 1,
						profileImg: 1
					},
					lastMessage: 1,
					unreadCount: 1
				}
			},
			{
				$sort: { "lastMessage.createdAt": -1 }
			}
		]);

		res.status(200).json(conversations);
	} catch (error) {
		console.log("Error in getConversations controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
