const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Helper function to generate random avatar using UI-Avatars service
const generateRandomAvatar = (seed) => {
  try {
    // Use the user's name if available, otherwise use email
    const name = seed.includes("@") ? seed.split("@")[0] : seed;

    // Generate random colors
    const colors = [
      "3B82F6",
      "8B5CF6",
      "EF4444",
      "10B981",
      "F59E0B",
      "EC4899",
      "6366F1",
      "14B8A6",
    ];
    const backgrounds = [
      "F1F5F9",
      "F8FAFC",
      "EDE9FE",
      "FEF2F2",
      "ECFDF5",
      "FFFBEB",
      "FCE7F3",
      "EEF2FF",
    ];

    const randomColor = colors[Math.abs(hashCode(seed)) % colors.length];
    const randomBg =
      backgrounds[Math.abs(hashCode(seed + "bg")) % backgrounds.length];

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&size=128&background=${randomBg}&color=${randomColor}&bold=true&format=png`;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error generating avatar:", error);
    }
    // Fallback
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      seed
    )}&size=128&background=random`;
  }
};

// Simple hash function for consistent random generation
const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash;
};

exports.addUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const currentUser = req.user; // Comes from auth middleware

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

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

    // Generate random avatar for new user
    const avatar = generateRandomAvatar(email);

    const newUser = await User.create({
      name,
      email,
      password: hashed,
      role,
      avatar,
    });

    res.status(201).json({ message: `${role} created`, userId: newUser._id });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Add user error:", err);
    }
    res.status(500).json({ error: "Failed to create user" });
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

    // Generate avatar if user doesn't have one
    let avatar = user.avatar;
    if (!avatar) {
      avatar = generateRandomAvatar(user.email);
      // Update user with generated avatar
      await User.findByIdAndUpdate(userId, { avatar });
    }

    const profileResponse = {
      profile: {
        name: user.name,
        email: user.email,
        bio: user.bio || "",
        skills: user.skills || [],
        avatar: avatar,
        phone: user.phone || "",
        location: user.location || "",
        department: user.department || "",
        joinDate: user.createdAt,
        role: user.role,
      },
    };

    res.json(profileResponse);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Get user profile error:", err);
    }
    res.status(500).json({ error: "Failed to get user profile" });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updateData = {};

    // Safely extract allowed fields (excluding avatar)
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

    // Handle skills separately (can be array or JSON string)
    if (req.body.skills) {
      if (typeof req.body.skills === "string") {
        try {
          updateData.skills = JSON.parse(req.body.skills);
        } catch (err) {
          updateData.skills = req.body.skills;
        }
      } else {
        updateData.skills = req.body.skills;
      }
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
        return res.status(400).json({ error: "Email already taken" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        skills: updatedUser.skills,
        phone: updatedUser.phone,
        location: updatedUser.location,
        department: updatedUser.department,
        role: updatedUser.role,
      },
    });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Update user profile error:", err);
    }
    res.status(500).json({ error: "Failed to update profile" });
  }
};

// Add missing analytics functions
exports.getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const TimeLog = require("../models/TimeLog");
    const Task = require("../models/Task");

    // Get user's tasks
    const tasks = await Task.find({ assignedTo: userId });
    
    // Get user's time logs
    const logs = await TimeLog.find({ user: userId });

    // Calculate analytics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'Completed').length;
    const totalTime = logs.reduce((sum, log) => sum + (log.duration || 0), 0);
    
    // Calculate weekly data
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const weeklyLogs = logs.filter(log => new Date(log.startTime) >= weekStart);
    const weeklyTime = weeklyLogs.reduce((sum, log) => sum + (log.duration || 0), 0);

    const analytics = {
      totalTasks,
      completedTasks,
      totalTime,
      weeklyTime,
      efficiency: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      averageTimePerTask: totalTasks > 0 ? Math.round(totalTime / totalTasks) : 0
    };

    res.json(analytics);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error getting user analytics:", error);
    }
    res.status(500).json({ error: "Failed to get user analytics" });
  }
};

exports.getUserPerformance = async (req, res) => {
  try {
    const userId = req.user._id;
    const TimeLog = require("../models/TimeLog");
    const Task = require("../models/Task");

    // Get user's performance data
    const tasks = await Task.find({ assignedTo: userId });
    const logs = await TimeLog.find({ user: userId });

    // Calculate performance metrics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'Completed').length;
    const totalTime = logs.reduce((sum, log) => sum + (log.duration || 0), 0);
    
    // Calculate daily averages
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayLogs = logs.filter(log => new Date(log.startTime) >= today);
    const todayTime = todayLogs.reduce((sum, log) => sum + (log.duration || 0), 0);

    const performance = {
      totalTasks,
      completedTasks,
      totalTime,
      todayTime,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      averageTimePerTask: totalTasks > 0 ? Math.round(totalTime / totalTasks) : 0,
      productivity: totalTime > 0 ? Math.round((completedTasks / totalTime) * 3600) : 0 // tasks per hour
    };

    res.json(performance);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error getting user performance:", error);
    }
    res.status(500).json({ error: "Failed to get user performance" });
  }
};

// Add missing getAllUsers function
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password').select('_id name email role avatar createdAt');
    
    // Add status based on recent activity (you can customize this logic)
    const usersWithStatus = users.map(user => ({
      ...user.toObject(),
      status: 'active' // You can implement more sophisticated status logic here
    }));

    res.json(usersWithStatus);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error getting all users:", error);
    }
    res.status(500).json({ error: "Failed to get users" });
  }
};
