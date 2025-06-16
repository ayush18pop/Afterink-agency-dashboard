const User = require("../models/User");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");

// Configure multer for avatar upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/avatars/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "avatar-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

exports.uploadAvatar = upload.single("avatar");

exports.addUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const currentUser = req.user; // Comes from auth middleware

    // Validate if user already exists
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already exists" });

    // Only CEO can add founding members
    if (role === "founding_member" && currentUser.role !== "ceo") {
      return res
        .status(403)
        .json({ error: "Only CEO can create founding members" });
    }

    // Freelancers can be added by both CEO and founding members
    if (
      role === "freelancer" &&
      !["ceo", "founding_member"].includes(currentUser.role)
    ) {
      return res
        .status(403)
        .json({ error: "Only CEO or Founding Members can add freelancers" });
    }

    // Restrict invalid role creation
    if (!["freelancer", "founding_member"].includes(role)) {
      return res.status(400).json({ error: "Invalid role assignment" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashed, role });

    res.status(201).json({ message: `${role} created`, userId: newUser._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user profile data
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // TODO: Add performance metrics calculation
    // For now, returning placeholder data
    const performanceMetrics = {
      tasksCompleted: 0,
      totalHoursWorked: 0,
      averageRating: 0,
      onTimeDelivery: 0,
    };

    // TODO: Add recent activity from actual data
    const recentActivity = [];

    res.json({
      profile: {
        name: user.name,
        email: user.email,
        bio: user.bio || "",
        skills: user.skills || [],
        avatar: user.avatar || null,
        phone: user.phone || "",
        location: user.location || "",
        department: user.department || "",
        joinDate: user.createdAt,
        role: user.role,
      },
      metrics: performanceMetrics,
      recentActivity: recentActivity,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updateData = {};

    // Safely extract allowed fields
    const allowedFields = [
      "name",
      "email",
      "bio",
      "phone",
      "location",
      "department",
    ];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // Handle skills separately (comes as JSON string)
    if (req.body.skills) {
      try {
        updateData.skills = JSON.parse(req.body.skills);
      } catch (err) {
        updateData.skills = req.body.skills;
      }
    }

    // Handle avatar upload
    if (req.file) {
      updateData.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    // Validate email format if provided
    if (updateData.email && !/\S+@\S+\.\S+/.test(updateData.email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if email is already taken by another user
    if (updateData.email) {
      const existingUser = await User.findOne({
        email: updateData.email,
        _id: { $ne: userId },
      });
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
