// tests/user.test.js

const request = require("supertest")
const express = require("express")
const userRoutes = require("../src/routes/userRoutes")
const authMiddleware = require("../src/middleware/authMiddleware")
const errorHandler = require("../src/middleware/errorHandler")
const prisma = require("@prisma/client") // This will use the mocked Prisma

// Initialize Express app for testing
const app = express()
app.use(express.json())

// Mock Authentication Middleware to attach a mock user to the request
app.use((req, res, next) => {
  req.headers.authorization = "Bearer testtoken"
  next()
})

app.use(authMiddleware)
app.use("/api/users", userRoutes)
app.use(errorHandler)

describe("User Endpoints", () => {
  describe("GET /api/users/profile", () => {
    it("should retrieve the user profile successfully", async () => {
      // Mock the authenticated user attached by authMiddleware
      const mockUser = {
        id: "userId123",
        email: "user@example.com",
        name: "John Doe",
        avatar: "https://example.com/avatar.jpg",
        createdAt: new Date().toISOString(),
      }

      // Mock prisma.user.findUnique to return the mock user
      prisma.user.findUnique.mockResolvedValue(mockUser)

      const res = await request(app)
        .get("/api/users/profile")
        .set("Authorization", "Bearer validtoken")

      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty("user")
      expect(res.body.user).toMatchObject({
        id: "userId123",
        email: "user@example.com",
        name: "John Doe",
        avatar: "https://example.com/avatar.jpg",
        createdAt: mockUser.createdAt,
      })
    })

    it("should return 401 if token is invalid or missing", async () => {
      // Modify authMiddleware to simulate invalid token
      const originalAuthenticate = authMiddleware

      // Override the authentication middleware to simulate invalid token
      app.use((req, res, next) => {
        req.headers.authorization = "Bearer invalidtoken"
        next()
      })

      const res = await request(app)
        .get("/api/users/profile")
        .set("Authorization", "Bearer invalidtoken")

      expect(res.statusCode).toEqual(401)
      expect(res.body).toHaveProperty("error", "Invalid or expired token.")
    })

    it("should return 404 if user is not found", async () => {
      // Mock prisma.user.findUnique to return null
      prisma.user.findUnique.mockResolvedValue(null)

      const res = await request(app)
        .get("/api/users/profile")
        .set("Authorization", "Bearer validtoken")

      expect(res.statusCode).toEqual(404)
      expect(res.body).toHaveProperty("error", "User not found.")
    })

    it("should handle server errors gracefully", async () => {
      // Mock prisma.user.findUnique to throw an error
      prisma.user.findUnique.mockRejectedValue(new Error("Database error"))

      const res = await request(app)
        .get("/api/users/profile")
        .set("Authorization", "Bearer validtoken")

      expect(res.statusCode).toEqual(500)
      expect(res.body).toHaveProperty(
        "error",
        "Server error. Please try again later."
      )
    })
  })
})

// User Profile

describe("PUT /api/users/profile", () => {
  it("should update the user profile successfully", async () => {
    // Mock the authenticated user attached by authMiddleware
    const mockUser = {
      id: "userId123",
      email: "user@example.com",
      name: "John Doe",
      avatar: "https://example.com/avatar.jpg",
      updatedAt: new Date().toISOString(),
    }

    // Mock prisma.user.update to return the updated user
    prisma.user.update.mockResolvedValue(mockUser)

    const res = await request(app)
      .put("/api/users/profile")
      .send({
        name: "John Doe Updated",
        avatar: "https://example.com/new-avatar.jpg",
      })
      .set("Authorization", "Bearer validtoken")

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty("message", "Profile updated successfully.")
    expect(res.body.user).toMatchObject({
      id: "userId123",
      email: "user@example.com",
      name: "John Doe Updated",
      avatar: "https://example.com/new-avatar.jpg",
      updatedAt: mockUser.updatedAt,
    })
  })

  it("should return 400 for invalid input data", async () => {
    // Assume that the controller validates input and returns 400 for invalid data
    // For example, missing required fields

    const res = await request(app)
      .put("/api/users/profile")
      .send({
        // Missing 'name' and 'avatar'
      })
      .set("Authorization", "Bearer validtoken")

    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty("error", "Invalid input data.")
  })

  it("should return 401 if token is invalid or missing", async () => {
    const res = await request(app)
      .put("/api/users/profile")
      .send({
        name: "John Doe Updated",
        avatar: "https://example.com/new-avatar.jpg",
      })
      .set("Authorization", "Bearer invalidtoken")

    expect(res.statusCode).toEqual(401)
    expect(res.body).toHaveProperty("error", "Invalid or expired token.")
  })

  it("should handle server errors gracefully", async () => {
    // Mock prisma.user.update to throw an error
    prisma.user.update.mockRejectedValue(new Error("Database error"))

    const res = await request(app)
      .put("/api/users/profile")
      .send({
        name: "John Doe Updated",
        avatar: "https://example.com/new-avatar.jpg",
      })
      .set("Authorization", "Bearer validtoken")

    expect(res.statusCode).toEqual(500)
    expect(res.body).toHaveProperty(
      "error",
      "Server error. Please try again later."
    )
  })
})
