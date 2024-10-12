// src/socket/socket.js

const jwt = require("jsonwebtoken")
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const setupSocket = (io) => {
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token

    if (!token) {
      return next(new Error("Authentication error"))
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      })

      if (!user) {
        return next(new Error("Authentication error"))
      }

      socket.user = user
      next()
    } catch (err) {
      next(new Error("Authentication error"))
    }
  })

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.id}`)

    // Join personal room
    socket.join(socket.user.id)

    // Handle joining group rooms
    socket.on("joinGroup", (groupId) => {
      socket.join(groupId)
      console.log(`User ${socket.user.id} joined group ${groupId}`)
    })

    // Handle leaving group rooms
    socket.on("leaveGroup", (groupId) => {
      socket.leave(groupId)
      console.log(`User ${socket.user.id} left group ${groupId}`)
    })

    // Handle sending messages
    socket.on("sendMessage", async (data) => {
      const { type, recipientId, groupId, content } = data

      // Basic validation
      if (!content) {
        return
      }

      if (type === "private") {
        // Send to recipient's personal room
        io.to(recipientId).emit("receiveMessage", {
          senderId: socket.user.id,
          content,
          createdAt: new Date(),
        })
      } else if (type === "group") {
        // Send to group room
        io.to(groupId).emit("receiveMessage", {
          senderId: socket.user.id,
          groupId,
          content,
          createdAt: new Date(),
        })
      }
    })

    // Handle typing indicator
    socket.on("typing", (data) => {
      const { type, recipientId, groupId } = data

      if (type === "private") {
        socket.to(recipientId).emit("typing", {
          userId: socket.user.id,
          type,
        })
      } else if (type === "group") {
        socket.to(groupId).emit("typing", {
          userId: socket.user.id,
          type,
        })
      }
    })

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.id}`)
    })
  })
}

module.exports = setupSocket
