const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const {
  createTask,
  updateTaskStatus, // rename for clarity!
  getTasks,
  getMemberNames,
  getTaskNames,
  getAnalysisForTask,
  getAnalysisForUser,
<<<<<<< HEAD
  getMyselfCEOTasks,
  getUserTaskAnalytics,
  getUserTimeAnalytics
} = require('../controllers/taskController');
const Task = require('../models/Task');
=======
  getMyselfCEOTasks
} = require('../controllers/taskController');
>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d

// CEO can create tasks
router.post('/create', auth, role(['ceo']), createTask);

// CEO can update overall status of any task
router.patch('/:id/status', auth, role(['ceo']), updateTaskStatus);

// All users can view (CEO: all, others: only assigned)
router.get('/', auth, getTasks);
router.get('/all-tasks', auth, role(['ceo']), getTaskNames);
router.get('/all-names', auth, role(['ceo']), getMemberNames);
router.get('/analytics/task/:taskId', auth, role(['ceo']), getAnalysisForTask);
router.get('/analytics/user/:userId', auth, role(['ceo']), getAnalysisForUser);
router.get('/analytics/task/:taskId/today',auth, role(['ceo']), getAnalysisForUser);

<<<<<<< HEAD
// User analytics endpoints
router.get('/user-analytics', auth, getUserTaskAnalytics);

router.get('/myselfceotasks', auth, role(['ceo']), getMyselfCEOTasks);  // CEO-specific tasks

// Analytics endpoints
router.get('/analytics', auth, role(['ceo']), async (req, res) => {
  try {
    const tasks = await Task.find();
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
    const holdTasks = tasks.filter(t => t.status === 'Hold').length;
    
    res.json({
      totalTasks,
      completedTasks,
      inProgressTasks,
      holdTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    });
  } catch (error) {
    console.error('Error getting task analytics:', error);
    res.status(500).json({ error: 'Failed to get task analytics' });
  }
});

=======
router.get('/myselfceotasks', auth, role(['ceo']), getMyselfCEOTasks);  // CEO-specific tasks

>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d
module.exports = router;
