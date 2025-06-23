const User = require("../models/User");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Task = require("../models/Task");
const TimeLog = require("../models/TimeLog");

// Helper: Format duration in seconds to HH:MM:SS
function formatDuration(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

// Helper: Split a log across calendar days if it spans midnight
function splitLogByDay(log) {
  const result = [];
  let { startTime, endTime, duration } = log;
  let current = new Date(startTime);
  const final = new Date(endTime);

  while (current.toDateString() !== final.toDateString()) {
    const midnight = new Date(current);
    midnight.setHours(24, 0, 0, 0);
    const segmentDuration = (midnight - current) / 1000;

    result.push({
      ...log._doc,
      date: current.toISOString().slice(0, 10),
      duration: segmentDuration,
    });

    current = new Date(midnight);
  }

  result.push({
    ...log._doc,
    date: current.toISOString().slice(0, 10),
    duration: (final - current) / 1000,
  });

  return result;
}

// Helper: Format duration for display
function formatDurationDisplay(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const parts = [];
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);
  return { hours, minutes, seconds, formatted: parts.join(' ') };
}

// @route POST /api/tasks/create
// @desc Create a new task (CEO only)
exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, dueDate } = req.body;
    const assignedBy = req.user._id;

    // Validate required fields
    if (!title || !assignedTo || !Array.isArray(assignedTo) || assignedTo.length === 0) {
      return res.status(400).json({ error: "Title and assigned users are required" });
    }

    // Validate that all assigned users exist
    const users = await User.find({ _id: { $in: assignedTo } });
    if (users.length !== assignedTo.length) {
      return res.status(400).json({ error: "One or more assigned users not found" });
    }

    const task = new Task({
      title,
      description,
      assignedTo,
      assignedBy,
      priority: priority || 'Medium',
      dueDate: dueDate || new Date(),
      status: 'Not Started'
    });

    await task.save();

    res.status(201).json({
      message: "Task created successfully",
      task: {
        _id: task._id,
        title: task.title,
        description: task.description,
        assignedTo: task.assignedTo,
        priority: task.priority,
        dueDate: task.dueDate,
        status: task.status
      }
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
};

// @route PATCH /api/tasks/:id/status
// @desc Update task status (CEO only)
exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Not Started', 'In Progress', 'Hold', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const task = await Task.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({
      message: "Task status updated successfully",
      task: {
        _id: task._id,
        title: task.title,
        status: task.status
      }
    });
  } catch (error) {
    console.error("Update task status error:", error);
    res.status(500).json({ error: "Failed to update task status" });
  }
};

// @route GET /api/tasks
// @desc Get tasks (all users can view, but see different sets)
exports.getTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    let tasks;
    if (userRole === 'ceo') {
      // CEO sees all tasks
      tasks = await Task.find()
        .populate('assignedTo', 'name email role')
        .populate('assignedBy', 'name')
        .sort({ createdAt: -1 });
    } else {
      // Other users see only their assigned tasks
      tasks = await Task.find({ assignedTo: userId })
        .populate('assignedTo', 'name email role')
        .populate('assignedBy', 'name')
        .sort({ createdAt: -1 });
    }

    res.json({ tasks });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ error: "Failed to get tasks" });
  }
};

// @route GET /api/tasks/all-tasks
// @desc Get all task names (CEO only)
exports.getTaskNames = async (req, res) => {
  try {
    const tasks = await Task.find({}, '_id title');
    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @route GET /api/tasks/all-names
// @desc Get all member names (CEO only)
exports.getMemberNames = async (req, res) => {
  console.log("Fetching member names");
  try {
    const members = await User.find({ role: { $in: ['freelancer', 'founding_member','ceo'] } }, '_id name email role');
    res.json({ members });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @route GET /api/tasks/analytics/task/:taskId
// @desc Get analysis for a specific task (CEO only)
exports.getAnalysisForTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const logs = await TimeLog.find({ task: taskId })
      .populate('user', 'name email role');
    
    const result = {};
    logs.forEach(log => {
      const uid = log.user._id.toString();
      if (!result[uid]) {
        result[uid] = {
          name: log.user.name,
          email: log.user.email,
          role: log.user.role,
          totalSeconds: 0,
          sessions: 0
        };
      }
      result[uid].totalSeconds += log.duration || 0;
      result[uid].sessions += 1;
    });

    // Format the results
    Object.values(result).forEach(user => {
      user.formatted = formatDuration(user.totalSeconds);
    });

    res.json({ data: Object.values(result) });
  } catch (error) {
    console.error("Get task analysis error:", error);
    res.status(500).json({ error: "Failed to get task analysis" });
  }
};

// @route GET /api/tasks/analytics/user/:userId
// @desc Get analysis for a specific user (CEO only)
exports.getAnalysisForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const today = new Date().toISOString().slice(0, 10);
    console.log("📅 Today:", today);

    const tasks = await Task.find({ assignedTo: new ObjectId(userId) });
    console.log("🧩 Tasks assigned to user:", tasks.length);

    const allLogs = await TimeLog.find({
      user: new ObjectId(userId),
      duration: { $gt: 0 },
      startTime: { $ne: null },
      endTime: { $ne: null },
    });

    console.log("📜 Logs found:", allLogs.length);
    let splitLogs = [];
    allLogs.forEach((log) => {
      splitLogs.push(...splitLogByDay(log));
    });

    const result = [];
    for (const task of tasks) {
      let totalDuration = 0;
      let todayDuration = 0;

      for (const log of splitLogs) {
        if (log.task.toString() === task._id.toString()) {
          totalDuration += log.duration;
          if (log.date === today) todayDuration += log.duration;
        }
      }

      result.push({
        taskId: task._id,
        title: task.title,
        todayDuration: Math.round(todayDuration),
        totalDuration: Math.round(totalDuration),
      });
    }

    console.log("✅ Final Result:", result);
    res.json({ data: result });
  } catch (err) {
    console.error("❌ getAnalysisForUser error:", err);
    res.status(500).json({ error: "Failed to generate user task breakdown" });
  }
};

