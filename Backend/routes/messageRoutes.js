const express = require("express");
const router = express.Router();
const {
  createMessage,
  getAllMessages,
  updateMessage,
  deleteMessage,
} = require("../controllers/messageController");

router.post("/messages", createMessage);
router.get("/messages", getAllMessages);
router.put("/messages/:id", updateMessage);
router.delete("/messages/:id", deleteMessage);

module.exports = router;
