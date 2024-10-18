// src/controllers/userController.js

const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const getUserProfile = async (req, res, next) => {
  try {
    const user = req.user

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    })
  } catch (err) {
    next(err)
  }
}

const updateUserProfile = async (req, res, next) => {
  const { name, avatar } = req.body

  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: name || req.user.name,
        avatar: avatar || req.user.avatar,
      },
    })

    res.status(200).json({
      message: "Profile updated successfully.",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        avatar: updatedUser.avatar,
        updatedAt: updatedUser.updatedAt,
      },
    })
  } catch (err) {
    next(err)
  }
}

const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();

    res.status(200).json({
      "message": "users retrieved successfully",
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar
      }))
    })
  } catch (err) {
    next(err)
  }
}


module.exports = {
  getUserProfile,
  updateUserProfile,
  getAllUsers
}