// @route GET /api/tasks/myselfceotasks
// @desc Get CEO's own tasks
exports.getMyselfCEOTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const tasks = await Task.find({ assignedTo: userId })
      .populate('assignedTo', 'name email role')
      .populate('assignedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({ tasks });
  } catch (error) {
    console.error("Get CEO tasks error:", error);
    res.status(500).json({ error: "Failed to get CEO tasks" });
  }
};

// @route GET /api/tasks/user-analytics
// @desc Get user's task analytics
exports.getUserTaskAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    const tasks = await Task.find({ assignedTo: userId });
    const logs = await TimeLog.find({ user: userId });

    // Calculate analytics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'Completed').length;
    const inProgressTasks = tasks.filter(task => task.status === 'In Progress').length;
    const holdTasks = tasks.filter(task => task.status === 'Hold').length;
    const totalTime = logs.reduce((sum, log) => sum + (log.duration || 0), 0);

    // Calculate weekly data
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const weeklyLogs = logs.filter(log => new Date(log.startTime) >= weekStart);
    const weeklyTime = weeklyLogs.reduce((sum, log) => sum + (log.duration || 0), 0);

    const analytics = {
      totalTasks,
      completedTasks,
      inProgressTasks,
      holdTasks,
      totalTime,
      weeklyTime,
      efficiency: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      averageTimePerTask: totalTasks > 0 ? Math.round(totalTime / totalTasks) : 0,
      formatted: {
        totalTime: formatDurationDisplay(totalTime).formatted,
        weeklyTime: formatDurationDisplay(weeklyTime).formatted
      }
    };

    res.json(analytics);
  } catch (error) {
    console.error("Get user task analytics error:", error);
    res.status(500).json({ error: "Failed to get user task analytics" });
  }
};

// @route GET /api/tasks/user-time-analytics
// @desc Get user's time analytics for tasks
exports.getUserTimeAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    const logs = await TimeLog.find({ user: userId });
    const tasks = await Task.find({ assignedTo: userId });

    // Calculate analytics
    const totalTime = logs.reduce((sum, log) => sum + (log.duration || 0), 0);
    const completedTasks = tasks.filter(task => task.status === 'Completed').length;
    const totalTasks = tasks.length;

    // Calculate weekly data
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const weeklyLogs = logs.filter(log => new Date(log.startTime) >= weekStart);
    const weeklyTime = weeklyLogs.reduce((sum, log) => sum + (log.duration || 0), 0);

    // Calculate daily data
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayLogs = logs.filter(log => new Date(log.startTime) >= today);
    const todayTime = todayLogs.reduce((sum, log) => sum + (log.duration || 0), 0);

    const analytics = {
      totalTime,
      weeklyTime,
      todayTime,
      totalTasks,
      completedTasks,
      efficiency: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      averageTimePerTask: totalTasks > 0 ? Math.round(totalTime / totalTasks) : 0,
      formatted: {
        totalTime: formatDurationDisplay(totalTime).formatted,
        weeklyTime: formatDurationDisplay(weeklyTime).formatted,
        todayTime: formatDurationDisplay(todayTime).formatted
      }
    };

    res.json(analytics);
  } catch (error) {
    console.error("Get user time analytics error:", error);
    res.status(500).json({ error: "Failed to get user time analytics" });
  }
};
