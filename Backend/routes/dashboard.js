const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const {
  getDailyLeaderboard,
  getWeeklyLeaderboard,
  getMonthlyLeaderboard,
  getTopPerformer,
  getTaskWiseUserOverview,
<<<<<<< HEAD
  getTodayAnalytics,
  getWeeklyAnalytics,
=======
>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d
} = require('../controllers/dashboardController');
//const { getTasksOverview } = require('../controllers/taskoverview');
// Only CEO can access these analytics
router.get('/leaderboard/daily', auth, role(['ceo']), getDailyLeaderboard);
router.get('/leaderboard/weekly', auth, role(['ceo']), getWeeklyLeaderboard);
router.get('/leaderboard/monthly', auth, role(['ceo']), getMonthlyLeaderboard);
router.get('/leaderboard/top-performer', auth, getTopPerformer); // public (optional)
router.get('/overview', auth, role(['ceo', 'founding_member']), getTaskWiseUserOverview);
<<<<<<< HEAD
router.get('/analytics/today', auth, role(['ceo']), getTodayAnalytics);
router.get('/analytics/weekly', auth, role(['ceo']), getWeeklyAnalytics);
=======
>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d
//router.get('/overview',auth, role(['ceo','founding_member']),getTasksOverview )
module.exports = router;
