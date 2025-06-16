const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

// Get user profile
router.get("/profile", authMiddleware, userController.getUserProfile);

// Update user profile
router.put(
  "/profile",
  authMiddleware,
  userController.uploadAvatar,
  userController.updateUserProfile
);

module.exports = router;
