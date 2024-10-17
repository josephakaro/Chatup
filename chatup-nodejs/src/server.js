require("dotenv").config()
const express = require("express")
const http = require("http")
const cors = require("cors")
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const socketio = require("socket.io")
const cookieParser = require("cookie-parser")
const path = require("path")
const setupSocket = require("./socket/socket")
const errorHandler = require("./middleware/errorHandler")

// Import Routes
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const groupRoutes = require("./routes/groupRoutes")
const messageRoutes = require("./routes/messageRoutes")

const app = express()
const server = http.createServer(app)

// Initialize Socket.io
const io = socketio(server, {
  cors: {
    origin: "*", // Update client URL in production
    methods: ["GET", "POST"],
    credentials: true,
  },
})

setupSocket(io)

// Middleware
app.use(
  cors({
    origin: "http://192.0.0.1:5173",
    credentials: true,
  })
)
app.use(express.json())
app.use(cookieParser())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/groups", groupRoutes)
app.use("/api/messages", messageRoutes)

// Error Handling Middleware
app.use(errorHandler)

// Start Server
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
