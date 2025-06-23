<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FiTarget, FiUsers, FiClock, FiCheck, FiPlus, FiFilter, FiSearch, FiCalendar, FiUser, FiArrowRight, FiTrendingUp, FiAward, FiAlertCircle } from 'react-icons/fi';
import axios from '../../utils/axios';
import TaskDetailsModal from '../../components/TaskDetailsModal';

export default function CEOTasks() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, usersRes] = await Promise.all([
        axios.get('/api/tasks'),
        axios.get('/api/users')
      ]);
      setTasks(tasksRes.data);
      setUsers(usersRes.data.filter(u => u.role !== 'ceo'));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'status-completed';
      case 'In Progress': return 'status-active';
      case 'Hold': return 'status-pending';
      default: return 'status-pending';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <FiCheck className="text-green-600" />;
      case 'In Progress': return <FiClock className="text-blue-600" />;
      case 'Hold': return <FiAlertCircle className="text-yellow-600" />;
      default: return <FiTarget className="text-gray-600" />;
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

  const getUserName = (userId) => {
    const user = users.find(u => u._id === userId);
    return user ? user.name : 'Unknown User';
  };

  const handleViewDetails = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleTaskUpdate = () => {
    fetchData();
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status === filter;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-premium mx-auto mb-4"></div>
          <p className="text-gray-600 text-xl">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="glass-card rounded-3xl p-8 shadow-2xl slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                <FiTarget />
              </div>
        <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-1">Task Management</h1>
                <p className="text-gray-600">Monitor and manage all team tasks</p>
                <div className="flex items-center mt-2 text-blue-600">
                  <FiTrendingUp className="mr-2" />
                  <span className="text-sm">Real-time updates enabled</span>
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
          <div className="card-premium p-6 hover-lift stagger-1">
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

          <div className="card-premium p-6 hover-lift stagger-2">
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

          <div className="card-premium p-6 hover-lift stagger-3">
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

          <div className="card-premium p-6 hover-lift stagger-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-semibold">On Hold</p>
                <p className="text-3xl font-bold text-gray-800">
                  {tasks.filter(t => t.status === 'Hold').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <FiAlertCircle className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card-premium p-6 shadow-2xl slide-up">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-premium pl-12 w-64"
                />
      </div>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input-premium"
              >
                <option value="all">All Tasks</option>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Hold">On Hold</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            
            <button className="btn-premium flex items-center space-x-2">
              <FiPlus />
              <span>Add New Task</span>
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-6">
          {filteredTasks.length === 0 ? (
            <div className="card-premium p-12 text-center bounce-in">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiTarget className="text-blue-600 text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">No Tasks Found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchTerm || filter !== 'all' 
                  ? 'No tasks match your current filters. Try adjusting your search or filters.'
                  : 'Get started by creating your first task for the team!'
                }
              </p>
              <button className="btn-premium flex items-center space-x-2 mx-auto">
                <FiPlus />
                <span>Create First Task</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTasks.map((task, index) => (
                <div key={task._id} className="card-premium p-6 hover-lift stagger-1" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{task.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
                      
                      <div className="flex items-center space-x-4 mb-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                          {getStatusIcon(task.status)}
                          <span className="ml-1">{task.status}</span>
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority} Priority
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Task Details */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4 border border-blue-100">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <FiUser className="text-gray-500" />
                        <span className="text-gray-700">
                          <strong>Assigned:</strong> {getUserName(task.assignedTo)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FiCalendar className="text-gray-500" />
                        <span className="text-gray-700">
                          <strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
              <button
                      onClick={() => handleViewDetails(task)}
                      className="btn-premium-secondary flex-1 flex items-center justify-center space-x-2"
              >
                      <FiArrowRight />
                      <span>View Details</span>
              </button>
                    <button className="btn-premium-secondary flex items-center justify-center px-4">
                      <FiAward />
=======
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "../../utils/axios";

export default function CEOTasks() {
  const { user } = useAuth();  // Get the logged-in user (CEO)
  const [tasks, setTasks] = useState([]);  // State to store tasks
  const [loading, setLoading] = useState(true);  // Loading state for tasks
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
      setActiveTask(null);
    } catch (error) {
      console.error("Error putting task on hold", error);
    } finally {
      setChangingId(null);
    }
  };

  const completeTask = async (taskId) => {
    setChangingId(taskId);
    try {
      await axios.post("/api/time/complete", { taskId });
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, memberStatus: "Completed" } : t));
      setActiveTask(null);
    } catch (error) {
      console.error("Error completing task", error);
    } finally {
      setChangingId(null);
    }
  };

  // Fetch tasks data (tasks with CEO assigned directly)
  useEffect(() => {
    axios.get("api/tasks/myselfceotasks", { withCredentials: true })
      .then(res => {
        console.log("Fetched tasks:", res.data);  // Log the fetched tasks for debugging
        setTasks(res.data);  // No filtering, just directly set tasks
        const uptimeInit = {};
        res.data.forEach(task => {
          if (task.memberStatus === "In Progress") {
            uptimeInit[task._id] = 0;
            setActiveTask(task._id); // Set active task if one exists
          }
        });
        setUptimeMap(uptimeInit);
      })
      .finally(() => setLoading(false));  // Stop loading after fetching tasks
  }, [user]);

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

  // Handle page/tab unload (close or refresh) to save task state
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (activeTask) {
        // Put the active task into "Hold" before the tab closes or reloads
        axios.post("/api/time/hold", { taskId: activeTask });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [activeTask]);

  if (loading) return <div className="text-gray-400">Loading...</div>;

  return (
    <div className="p-6 text-white bg-gray-950 min-h-screen">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl shadow-lg p-6 mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-300">Welcome back 👋</p>
          <h1 className="text-2xl font-bold">{user?.name || "CEO"}</h1>
          <p className="text-sm text-gray-400 capitalize mt-1">{user?.role}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl font-bold text-white">
          {user?.name?.charAt(0).toUpperCase() || "C"}
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
>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d
              </button>
            </div>
          </div>
        ))}
<<<<<<< HEAD
          </div>
        )}
      </div>
      </div>

      {/* Task Details Modal */}
      <TaskDetailsModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        onTaskUpdate={handleTaskUpdate}
      />
=======
        {tasks.length === 0 && (
          <div className="col-span-full text-center text-gray-400 py-10">
            No tasks assigned.
          </div>
        )}
      </div>
>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d
    </div>
  );
}
