const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const {
  startTask,
  holdTask,
  completeTask,
  getUserTimeTable,
  getRawUserTaskTotals,
  getTodayAnalytics,
<<<<<<< HEAD
  getDailyLeaderboard,
  getTaskAccumulatedTime,
  getTaskTimeLogs,
  getUserTimeAnalytics
=======
  getDailyLeaderboard
>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d
} = require('../controllers/timeController');


// Only freelancers and founding_members can start/hold/complete their task work
router.post('/start', auth, role(['freelancer', 'founding_member','ceo']), startTask);
router.post('/hold', auth, role(['freelancer', 'founding_member','ceo']), holdTask);
router.post('/complete', auth, role(['freelancer', 'founding_member','ceo']), completeTask);
router.get('/todaytime', auth, role(['freelancer', 'founding_member','ceo']), getDailyLeaderboard);
<<<<<<< HEAD
router.get('/task/:taskId/accumulated', auth, role(['freelancer', 'founding_member','ceo']), getTaskAccumulatedTime);
router.get('/task/:taskId/logs', auth, role(['freelancer', 'founding_member','ceo']), getTaskTimeLogs);
=======
>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d
// CEO can view analytics for any range/all users
//router.get('/analytics/time-table', auth, role(['ceo']), getUserTimeTable);
router.get('/analytics/raw', auth, role(['ceo']), getRawUserTaskTotals);
router.get('/analytics/today', auth, role(['ceo']), getTodayAnalytics);

<<<<<<< HEAD
// User time analytics
router.get('/user-analytics', auth, getUserTimeAnalytics);

// Analytics endpoint
router.get('/analytics', auth, role(['ceo']), async (req, res) => {
  try {
    const TimeLog = require('../models/TimeLog');
    const timeLogs = await TimeLog.find();
    
    const totalTime = timeLogs.reduce((sum, log) => sum + (log.duration || 0), 0);
    const completedTasks = timeLogs.filter(log => log.status === 'Completed').length;
    
    res.json({
      totalHours: Math.round(totalTime / 3600 * 100) / 100,
      averageHoursPerDay: Math.round((totalTime / 3600 / 7) * 100) / 100,
      mostProductiveDay: 'Wednesday',
      averageTaskTime: completedTasks > 0 ? Math.round((totalTime / 3600 / completedTasks) * 100) / 100 : 0
    });
  } catch (error) {
    console.error('Error getting time analytics:', error);
    res.status(500).json({ error: 'Failed to get time analytics' });
  }
});

=======
>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d
module.exports = router;
