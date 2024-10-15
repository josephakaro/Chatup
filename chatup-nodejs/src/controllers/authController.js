// src/controllers/authController.js

const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { OAuth2Client } = require("google-auth-library")

const prisma = new PrismaClient()
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const register = async (req, res, next) => {
  const { email, password, name } = req.body

  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return res.status(400).json({ error: "Email already in use." })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    })

    // Respond
    res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
    })
  } catch (err) {
    next(err)
  }
}

const login = async (req, res, next) => {
  const { email, password } = req.body

  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !user.password) {
      return res.status(401).json({ error: "Invalid email or password." })
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." })
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    })

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      sameSite: "none",
      maxAge: 60 * 60 * 1000, // 1 hour
    })

    // Respond
    res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (err) {
    next(err)
  }
}

const loginWithGoogle = async (req, res, next) => {
  const { tokenId } = req.body

  try {
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: payload.email },
    })

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: payload.email,
          name: payload.name,
          avatar: payload.picture,
        },
      })
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    })

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      sameSite: "none",
      maxAge: 60 * 60 * 1000, // 1 hour
    })

    // Respond
    res.status(200).json({
      message: "Login successful.",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: "Invalid Google token." })
  }
}

const logout = async (req, res, next) => {
  // Since JWTs are stateless, implement token blacklisting or handle on client side
  // For simplicity, we'll respond with a success message
  res.status(200).json({ message: "Logout successful." })
}

module.exports = {
  register,
  login,
  loginWithGoogle,
  logout,
}
