// src/routes/messageRoutes.js

const express = require("express")
const router = express.Router()
const messageController = require("../controllers/messageController")
const authenticate = require("../middleware/authMiddleware")
const {
  encryptMessage,
  decryptMessage,
} = require("../middleware/encryptionMiddleware")

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

// Start a message with a user by their email
router.post(
  "/start-message",
  authenticate,
  encryptMessage,
  messageController.startMessageWithEmail
)

// Get all conversations for the user
router.get(
  "/conversations",
  authenticate,
  decryptMessage,
  messageController.getAllConversations
)

module.exports = router
