// src/controllers/groupController.js

const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

// Create a new group
const createGroup = async (req, res, next) => {
  const { name, members } = req.body

  try {
    // Ensure the creator is included in the group
    let memberIds = members || []
    if (!memberIds.includes(req.user.id)) {
      memberIds.push(req.user.id)
    }

    // Verify all member IDs exist
    const users = await prisma.user.findMany({
      where: { id: { in: memberIds } },
      select: { id: true },
    })

    if (users.length !== memberIds.length) {
      return res.status(400).json({ error: "Invalid group data or members." })
    }

    // Create group with members via GroupMembership
    const group = await prisma.group.create({
      data: {
        name,
        members: {
          create: memberIds.map((userId) => ({
            user: { connect: { id: userId } },
          })),
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    })

    res.status(201).json({
      message: "Group created successfully.",
      group: {
        id: group.id,
        name: group.name,
        members: group.members.map((membership) => membership.user.id),
        createdAt: group.createdAt,
      },
    })
  } catch (err) {
    next(err)
  }
}

// Get details of a specific group
const getGroupDetails = async (req, res, next) => {
  const { groupId } = req.params

  try {
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    })

    if (!group) {
      return res.status(404).json({ error: "Group not found." })
    }

    // Check if the requester is a member
    const isMember = group.members.some(
      (membership) => membership.user.id === req.user.id
    )

    if (!isMember) {
      return res
        .status(403)
        .json({ error: "You are not a member of this group." })
    }

    res.status(200).json({
      group: {
        id: group.id,
        name: group.name,
        members: group.members.map((membership) => ({
          id: membership.user.id,
          name: membership.user.name,
          email: membership.user.email,
        })),
        createdAt: group.createdAt,
      },
    })
  } catch (err) {
    next(err)
  }
}

// Add members to an existing group
const addMembersToGroup = async (req, res, next) => {
  const { groupId } = req.params
  const { members } = req.body

  try {
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: { members: true },
    })

    if (!group) {
      return res.status(404).json({ error: "Group not found." })
    }

    // Check if the requester is authorized (e.g., admin)
    // Implement admin roles as needed. For simplicity, assume any member can add others.

    // Verify all member IDs exist
    const users = await prisma.user.findMany({
      where: { id: { in: members } },
      select: { id: true },
    })

    console.log(typeof members, "Line: 108")

    if (users.length !== members.length) {
      return res.status(400).json({ error: "Invalid member IDs." })
    }

    // Prevent adding members who are already in the group
    const existingMemberIds = group.members.map((membership) => membership.id)

    const newMemberIds = members.filter((id) => !existingMemberIds.includes(id))

    if (newMemberIds.length === 0) {
      return res
        .status(400)
        .json({ error: "All members are already in the group." })
    }

    // Add members via GroupMembership
    const updatedGroup = await prisma.group.update({
      where: { id: groupId },
      data: {
        members: {
          create: newMemberIds.map((userId) => ({
            user: { connect: { id: userId } },
          })),
        },
      },
      include: { members: { include: { user: true } } },
    })

    res.status(200).json({
      message: "Members added successfully.",
      group: {
        id: updatedGroup.id,
        members: updatedGroup.members.map((membership) => membership.user.id),
      },
    })
  } catch (err) {
    next(err)
  }
}

// Remove members from an existing group
const removeMembersFromGroup = async (req, res, next) => {
  const { groupId } = req.params
  const { members } = req.body

  try {
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: { members: true },
    })

    if (!group) {
      return res.status(404).json({ error: "Group not found." })
    }

    // Check if the requester is authorized (e.g., admin)
    // Implement admin roles as needed. For simplicity, assume any member can remove others.

    // Verify that members to be removed are part of the group
    const existingMemberIds = group.members.map((membership) => membership.id)

    console.log(existingMemberIds, "Line: 166")

    const invalidMemberIds = members.filter(
      (id) => !existingMemberIds.includes(id)
    )

    if (invalidMemberIds.length > 0) {
      return res
        .status(400)
        .json({ error: "Some members are not part of the group." })
    }

    // Remove members by deleting their GroupMembership entries
    await prisma.groupMembership.deleteMany({
      where: {
        groupId,
        userId: { in: members },
      },
    })

    // Fetch updated group members
    const updatedGroup = await prisma.group.findUnique({
      where: { id: groupId },
      include: { members: { include: { user: true } } },
    })

    res.status(200).json({
      message: "Members removed successfully.",
      group: {
        id: updatedGroup.id,
        members: updatedGroup.members.map((membership) => membership.id),
      },
    })
  } catch (err) {
    next(err)
  }
}

// Delete a group
const deleteGroup = async (req, res, next) => {
  const { groupId } = req.params

  try {
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: { members: true },
    })

    if (!group) {
      return res.status(404).json({ error: "Group not found." })
    }

    // Delete the group, which should cascade delete GroupMemberships if configured

    // Delete Cascade
    await prisma.groupMembership.deleteMany({
      where: { groupId },
    })

    // Delete Group
    await prisma.group.delete({
      where: { id: groupId },
    })

    res.status(200).json({ message: "Group deleted successfully." })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createGroup,
  getGroupDetails,
  addMembersToGroup,
  removeMembersFromGroup,
  deleteGroup,
}
