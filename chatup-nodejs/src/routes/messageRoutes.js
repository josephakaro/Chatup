// src/routes/messageRoutes.js

const express = require("express")
const router = express.Router()
const messageController = require("../controllers/messageController")
const authenticate = require("../middleware/authMiddleware")
const { encryptMessage } = require("../middleware/encryptionMiddleware")

// Send Private Message
router.post(
  "/private",
  authenticate,
  encryptMessage,
  messageController.sendPrivateMessage
)

// Send Group Message
router.post(
  "/group",
  authenticate,
  encryptMessage,
  messageController.sendGroupMessage
)

// Get Private Messages
router.get(
  "/private/:recipientId",
  authenticate,
  messageController.getPrivateMessages
)

// Get Group Messages
router.get("/group/:groupId", authenticate, messageController.getGroupMessages)

module.exports = router
