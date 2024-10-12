// src/routes/authRoutes.js

const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")
const authenticate = require("../middleware/authMiddleware")

// Register
router.post("/register", authController.register)

// Login with Email
router.post("/login", authController.login)

// Login with Google
router.post("/google", authController.loginWithGoogle)

// Logout
router.post("/logout", authenticate, authController.logout)

module.exports = router
