const TimeLog = require('../models/TimeLog');
const User = require('../models/User');
const Task = require('../models/Task');

// Helper for formatting
function formatDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  let parts = [];
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds} second${seconds > 1 ? 's' : ''}`);
  return {
    hours, minutes, seconds,
    formatted: parts.join(', ')
  };
}

exports.getDailyLeaderboard = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();

    const logs = await TimeLog.aggregate([
      {
        $match: {
          endTime: { $gte: todayStart, $lte: todayEnd },
          duration: { $gt: 0 }
        }
      },
      {
        $group: {
          _id: "$user",
          totalTime: { $sum: "$duration" }
        }
      },
      {
        $sort: { totalTime: -1 }
      }
    ]);

    res.status(200).json({ leaderboard: logs });
  } catch (error) {
    res.status(500).json({ error: "Failed to get leaderboard" });
  }
};

exports.getTodayAnalytics = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['freelancer', 'founding_member'] } })
      .select('_id name email role');

    // Set today's range (midnight to now)
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    // Find all logs relevant for today
    const logs = await TimeLog.find({
      $or: [
        // Ended today (for Hold/Completed logs)
        { status: { $in: ['Hold', 'Completed'] }, endTime: { $gte: todayStart, $lte: now } },
        // Still running and started today or earlier
        { status: 'In Progress', startTime: { $lte: now } }
      ]
    })
      .populate('userId', 'name email role')
      .populate('taskId', 'title');

    // Group results
    const summary = {};
    users.forEach(user => {
      summary[user._id.toString()] = {
        user: user.name,
        email: user.email,
        role: user.role,
        totalSeconds: 0,
        totalTime: '0 second',
        perTask: {}
      };
    });

    logs.forEach(log => {
      if (!log.userId || !log.taskId) return;
      const uid = log.userId._id.toString();
      const tname = log.taskId.title;
      if (!summary[uid]) return;

      if (!summary[uid].perTask[tname]) {
        summary[uid].perTask[tname] = {
          seconds: 0,
          time: '0 seconds'
        };
      }
      let duration = 0;

      if ((log.status === 'Hold' || log.status === 'Completed') && log.endTime >= todayStart) {
        // Only add today's portion for logs that spanned midnight
        const actualStart = log.startTime >= todayStart ? log.startTime : todayStart;
        duration = Math.floor((log.endTime - new Date(actualStart)) / 1000);
      } else if (log.status === 'In Progress' && log.startTime <= now) {
        // In progress: from today's midnight or startTime (whichever is later) to now
        const sessionStart = log.startTime >= todayStart ? log.startTime : todayStart;
        duration = Math.floor((now - new Date(sessionStart)) / 1000);
      }
      if (duration < 0) duration = 0;

      summary[uid].perTask[tname].seconds += duration;
      summary[uid].perTask[tname].time = formatDuration(summary[uid].perTask[tname].seconds).formatted;
      summary[uid].totalSeconds += duration;
    });

    Object.values(summary).forEach(user => {
      user.totalTime = formatDuration(user.totalSeconds).formatted;
    });

    res.json({
      date: now.toISOString().slice(0, 10),
      data: Object.values(summary)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRawUserTaskTotals = async (req, res) => {
  try {
    // Include role in select!
    const users = await User.find({ role: { $in: ['freelancer', 'founding_member'] } })
      .select('_id name email role');

    const checkedTime = req.query.checkedTime ? new Date(req.query.checkedTime) : new Date();

    const logs = await TimeLog.find({
      status: { $in: ['In Progress', 'Hold', 'Completed'] }
    })
      .populate('userId', 'name email role')
      .populate('taskId', 'title');

    const summary = {};
    users.forEach(user => {
      summary[user._id.toString()] = {
        user: user.name,
        email: user.email,
        role: user.role,    // <-- This will now be defined!
        totalSeconds: 0,
        totalTime: '0 second',
        perTask: {}
      };
    });

    logs.forEach(log => {
      if (!log.userId || !log.taskId) return;
      const uid = log.userId._id.toString();
      const tname = log.taskId.title;
      if (!summary[uid]) return;

      if (!summary[uid].perTask[tname]) {
        summary[uid].perTask[tname] = {
          seconds: 0,
          time: '0 seconds',
          // role: summary[uid].role, // You can add this if you want role in each perTask as well
        };
      }
      let duration = log.duration || 0;
      // If it's "In Progress", add extra time up to checkedTime (not yet on hold or completed)
      if (log.status === 'In Progress' && log.startTime) {
        const endPoint = checkedTime > log.startTime ? checkedTime : new Date(log.startTime);
        duration += Math.floor((endPoint - new Date(log.startTime)) / 1000);
      }
      summary[uid].perTask[tname].seconds += duration;
      summary[uid].perTask[tname].time = formatDuration(summary[uid].perTask[tname].seconds).formatted;
      summary[uid].totalSeconds += duration;
    });

    // Add formatted total time for each user
    Object.values(summary).forEach(user => {
      user.totalTime = formatDuration(user.totalSeconds).formatted;
    });

    res.json({ checkedTime, data: Object.values(summary) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @route POST /api/time/start
// @desc Start working on a task
exports.startTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const { taskId } = req.body;

    // Validate task exists and user is assigned
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (!task.assignedTo.includes(userId)) {
      return res.status(403).json({ error: "You are not assigned to this task" });
    }

    // Check if user has any active task and pause it
    const currentActiveLog = await TimeLog.findOne({ 
      user: userId, 
      status: 'In Progress' 
    }).sort({ startTime: -1 });

    if (currentActiveLog) {
      // Pause current task
      currentActiveLog.status = 'Hold';
      currentActiveLog.endTime = new Date();
      currentActiveLog.duration = Math.floor((currentActiveLog.endTime - currentActiveLog.startTime) / 1000);
      await currentActiveLog.save();
    }

    // Check if there's already a log for this task-user combination
    let existingLog = await TimeLog.findOne({ 
      user: userId, 
      task: taskId 
    }).sort({ startTime: -1 });

    if (existingLog && existingLog.status === 'In Progress') {
      return res.status(400).json({ error: "Task is already in progress" });
    }

    // Create new time log entry
    const newLog = new TimeLog({
      user: userId,
      task: taskId,
      startTime: new Date(),
      status: 'In Progress'
    });

    await newLog.save();

    res.status(200).json({ 
      message: "Task started successfully",
      logId: newLog._id 
    });
  } catch (error) {
    console.error("Start task error:", error);
    res.status(500).json({ error: "Failed to start task" });
  }
};

// @route POST /api/time/hold
// @desc Pause working on a task
exports.holdTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const { taskId } = req.body;

    // Find the active log for this user and task
    const activeLog = await TimeLog.findOne({
      user: userId,
      task: taskId,
      status: 'In Progress'
    });

    if (!activeLog) {
      return res.status(404).json({ error: "No active task found" });
    }

    // Update the log
    activeLog.status = 'Hold';
    activeLog.endTime = new Date();
    activeLog.duration = Math.floor((activeLog.endTime - activeLog.startTime) / 1000);

    await activeLog.save();

    res.status(200).json({ 
      message: "Task paused successfully",
      duration: activeLog.duration
    });
  } catch (error) {
    console.error("Hold task error:", error);
    res.status(500).json({ error: "Failed to pause task" });
  }
};

// @route POST /api/time/complete
// @desc Complete working on a task
exports.completeTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const { taskId } = req.body;

    // Find the active log for this user and task
    const activeLog = await TimeLog.findOne({
      user: userId,
      task: taskId,
      status: 'In Progress'
    });

    if (!activeLog) {
      return res.status(404).json({ error: "No active task found" });
    }

    // Update the log
    activeLog.status = 'Completed';
    activeLog.endTime = new Date();
    activeLog.duration = Math.floor((activeLog.endTime - activeLog.startTime) / 1000);

    await activeLog.save();

    res.status(200).json({ 
      message: "Task completed successfully",
      duration: activeLog.duration
    });
  } catch (error) {
    console.error("Complete task error:", error);
    res.status(500).json({ error: "Failed to complete task" });
  }
};

// @route GET /api/time/task/:taskId/accumulated
// @desc Get accumulated time for a specific task
exports.getTaskAccumulatedTime = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user._id;

    const logs = await TimeLog.find({
      user: userId,
      task: taskId,
      status: { $in: ['Hold', 'Completed'] }
    });

    const totalSeconds = logs.reduce((sum, log) => sum + (log.duration || 0), 0);

    res.json({
      taskId,
      totalSeconds,
      formatted: formatDuration(totalSeconds).formatted,
      sessions: logs.length
    });
  } catch (error) {
    console.error("Get task accumulated time error:", error);
    res.status(500).json({ error: "Failed to get task time" });
  }
};

// @route GET /api/time/task/:taskId/logs
// @desc Get all time logs for a specific task
exports.getTaskTimeLogs = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user._id;

    const logs = await TimeLog.find({
      user: userId,
      task: taskId
    }).sort({ startTime: -1 });

    const formattedLogs = logs.map(log => ({
      ...log.toObject(),
      formattedDuration: log.duration ? formatDuration(log.duration).formatted : '0 seconds'
    }));

    res.json({ logs: formattedLogs });
  } catch (error) {
    console.error("Get task logs error:", error);
    res.status(500).json({ error: "Failed to get task logs" });
  }
};

// @route GET /api/time/user-analytics
// @desc Get user's time analytics
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
        totalTime: formatDuration(totalTime).formatted,
        weeklyTime: formatDuration(weeklyTime).formatted,
        todayTime: formatDuration(todayTime).formatted
      }
    };

    res.json(analytics);
  } catch (error) {
    console.error("Get user time analytics error:", error);
    res.status(500).json({ error: "Failed to get user analytics" });
  }
}; 