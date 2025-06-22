const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const {
  addUser,
  getUserProfile,
  updateUserProfile,
  getUserAnalytics,
  getUserPerformance,
  getAllUsers,
  getUsers,
  updateProfile,
} = require("../controllers/userController");

router.post("/add", auth, role("ceo"), addUser);

// Get all users (CEO only)
router.get("/", auth, role("ceo"), getAllUsers);

// Profile routes
router.get("/profile", auth, getUserProfile);
router.put("/profile", auth, updateUserProfile);

// Analytics routes
router.get("/analytics", auth, getUserAnalytics);
router.get("/performance", auth, getUserPerformance);

// Get top performers
router.get('/top-performers', auth, role(['ceo']), async (req, res) => {
  try {
    const User = require('../models/User');
    const Task = require('../models/Task');
    const TimeLog = require('../models/TimeLog');

    const users = await User.find({ role: { $in: ['founding_member', 'freelancer'] } });
    const tasks = await Task.find();
    const timeLogs = await TimeLog.find();

    const performers = users.map(user => {
      const userTasks = tasks.filter(task => 
        task.assignedTo && 
        (Array.isArray(task.assignedTo) ? 
          task.assignedTo.includes(user._id) : 
          task.assignedTo === user._id)
      );
      const userTimeLogs = timeLogs.filter(log => log.user === user._id);
      
      const completedTasks = userTasks.filter(task => task.status === 'Completed');
      const totalTimeSpent = userTimeLogs.reduce((sum, log) => sum + (log.duration || 0), 0);
      const efficiency = userTasks.length > 0 ? Math.round((completedTasks.length / userTasks.length) * 100) : 0;
      
      return {
        name: user.name,
        role: user.role,
        tasksCompleted: completedTasks.length,
        totalTime: Math.round(totalTimeSpent / 3600 * 100) / 100,
        efficiency: efficiency,
        totalTasks: userTasks.length
      };
    });

    const sortedPerformers = performers
      .sort((a, b) => (b.efficiency * 0.7 + b.tasksCompleted * 0.3) - (a.efficiency * 0.7 + a.tasksCompleted * 0.3))
      .slice(0, 5);

    res.json({ performers: sortedPerformers });
  } catch (error) {
    console.error('Error getting top performers:', error);
    res.status(500).json({ error: 'Failed to get top performers' });
  }
});

module.exports = router;
