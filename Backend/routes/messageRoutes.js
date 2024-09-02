const express = require("express");
const router = express.Router();
const {
  createMessage,
  getAllMessages,
  updateMessage,
} = require("../controllers/messageController");

router.post("/messages", createMessage);
router.get("/messages", getAllMessages);
router.put("/messages/:id", updateMessage);

module.exports = router;
