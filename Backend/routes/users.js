const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const {
  addUser,
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
} = require("../controllers/userController");

router.post("/add", auth, role("ceo"), addUser);

// Profile routes
router.get("/profile", auth, getUserProfile);
router.put("/profile", auth, uploadAvatar, updateUserProfile);

module.exports = router;
