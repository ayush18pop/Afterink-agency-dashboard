<<<<<<< HEAD
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "../../utils/axios";
import { FiBarChart, FiArrowRight, FiPlay, FiPause, FiCheck, FiClock, FiTarget, FiTrendingUp, FiCalendar, FiUser, FiLoader, FiArrowRight as FiArrowRight2, FiPlus, FiAlertCircle, FiAward, FiRefreshCw } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
=======
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "../../utils/axios";
>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d

export default function MyTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
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

  // Handle page visibility changes for better timer accuracy
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && activeTask) {
        // Page is hidden, pause the task
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
          <div className="loading-premium mx-auto mb-4"></div>
          <p className="text-gray-600 text-xl">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Tasks</h1>
          <p className="text-gray-600">Manage your assigned projects and track your progress</p>
        </div>

        {/* Active Task Banner */}
        {activeTask && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FiClock className="text-2xl" />
                <div>
                  <h3 className="font-semibold">Currently Working</h3>
                  <p className="text-blue-100">
                    {tasks.find(t => t._id === activeTask)?.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => holdTask(activeTask)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all"
              >
                <FiPause className="inline mr-2" />
                Pause
              </button>
            </div>
          </div>
        )}

        {/* Tasks Grid */}
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <FiTarget className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Tasks Assigned</h3>
            <p className="text-gray-500">You don't have any tasks assigned yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tasks.map((task, index) => {
              const actionState = getActionButtonState(task);
              
              return (
                <div key={task._id} className="card-premium p-6 hover-lift stagger-1" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{task.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                      
                      {/* Status Display */}
                      <div className="flex items-center space-x-4 mb-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                          {getStatusIcon(task.status)}
                          <span className="ml-1">{task.status}</span>
                        </span>
                        <span className="text-xs text-gray-500">
                          {getStatusDescription(task.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Time Tracking Display */}
                  {(task.status === "In Progress" || timeLogs[task._id] > 0) && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4 border border-blue-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FiClock className="text-blue-600" />
                          <span className="text-blue-600 font-semibold">Total Time:</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-600 font-mono">
                          {formatTime(timeLogs[task._id] || 0)}
                        </div>
                      </div>
                      
                      {/* Time Logs Toggle */}
                      <button
                        onClick={() => toggleTimeLogs(task._id)}
                        className="mt-2 text-blue-600 text-sm hover:text-blue-800 flex items-center space-x-1"
                      >
                        <FiBarChart />
                        <span>{showTimeLogs[task._id] ? 'Hide' : 'Show'} Time Logs</span>
                      </button>
                    </div>
                  )}

                  {/* Time Logs Detail */}
                  {showTimeLogs[task._id] && timeLogs[task._id] && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
                      <h4 className="font-semibold text-gray-700 mb-3">Time Logs</h4>
                      {timeLogs[task._id].logs && timeLogs[task._id].logs.length > 0 ? (
                        <div className="space-y-2">
                          {timeLogs[task._id].logs.map((log, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-white rounded border">
                              <div className="flex items-center space-x-2">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                                  {getStatusIcon(log.status)}
                                  <span className="ml-1">{log.status}</span>
                                </span>
                                <span className="text-xs text-gray-600">
                                  {log.startTime ? new Date(log.startTime).toLocaleString() : 'N/A'}
                                </span>
                              </div>
                              <span className="text-xs font-semibold text-gray-800">
                                {log.duration ? formatTime(log.duration) : 'N/A'}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No time logs available</p>
                      )}
                    </div>
                  )}

                  {/* Task Details */}
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 mb-4 border border-gray-100">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <FiCalendar className="text-gray-500" />
                        <span className="text-gray-700">
                          <strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FiAward className="text-gray-500" />
                        <span className="text-gray-700">
                          <strong>Priority:</strong> {task.priority || 'Medium'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startTask(task._id)}
                      disabled={!actionState.canStart}
                      className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                        actionState.canStart
                          ? "btn-premium"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <FiPlay />
                      <span>Start</span>
                    </button>
                    
                    <button
                      onClick={() => holdTask(task._id)}
                      disabled={!actionState.canHold}
                      className={`flex items-center justify-center px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                        actionState.canHold
                          ? "btn-premium-secondary"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <FiPause />
                    </button>
                    
                    <button
                      onClick={() => completeTask(task._id)}
                      disabled={!actionState.canComplete}
                      className={`flex items-center justify-center px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                        actionState.canComplete
                          ? "btn-premium-secondary"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <FiCheck />
                    </button>
                  </div>
                </div>
              );
            })}
=======
  const [changingId, setChangingId] = useState(null);
  const [uptimeMap, setUptimeMap] = useState({});
  const [activeTask, setActiveTask] = useState(null); // Track active task

  // Format the time in "hh:mm:ss"
  const formatUptime = (sec) => {
    const h = Math.floor(sec / 3600).toString().padStart(2, "0");
    const m = Math.floor((sec % 3600) / 60).toString().padStart(2, "0");
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // Update task statuses
  const startTask = async (taskId) => {
    setChangingId(taskId);
    try {
      // Check if any task is already in progress and set it to hold
      const inProgressTask = tasks.find(t => t.memberStatus === "In Progress");
      if (inProgressTask) {
        await axios.post("/api/time/hold", { taskId: inProgressTask._id });  // Put the current task on hold
        setTasks(prev => prev.map(t => t._id === inProgressTask._id ? { ...t, memberStatus: "Hold" } : t));
      }

      // Now, start the new task
      await axios.post("/api/time/start", { taskId });
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, memberStatus: "In Progress" } : t));
      setUptimeMap(prev => ({ ...prev, [taskId]: 0 }));
      setActiveTask(taskId); // Set the active task
    } catch (error) {
      console.error("Error starting task", error);
    } finally {
      setChangingId(null); // Re-enable buttons after task status change
    }
  };

  const holdTask = async (taskId) => {
    setChangingId(taskId);
    try {
      await axios.post("/api/time/hold", { taskId });
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, memberStatus: "Hold" } : t));
      setActiveTask(null); // Reset active task when it's put on hold
    } catch (error) {
      console.error("Error putting task on hold", error);
    } finally {
      setChangingId(null); // Re-enable buttons after task status change
    }
  };

  const completeTask = async (taskId) => {
    setChangingId(taskId);
    try {
      await axios.post("/api/time/complete", { taskId });
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, memberStatus: "Completed" } : t));
      setActiveTask(null); // Reset active task when task is completed
    } catch (error) {
      console.error("Error completing task", error);
    } finally {
      setChangingId(null); // Re-enable buttons after task status change
    }
  };

  // Fetch tasks data
  useEffect(() => {
    axios.get("/api/tasks", { withCredentials: true })
      .then(res => {
        setTasks(res.data);
        const uptimeInit = {};
        res.data.forEach(task => {
          if (task.memberStatus === "In Progress") {
            uptimeInit[task._id] = 0;
            setActiveTask(task._id); // Set active task if one exists
          }
        });
        setUptimeMap(uptimeInit);
      })
      .finally(() => setLoading(false));
  }, []);

  // Update uptime in real-time for active tasks
  useEffect(() => {
    const interval = setInterval(() => {
      setUptimeMap(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(id => updated[id] += 1);
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-gray-400">Loading...</div>;

  return (
    <div className="p-6 text-white bg-gray-950 min-h-screen">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl shadow-lg p-6 mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-300">Welcome back 👋</p>
          <h1 className="text-2xl font-bold">{user?.name || "Freelancer"}</h1>
          <p className="text-sm text-gray-400 capitalize mt-1">{user?.role}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl font-bold text-white">
          {user?.name?.charAt(0).toUpperCase() || "F"}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-6">My Tasks</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <div key={task._id} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
            <h3 className="text-lg text-white font-semibold">{task.title}</h3>
            <p className="text-sm text-gray-400">{task.description}</p>
            <p className="text-sm mt-1 text-yellow-400">Status: {task.memberStatus || "Not Started"}</p>
            {task.memberStatus === "In Progress" && (
              <p className="text-sm text-green-400">Uptime: {formatUptime(uptimeMap[task._id] || 0)}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => startTask(task._id)}
                disabled={task.memberStatus === "In Progress" || changingId === task._id}
                className={`text-sm px-3 py-1 rounded ${task.memberStatus === "In Progress" ? "bg-blue-600 text-white" : "bg-gray-500 text-white"}`}
              >
                In Progress
              </button>
              <button
                onClick={() => holdTask(task._id)}
                disabled={task.memberStatus !== "In Progress" || changingId === task._id}
                className={`text-sm px-3 py-1 rounded ${task.memberStatus === "Hold" ? "bg-yellow-600 text-white" : "bg-yellow-500 text-white"}`}
              >
                Hold
              </button>
              <button
                onClick={() => completeTask(task._id)}
                disabled={task.memberStatus !== "Hold" || changingId === task._id}
                className={`text-sm px-3 py-1 rounded ${task.memberStatus === "Completed" ? "bg-green-600 text-white" : "bg-green-500 text-white"}`}
              >
                Complete
              </button>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="col-span-full text-center text-gray-400 py-10">
            No tasks assigned.
>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d
          </div>
        )}
      </div>
    </div>
  );
}
