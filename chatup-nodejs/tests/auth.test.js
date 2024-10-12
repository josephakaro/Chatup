// tests/auth.test.js

const request = require("supertest")
const express = require("express")
const authRoutes = require("../src/routes/authRoutes")
const errorHandler = require("../src/middleware/errorHandler")
const prisma = require("@prisma/client") // This will use the mocked Prisma

// Initialize Express app for testing
const app = express()
app.use(express.json())
app.use("/api/auth", authRoutes)
app.use(errorHandler)

// Auth Test

describe("Authentication Endpoints", () => {
  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      // Mock Prisma's findUnique to return null (no existing user)
      prisma.user.findUnique.mockResolvedValue(null)

      // Mock Prisma's create method to return the created user
      prisma.user.create.mockResolvedValue({
        id: "userId123",
        email: "user@example.com",
        name: "John Doe",
        createdAt: new Date().toISOString(),
      })

      const res = await request(app).post("/api/auth/register").send({
        email: "user@example.com",
        password: "SecurePassword123",
        name: "John Doe",
      })

      expect(res.statusCode).toEqual(201)
      expect(res.body).toHaveProperty(
        "message",
        "User registered successfully."
      )
      expect(res.body.user).toHaveProperty("id", "userId123")
      expect(res.body.user).toHaveProperty("email", "user@example.com")
      expect(res.body.user).toHaveProperty("name", "John Doe")
      expect(res.body.user).toHaveProperty("createdAt")
    })

    it("should return 400 if email is already in use", async () => {
      // Mock Prisma's findUnique to return an existing user
      prisma.user.findUnique.mockResolvedValue({
        id: "existingUserId",
        email: "user@example.com",
        name: "Existing User",
      })

      const res = await request(app).post("/api/auth/register").send({
        email: "user@example.com",
        password: "SecurePassword123",
        name: "John Doe",
      })

      expect(res.statusCode).toEqual(400)
      expect(res.body).toHaveProperty("error", "Email already in use.")
    })

    it("should handle server errors gracefully", async () => {
      // Mock Prisma's findUnique to throw an error
      prisma.user.findUnique.mockRejectedValue(new Error("Database error"))

      const res = await request(app).post("/api/auth/register").send({
        email: "user@example.com",
        password: "SecurePassword123",
        name: "John Doe",
      })

      expect(res.statusCode).toEqual(500)
      expect(res.body).toHaveProperty(
        "error",
        "Server error. Please try again later."
      )
    })
  })
})

// Login Test

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

describe("POST /api/auth/login", () => {
  it("should login successfully with correct credentials", async () => {
    // Mock Prisma's findUnique to return an existing user
    const hashedPassword = await bcrypt.hash("SecurePassword123", 10)
    prisma.user.findUnique.mockResolvedValue({
      id: "userId123",
      email: "user@example.com",
      name: "John Doe",
      password: hashedPassword,
    })

    const res = await request(app).post("/api/auth/login").send({
      email: "user@example.com",
      password: "SecurePassword123",
    })

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty("message", "Login successful.")
    expect(res.body).toHaveProperty("token")
    expect(res.body.user).toHaveProperty("id", "userId123")
    expect(res.body.user).toHaveProperty("email", "user@example.com")
    expect(res.body.user).toHaveProperty("name", "John Doe")

    // Optionally, verify the token
    const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET)
    expect(decoded).toHaveProperty("id", "userId123")
  })

  it("should return 401 for invalid email", async () => {
    // Mock Prisma's findUnique to return null (user not found)
    prisma.user.findUnique.mockResolvedValue(null)

    const res = await request(app).post("/api/auth/login").send({
      email: "nonexistent@example.com",
      password: "SecurePassword123",
    })

    expect(res.statusCode).toEqual(401)
    expect(res.body).toHaveProperty("error", "Invalid email or password.")
  })

  it("should return 401 for incorrect password", async () => {
    // Mock Prisma's findUnique to return an existing user
    const hashedPassword = await bcrypt.hash("SecurePassword123", 10)
    prisma.user.findUnique.mockResolvedValue({
      id: "userId123",
      email: "user@example.com",
      name: "John Doe",
      password: hashedPassword,
    })

    const res = await request(app).post("/api/auth/login").send({
      email: "user@example.com",
      password: "WrongPassword",
    })

    expect(res.statusCode).toEqual(401)
    expect(res.body).toHaveProperty("error", "Invalid email or password.")
  })

  it("should handle server errors gracefully", async () => {
    // Mock Prisma's findUnique to throw an error
    prisma.user.findUnique.mockRejectedValue(new Error("Database error"))

    const res = await request(app).post("/api/auth/login").send({
      email: "user@example.com",
      password: "SecurePassword123",
    })

    expect(res.statusCode).toEqual(500)
    expect(res.body).toHaveProperty(
      "error",
      "Server error. Please try again later."
    )
  })
})
