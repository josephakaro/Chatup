// src/routes/userRoutes.js

const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const authenticate = require("../middleware/authMiddleware")

// Get User Profile
router.get("/profile", authenticate, userController.getUserProfile)

// Update User Profile
router.put("/profile", authenticate, userController.updateUserProfile)

module.exports = router
