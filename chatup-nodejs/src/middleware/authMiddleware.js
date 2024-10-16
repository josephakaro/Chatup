// Desc: Middleware to authenticate user requests
// Auth: Webstack Portfolio, 2024
// Date: 2024-10-12
const jwt = require("jsonwebtoken")
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Invalid or missing token." })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    })

    if (!user) {
      return res.status(401).json({ error: "Invalid token." })
    }

    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." })
  }
}

module.exports = authenticate
