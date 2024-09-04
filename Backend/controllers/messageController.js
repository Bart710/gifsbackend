const Message = require("../models/message");

exports.createMessage = async (req, res) => {
  try {
    const { label, content } = req.body;

    if (!label || !content) {
      return res
        .status(400)
        .json({ message: "Both label and content are required" });
    }

    const newMessage = new Message({ label, content });
    await newMessage.save();

    res
      .status(201)
      .json({ message: "Message created successfully", newMessage });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating message", error: error.message });
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find({});
    res.json(messages);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching messages", error: error.message });
  }
};

exports.updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { label, content } = req.body;

    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { label, content },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json({ message: "Message updated successfully", updatedMessage });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating message", error: error.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMessage = await Message.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json({ message: "Message deleted successfully", deletedMessage });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error deleting message", error: error.message });
  }
};
