// src/controllers/messageController.js

const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const { decryptMessage } = require("../middleware/encryptionMiddleware")

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
  const { recipientId } = req.params
  const { page = 1, limit = 50 } = req.query

  try {
    // Verify recipient exists
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
    })

    if (!recipient) {
      return res.status(404).json({ error: "Recipient user not found." })
    }

    // Check authorization: only involved users can view message.

    // Retrieve messages
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: req.user.id,
            recipientId,
          },
          {
            senderId: recipientId,
            recipientId: req.user.id,
          },
        ],
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: parseInt(limit),
    })

    console.log(messages)

    // Decrypt messages
    const decryptedMessages = messages.map(decryptMessage)

    // Get total count
    const totalMessages = await prisma.message.count({
      where: {
        OR: [
          {
            senderId: req.user.id,
            recipientId,
          },
          {
            senderId: recipientId,
            recipientId: req.user.id,
          },
        ],
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

module.exports = {
  sendPrivateMessage,
  sendGroupMessage,
  getPrivateMessages,
  getGroupMessages,
}
