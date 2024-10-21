// src/routes/groupRoutes.js

const express = require("express")
const router = express.Router()
const groupController = require("../controllers/groupController")
const authenticate = require("../middleware/authMiddleware")

// Create Group
router.post("/", authenticate, groupController.createGroup)

// Get all groups
router.get("/all", authenticate, groupController.getAllGroups)
// Get all groups a user is part of
router.get("/usergroups/:userId", authenticate, groupController.getGroupsForUser)
// Get Group Details
router.get("/:groupId", authenticate, groupController.getGroupDetails)

// Add Members to Group
router.post(
  "/:groupId/members",
  authenticate,
  groupController.addMembersToGroup
)

// Remove Members from Group
router.delete(
  "/:groupId/members",
  authenticate,
  groupController.removeMembersFromGroup
)

// Delete Group
router.delete("/:groupId", authenticate, groupController.deleteGroup)

module.exports = router
