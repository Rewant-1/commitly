import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";

export const startConversation = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const userId = req.user._id;
    if (recipientId === userId.toString()) {
      return res.status(400).json({ error: "Cannot start a conversation with yourself." });
    }
    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, recipientId], $size: 2 },
    });
    if (!conversation) {
      conversation = new Conversation({ participants: [userId, recipientId], messages: [] });
      await conversation.save();
      // Add conversation to both users
      await User.findByIdAndUpdate(userId, { $push: { conversations: conversation._id } });
      await User.findByIdAndUpdate(recipientId, { $push: { conversations: conversation._id } });
    }
    res.status(200).json(conversation);
  } catch (error) {
    console.log("Error in startConversation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ error: "Conversation not found" });
    conversation.messages.push({ sender: userId, text });
    await conversation.save();
    res.status(200).json(conversation);
  } catch (error) {
    console.log("Error in sendMessage:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const conversations = await Conversation.find({ participants: userId })
      .populate("participants", "_id username fullName profileImg")
      .sort({ updatedAt: -1 });
    res.status(200).json(conversations);
  } catch (error) {
    console.log("Error in getConversations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId).populate("messages.sender", "_id username fullName profileImg");
    if (!conversation) return res.status(404).json({ error: "Conversation not found" });
    res.status(200).json(conversation.messages);
  } catch (error) {
    console.log("Error in getMessages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}; 