import React, { useState, useEffect } from 'react';
import { FiX, FiUser, FiCalendar, FiClock, FiTarget, FiAward, FiCheck, FiPause, FiPlay, FiAlertCircle, FiBarChart, FiRefreshCw, FiArrowRight } from 'react-icons/fi';
import axios from '../utils/axios';

export default function TaskDetailsModal({ task, isOpen, onClose, onTaskUpdate }) {
  const [timeLogs, setTimeLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [uptime, setUptime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [showTimeLogs, setShowTimeLogs] = useState(false);

  useEffect(() => {
    if (task && isOpen) {
      fetchTaskDetails();
    }
  }, [task, isOpen]);

  useEffect(() => {
    let interval;
    if (activeTask === task?._id) {
      interval = setInterval(() => {
        setUptime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTask, task?._id]);

  const fetchTaskDetails = async () => {
    try {
      const [logsResponse, accumulatedResponse] = await Promise.all([
        axios.get(`/api/time/task/${task._id}/logs`),
        axios.get(`/api/time/task/${task._id}/accumulated`)
      ]);
      
      setTimeLogs(logsResponse.data.logs || []);
      setTotalTime(accumulatedResponse.data.totalSeconds || 0);
      
      // Check if task is currently active
      const activeLog = logsResponse.data.logs?.find(log => log.status === 'In Progress');
      if (activeLog) {
        setActiveTask(task._id);
        const startTime = new Date(activeLog.startTime);
        const now = new Date();
        setUptime(Math.floor((now - startTime) / 1000));
      } else {
        setActiveTask(null);
        setUptime(0);
      }
    } catch (error) {
      console.error('Error fetching task details:', error);
    }
  };

  const startTask = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`/api/time/start`, { taskId: task._id });
      setActiveTask(task._id);
      setUptime(0);
      fetchTaskDetails();
      if (onTaskUpdate) onTaskUpdate();
      
      // Show success message
      alert(`Task started successfully! Status: ${response.data.taskStatus}`);
    } catch (error) {
      console.error('Error starting task:', error);
      alert(error.response?.data?.error || 'Error starting task');
    } finally {
      setLoading(false);
    }
  };

  const pauseTask = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`/api/time/hold`, { taskId: task._id });
      setActiveTask(null);
      setUptime(0);
      fetchTaskDetails();
      if (onTaskUpdate) onTaskUpdate();
      
      // Show success message
      alert(`Task put on hold! Status: ${response.data.taskStatus}`);
    } catch (error) {
      console.error('Error pausing task:', error);
      alert(error.response?.data?.error || 'Error pausing task');
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`/api/time/complete`, { taskId: task._id });
      setActiveTask(null);
      setUptime(0);
      fetchTaskDetails();
      if (onTaskUpdate) onTaskUpdate();
      
      // Show success message
      alert(`Task completed successfully! Status: ${response.data.taskStatus}`);
    } catch (error) {
      console.error('Error completing task:', error);
      alert(error.response?.data?.error || 'Error completing task');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'status-completed';
      case 'In Progress': return 'status-active';
      case 'Hold': return 'status-pending';
      case 'Not Started': return 'status-pending';
      default: return 'status-pending';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <FiCheck className="text-green-600" />;
      case 'In Progress': return <FiClock className="text-blue-600" />;
      case 'Hold': return <FiPause className="text-yellow-600" />;
      case 'Not Started': return <FiTarget className="text-gray-600" />;
      default: return <FiTarget className="text-gray-600" />;
    }
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case 'Completed': return 'Task has been finished successfully';
      case 'In Progress': return 'Currently working on this task';
      case 'Hold': return 'Task is temporarily paused';
      case 'Not Started': return 'Task is ready to begin';
      default: return 'Task status unknown';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getActionButtonState = () => {
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

  if (!isOpen || !task) return null;

  const actionState = getActionButtonState();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
              <FiTarget className="text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{task.title}</h2>
              <p className="text-gray-600">{task.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
          >
            <FiX className="text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status and Priority Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <FiTarget className="text-blue-600 text-xl" />
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                  {getStatusIcon(task.status)}
                  <span className="ml-1">{task.status}</span>
                </span>
                <p className="text-xs text-gray-500 mt-1">{getStatusDescription(task.status)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <FiCalendar className="text-green-600 text-xl" />
              <div>
                <p className="text-sm text-gray-600">Due Date</p>
                <p className="font-semibold text-gray-800">
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
              <FiAward className="text-purple-600 text-xl" />
              <div>
                <p className="text-sm text-gray-600">Priority</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority || 'Medium'}
                </span>
              </div>
            </div>
          </div>

          {/* Time Tracking Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                <FiClock className="mr-2 text-blue-600" />
                Time Tracking
              </h4>
              <button
                onClick={() => setShowTimeLogs(!showTimeLogs)}
                className="text-blue-600 text-sm hover:text-blue-800 flex items-center space-x-1"
              >
                <FiBarChart className="text-sm" />
                <span>{showTimeLogs ? 'Hide' : 'Show'} Details</span>
              </button>
            </div>
            
            {/* Total Time Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-xl p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FiClock className="text-blue-600" />
                    <span className="text-blue-600 font-semibold">Total Time:</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 font-mono">
                    {formatTime(totalTime)}
                  </div>
                </div>
              </div>

              {activeTask === task._id && (
                <div className="bg-white rounded-xl p-4 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FiPlay className="text-green-600" />
                      <span className="text-green-600 font-semibold">Active Time:</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600 font-mono">
                      {formatTime(uptime)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Time Logs Detail */}
            {showTimeLogs && timeLogs.length > 0 && (
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h5 className="font-semibold text-gray-700 mb-3">Time Logs</h5>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {timeLogs.map((log, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                          {getStatusIcon(log.status)}
                          <span className="ml-1">{log.status}</span>
                        </span>
                        <span className="text-sm text-gray-600">
                          {log.startTime ? new Date(log.startTime).toLocaleString() : 'N/A'}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">
                        {log.duration ? formatTime(log.duration) : 'N/A'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={startTask}
              disabled={!actionState.canStart || loading}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                actionState.canStart && !loading
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {loading ? <FiRefreshCw className="animate-spin" /> : <FiPlay />}
              <span>Start Task</span>
            </button>
            
            <button
              onClick={pauseTask}
              disabled={!actionState.canHold || loading}
              className={`flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                actionState.canHold && !loading
                  ? "bg-yellow-600 text-white hover:bg-yellow-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {loading ? <FiRefreshCw className="animate-spin" /> : <FiPause />}
              <span className="ml-2">Pause</span>
            </button>
            
            <button
              onClick={completeTask}
              disabled={!actionState.canComplete || loading}
              className={`flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                actionState.canComplete && !loading
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {loading ? <FiRefreshCw className="animate-spin" /> : <FiCheck />}
              <span className="ml-2">Complete</span>
            </button>
          </div>

          {/* Status Flow Information */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h5 className="font-semibold text-gray-700 mb-3">Status Flow</h5>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span>Not Started</span>
              </div>
              <FiArrowRight className="text-gray-400" />
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>In Progress</span>
              </div>
              <FiArrowRight className="text-gray-400" />
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Hold</span>
              </div>
              <FiArrowRight className="text-gray-400" />
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Completed</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              You can move between In Progress and Hold multiple times. Time is tracked for each session.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 