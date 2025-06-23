import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "../../utils/axios";
import { FiBarChart, FiArrowRight, FiPlay, FiPause, FiCheck, FiClock, FiTarget, FiTrendingUp, FiCalendar, FiUser, FiLoader, FiArrowRight as FiArrowRight2, FiPlus, FiAlertCircle, FiAward, FiRefreshCw } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

export default function MyTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState(null);
  const [timeLogs, setTimeLogs] = useState({});
  const [taskTimers, setTaskTimers] = useState({});
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTimeLogs, setShowTimeLogs] = useState({});
  const intervalRef = useRef(null);
  const { theme } = useTheme();

  // Format time with better precision
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Get accumulated time for a task from backend
  const getTaskAccumulatedTime = async (taskId) => {
    try {
      const response = await axios.get(`/api/time/task/${taskId}/accumulated`);
      return response.data.totalSeconds || 0;
    } catch (error) {
      console.error("Error fetching accumulated time:", error);
      return 0;
    }
  };

  // Get detailed time logs for a task
  const getTaskTimeLogs = async (taskId) => {
    try {
      const response = await axios.get(`/api/time/task/${taskId}/logs`);
      return response.data;
    } catch (error) {
      console.error("Error fetching time logs:", error);
      return { logs: [], totalSeconds: 0 };
    }
  };

  // Start task with proper time tracking
  const startTask = async (taskId) => {
    try {
      const response = await axios.post(`/api/time/start`, { taskId });
      setActiveTask(taskId);
      fetchTasks();
      
      // Show success message
      alert(`Task started successfully! Status: ${response.data.taskStatus}`);
    } catch (error) {
      console.error('Error starting task:', error);
      alert(error.response?.data?.error || 'Error starting task');
    }
  };

  // Hold task
  const holdTask = async (taskId) => {
    try {
      const response = await axios.post(`/api/time/hold`, { taskId });
      setActiveTask(null);
      fetchTasks();
      
      // Show success message
      alert(`Task put on hold! Status: ${response.data.taskStatus}`);
    } catch (error) {
      console.error('Error pausing task:', error);
      alert(error.response?.data?.error || 'Error pausing task');
    }
  };

  // Complete task
  const completeTask = async (taskId) => {
    try {
      const response = await axios.post(`/api/time/complete`, { taskId });
      if (activeTask === taskId) {
        setActiveTask(null);
      }
      fetchTasks();
      
      // Show success message
      alert(`Task completed successfully! Status: ${response.data.taskStatus}`);
    } catch (error) {
      console.error('Error completing task:', error);
      alert(error.response?.data?.error || 'Error completing task');
    }
  };

  // Toggle time logs display
  const toggleTimeLogs = async (taskId) => {
    if (!showTimeLogs[taskId]) {
      const timeLogData = await getTaskTimeLogs(taskId);
      setTimeLogs(prev => ({
        ...prev,
        [taskId]: timeLogData
      }));
    }
    setShowTimeLogs(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'status-completed';
      case 'In Progress': return 'status-active';
      case 'Hold': return 'status-pending';
      case 'Not Started': return 'status-pending';
      default: return 'status-pending';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <FiCheck className="text-green-600" />;
      case 'In Progress': return <FiClock className="text-blue-600" />;
      case 'Hold': return <FiPause className="text-yellow-600" />;
      case 'Not Started': return <FiTarget className="text-gray-600" />;
      default: return <FiTarget className="text-gray-600" />;
    }
  };

  // Get status description
  const getStatusDescription = (status) => {
    switch (status) {
      case 'Completed': return 'Task has been finished successfully';
      case 'In Progress': return 'Currently working on this task';
      case 'Hold': return 'Task is temporarily paused';
      case 'Not Started': return 'Task is ready to begin';
      default: return 'Task status unknown';
    }
  };

  // Get action button state
  const getActionButtonState = (task) => {
    const isActive = activeTask === task._id;
    const isInProgress = task.status === 'In Progress';
    const isCompleted = task.status === 'Completed';
    const isOnHold = task.status === 'Hold';
    const isNotStarted = task.status === 'Not Started';

    return {
      canStart: !isActive && !isInProgress && !isCompleted,
      canHold: isActive || isInProgress,
      canComplete: !isCompleted && (isOnHold || isInProgress || isNotStarted),
      isActive
    };
  };

  // Fetch tasks and initialize timers
  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks');
      const userTasks = response.data.filter(task => task.assignedTo === user._id);
      setTasks(userTasks);
      
      // Fetch time logs for each task
      const logsPromises = userTasks.map(task => 
        axios.get(`/api/time/task/${task._id}/accumulated`).catch(() => ({ data: { totalSeconds: 0 } }))
      );
      const logsResponses = await Promise.all(logsPromises);
      const logsData = {};
      userTasks.forEach((task, index) => {
        logsData[task._id] = logsResponses[index].data.totalSeconds || 0;
      });
      setTimeLogs(logsData);

      // Check for active tasks
      const activeTaskLog = userTasks.find(task => task.status === 'In Progress');
      if (activeTaskLog) {
        setActiveTask(activeTaskLog._id);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle visibility change to pause timer when tab is not active
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && activeTask) {
        // Tab is hidden, pause the active task
        holdTask(activeTask);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [activeTask]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="text-4xl text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-xl">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="glass-card rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                <FiTarget />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-1">My Tasks</h1>
                <p className="text-gray-600">Manage and track your assigned tasks</p>
                <div className="flex items-center mt-2 text-blue-600">
                  <FiClock className="mr-2" />
                  <span className="text-sm">Time tracking enabled</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-800">
                {tasks.length}
              </div>
              <p className="text-gray-600 text-sm">Total Tasks</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card-premium p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-semibold">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-800">{tasks.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FiTarget className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="card-premium p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-semibold">Completed</p>
                <p className="text-3xl font-bold text-gray-800">
                  {tasks.filter(t => t.status === 'Completed').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FiCheck className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="card-premium p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-semibold">In Progress</p>
                <p className="text-3xl font-bold text-gray-800">
                  {tasks.filter(t => t.status === 'In Progress').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FiClock className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="card-premium p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-semibold">On Hold</p>
                <p className="text-3xl font-bold text-gray-800">
                  {tasks.filter(t => t.status === 'Hold').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <FiPause className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="card-premium p-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FiBarChart className="mr-2 text-blue-600" />
            Task Overview
          </h2>
          
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <FiTarget className="text-gray-400 text-6xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No tasks assigned</h3>
              <p className="text-gray-500">You don't have any tasks assigned to you yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task, index) => {
                const buttonState = getActionButtonState(task);
                const accumulatedTime = timeLogs[task._id] || 0;
                
                return (
                  <div
                    key={task._id}
                    className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {getStatusIcon(task.status)}
                            <span className="ml-1">{task.status}</span>
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <FiCalendar className="text-gray-400" />
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FiClock className="text-gray-400" />
                            <span>Time: {formatTime(accumulatedTime)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {buttonState.canStart && (
                          <button
                            onClick={() => startTask(task._id)}
                            className="btn-premium-secondary flex items-center space-x-2"
                          >
                            <FiPlay />
                            <span>Start</span>
                          </button>
                        )}
                        
                        {buttonState.canHold && (
                          <button
                            onClick={() => holdTask(task._id)}
                            className="btn-premium-secondary flex items-center space-x-2"
                          >
                            <FiPause />
                            <span>Hold</span>
                          </button>
                        )}
                        
                        {buttonState.canComplete && (
                          <button
                            onClick={() => completeTask(task._id)}
                            className="btn-premium flex items-center space-x-2"
                          >
                            <FiCheck />
                            <span>Complete</span>
                          </button>
                        )}
                        
                        <button
                          onClick={() => toggleTimeLogs(task._id)}
                          className="btn-premium-secondary"
                        >
                          <FiBarChart />
                        </button>
                      </div>
                    </div>
                    
                    {/* Time Logs Section */}
                    {showTimeLogs[task._id] && timeLogs[task._id] && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Time Logs</h4>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-600">
                            Total time spent: <span className="font-semibold text-blue-600">{formatTime(accumulatedTime)}</span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
