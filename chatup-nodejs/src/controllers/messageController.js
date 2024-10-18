// src/controllers/messageController.js

const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const { decryptMessage } = require("../middleware/encryptionMiddleware")
const { decrypt } = require("../utils/encryption")

const sendPrivateMessage = async (req, res, next) => {
  const { recipientId, content } = req.body

  try {
    // Verify recipient exists
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
    })

    if (!recipient) {
      return res.status(404).json({ error: "Recipient user not found." })
    }

    // Create message with relations
    const message = await prisma.message.create({
      data: {
        sender: { connect: { id: req.user.id } }, // Connect sender relation
        recipient: { connect: { id: recipientId } }, // Connect recipient relation
        content, // Already encrypted via middleware
      },
    })

    res.status(201).json({
      message: "Message sent successfully.",
      data: {
        id: message.id,
        senderId: message.senderId,
        recipientId: message.recipientId,
        content: message.content,
        createdAt: message.createdAt,
      },
    })
  } catch (err) {
    next(err)
  }
}

const sendGroupMessage = async (req, res, next) => {
  const { groupId, content } = req.body

  try {
    // Verify group exists
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: { members: { include: { user: true } } },
    })

    if (!group) {
      return res.status(404).json({ error: "Group not found." })
    }

    // Check authorization: only group members can send messages
    const isMember = group.members.some(
      (membership) => membership.user.id === req.user.id
    )

    if (!isMember) {
      return res
        .status(403)
        .json({ error: "You are not a member of this group." })
    }

    // Create message with relations
    const message = await prisma.message.create({
      data: {
        sender: { connect: { id: req.user.id } }, // Establish relation with sender
        group: { connect: { id: groupId } }, // Establish relation with group
        content, // Already encrypted via middleware
      },
    })

    res.status(201).json({
      message: "Message sent to group successfully.",
      data: {
        id: message.id,
        senderId: message.senderId,
        groupId: message.groupId,
        content: message.content,
        createdAt: message.createdAt,
      },
    })
  } catch (err) {
    next(err)
  }
}

const getPrivateMessages = async (req, res, next) => {
  const { recipientId } = req.params // The other user involved in the conversation
  const { page = 1, limit = 50 } = req.query // Pagination query params

  try {
    // Verify recipient exists
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
    })

    if (!recipient) {
      return res.status(404).json({ error: "Recipient user not found." })
    }

    // Check authorization: only involved users (sender or recipient) can view messages

    // Retrieve both sent and received messages between the current user and the recipient
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          // Messages sent by current user to the recipient
          {
            senderId: req.user.id,
            recipientId,
          },
          // Messages sent by the recipient to the current user
          {
            senderId: recipientId,
            recipientId: req.user.id,
          },
        ],
      },
      orderBy: { createdAt: "desc" }, // Order by newest first
      skip: (page - 1) * limit, // Pagination: Skip messages based on page
      take: parseInt(limit), // Limit the number of messages fetched
    })

    // Decrypt messages (assuming a `decryptMessage` utility function is available)
    const decryptedMessages = messages.map(decryptMessage)

    // Get total message count for pagination
    const totalMessages = await prisma.message.count({
      where: {
        OR: [
          { senderId: req.user.id, recipientId },
          { senderId: recipientId, recipientId: req.user.id },
        ],
      },
    })

    // Respond with messages and pagination info
    res.status(200).json({
      messages: decryptedMessages,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalMessages / limit),
        totalMessages,
      },
    })
  } catch (err) {
    next(err) // Handle any errors
  }
}

const getGroupMessages = async (req, res, next) => {
  const { groupId } = req.params
  const { page = 1, limit = 50 } = req.query

  try {
    // Verify group exists
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: { members: true },
    })

    if (!group) {
      return res.status(404).json({ error: "Group not found." })
    }

    // Check if user is a member
    const isMember = group.members.some((member) => member.id === req.user.id)

    if (!isMember) {
      return res
        .status(403)
        .json({ error: "You are not a member of this group." })
    }

    // Retrieve messages
    const messages = await prisma.message.findMany({
      where: {
        groupId,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: parseInt(limit),
    })

    // Decrypt messages
    const decryptedMessages = messages.map(decryptMessage)

    // Get total count
    const totalMessages = await prisma.message.count({
      where: {
        groupId,
      },
    })

    res.status(200).json({
      messages: decryptedMessages,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalMessages / limit),
        totalMessages,
      },
    })
  } catch (err) {
    next(err)
  }
}

// Start a new conversation with a user by email

const startMessageWithEmail = async (req, res, next) => {
  const { email, content } = req.body

  try {
    // Find recipient by email
    const recipient = await prisma.user.findUnique({
      where: { email },
    })

    if (!recipient) {
      return res.status(404).json({ error: "Recipient not found." })
    }

    // Check if sender and recipient are the same person
    if (recipient.id === req.user.id) {
      return res.status(400).json({ error: "You cannot message yourself." })
    }

    // Create a message to start the conversation
    const message = await prisma.message.create({
      data: {
        senderId: req.user.id,
        recipientId: recipient.id,
        content, // Assume content is already encrypted in middleware
      },
    })

    res.status(201).json({
      message: "Message sent successfully.",
      data: {
        id: message.id,
        senderId: message.senderId,
        recipientId: message.recipientId,
        content: message.content,
        createdAt: message.createdAt,
      },
    })
  } catch (err) {
    next(err)
  }
}

const getAllConversations = async (req, res, next) => {
  try {
    // Retrieve distinct conversations
    const conversations = await prisma.message.findMany({
      where: {
        OR: [{ senderId: req.user.id }, { recipientId: req.user.id }],
      },
      distinct: ["senderId", "recipientId"],
      orderBy: { createdAt: "desc" },
      skip: (req.query.page - 1) * req.query.limit || 0,
      take: parseInt(req.query.limit) || 50,
    })

    // Get total count of distinct conversations
    const totalConversations = conversations.length

    // Format response
    res.status(200).json({
      conversations: conversations.map((convo) => ({
        id: convo.id,
        lastMessage: convo.content,
        conversationWith:
          convo.senderId === req.user.id ? convo.recipientId : convo.senderId,
        lastUpdated: convo.createdAt,
      })),
      pagination: {
        currentPage: parseInt(req.query.page) || 1,
        totalPages: Math.ceil(
          totalConversations / (parseInt(req.query.limit) || 50)
        ),
        totalConversations,
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  sendPrivateMessage,
  sendGroupMessage,
  getPrivateMessages,
  getGroupMessages,
  startMessageWithEmail,
  getAllConversations,
}
