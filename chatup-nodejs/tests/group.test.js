// tests/group.test.js

const request = require("supertest")
const express = require("express")
const groupRoutes = require("../src/routes/groupRoutes")
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
app.use("/api/groups", groupRoutes)
app.use(errorHandler)

describe("Group Endpoints", () => {
  describe("POST /api/groups", () => {
    it("should create a new group successfully", async () => {
      // Mock prisma.user.findMany to return valid users
      prisma.user.findMany.mockResolvedValue([
        { id: "userId123" },
        { id: "userId456" },
        { id: "userId789" },
      ])

      // Mock prisma.group.create to return the created group
      prisma.group.create.mockResolvedValue({
        id: "groupId123",
        name: "Family Group",
        members: [
          { id: "userId123" },
          { id: "userId456" },
          { id: "userId789" },
        ],
        createdAt: new Date().toISOString(),
      })

      const res = await request(app)
        .post("/api/groups")
        .send({
          name: "Family Group",
          members: ["userId123", "userId456", "userId789"],
        })
        .set("Authorization", "Bearer validtoken")

      expect(res.statusCode).toEqual(201)
      expect(res.body).toHaveProperty("message", "Group created successfully.")
      expect(res.body.group).toMatchObject({
        id: "groupId123",
        name: "Family Group",
        members: ["userId123", "userId456", "userId789"],
        createdAt: expect.any(String),
      })
    })

    it("should include the creator in the group if not already included", async () => {
      // Mock prisma.user.findMany to return valid users
      prisma.user.findMany.mockResolvedValue([
        { id: "userId123" }, // Creator
        { id: "userId456" },
      ])

      // Mock prisma.group.create to return the created group
      prisma.group.create.mockResolvedValue({
        id: "groupId124",
        name: "Friends Group",
        members: [{ id: "userId123" }, { id: "userId456" }],
        createdAt: new Date().toISOString(),
      })

      const res = await request(app)
        .post("/api/groups")
        .send({
          name: "Friends Group",
          members: ["userId456"], // Creator (userId123) is not included
        })
        .set("Authorization", "Bearer validtoken")

      // Ensure the creator is added
      expect(prisma.group.create).toHaveBeenCalledWith({
        data: {
          name: "Friends Group",
          members: {
            connect: [{ id: "userId456" }, { id: "userId123" }],
          },
        },
        include: { members: true },
      })

      expect(res.statusCode).toEqual(201)
      expect(res.body.group.members).toContain("userId123")
      expect(res.body.group.members).toContain("userId456")
    })

    it("should return 400 for invalid member IDs", async () => {
      // Mock prisma.user.findMany to return fewer users than provided
      prisma.user.findMany.mockResolvedValue([{ id: "userId123" }]) // Missing userId456

      const res = await request(app)
        .post("/api/groups")
        .send({
          name: "Invalid Group",
          members: ["userId123", "userId456"],
        })
        .set("Authorization", "Bearer validtoken")

      expect(res.statusCode).toEqual(400)
      expect(res.body).toHaveProperty("error", "Invalid group data or members.")
    })

    it("should handle server errors gracefully", async () => {
      // Mock prisma.user.findMany to throw an error
      prisma.user.findMany.mockRejectedValue(new Error("Database error"))

      const res = await request(app)
        .post("/api/groups")
        .send({
          name: "Error Group",
          members: ["userId123", "userId456"],
        })
        .set("Authorization", "Bearer validtoken")

      expect(res.statusCode).toEqual(500)
      expect(res.body).toHaveProperty(
        "error",
        "Server error. Please try again later."
      )
    })
  })
})
