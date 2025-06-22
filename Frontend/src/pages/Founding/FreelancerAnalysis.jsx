import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FiUsers, FiTrendingUp, FiClock, FiTarget, FiCheck, FiAlertCircle, FiBarChart, FiPieChart, FiActivity, FiStar, FiAward, FiUser, FiPause, FiCalendar, FiDollarSign, FiRefreshCw, FiArrowRight } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import axios from '../../utils/axios';

export default function FreelancerAnalysis() {
  const [freelancers, setFreelancers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [timeLogs, setTimeLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('week');
  const { user } = useAuth();
  const { theme } = useTheme();
  const [analytics, setAnalytics] = useState(null);
  const [timeAnalytics, setTimeAnalytics] = useState(null);
  const [taskAnalytics, setTaskAnalytics] = useState(null);
  const [timeRange, setTimeRange] = useState('week'); // week, month, all
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [timeFilter]);

  const fetchData = async () => {
    try {
      const [usersRes, tasksRes, timeRes] = await Promise.all([
        axios.get('/api/users'),
        axios.get('/api/tasks'),
        axios.get('/api/time')
      ]);
      
      const freelancerUsers = usersRes.data.filter(u => u.role === 'freelancer');
      const allTasks = tasksRes.data;
      const allTimeLogs = timeRes.data;
      
      // Calculate comprehensive metrics for each freelancer
      const freelancerData = freelancerUsers.map(freelancer => {
        const freelancerTasks = allTasks.filter(task => task.assignedTo === freelancer._id);
        const freelancerTimeLogs = allTimeLogs.filter(log => log.userId === freelancer._id);
        
        const completedTasks = freelancerTasks.filter(task => task.status === 'Completed');
        const inProgressTasks = freelancerTasks.filter(task => task.status === 'In Progress');
        const holdTasks = freelancerTasks.filter(task => task.status === 'Hold');
        
        const totalTimeSpent = freelancerTimeLogs.reduce((sum, log) => sum + (log.duration || 0), 0);
        const completionRate = freelancerTasks.length > 0 ? (completedTasks.length / freelancerTasks.length) * 100 : 0;
        const efficiency = Math.round(completionRate);
        
        // Calculate average time per task
        const avgTimePerTask = completedTasks.length > 0 ? totalTimeSpent / completedTasks.length : 0;
        
        // Calculate productivity score
        const productivityScore = Math.round(
          (completedTasks.length * 10) + 
          (efficiency * 0.5) + 
          (totalTimeSpent > 0 ? Math.min(totalTimeSpent / 3600, 100) : 0)
        );
        
        return {
          ...freelancer,
          totalTasks: freelancerTasks.length,
          completedTasks: completedTasks.length,
          inProgressTasks: inProgressTasks.length,
          holdTasks: holdTasks.length,
          totalTimeSpent: Math.round(totalTimeSpent / 3600 * 100) / 100, // Convert to hours
          avgTimePerTask: Math.round(avgTimePerTask / 60 * 100) / 100, // Convert to minutes
          efficiency,
          productivityScore
        };
      });
      
      // Sort by productivity score
      const sortedData = freelancerData.sort((a, b) => b.productivityScore - a.productivityScore);
      setFreelancers(sortedData);
      setTasks(allTasks);
      setTimeLogs(allTimeLogs);
      
    } catch (error) {
      console.error('Error fetching freelancer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch different types of analytics
      const [timeData, taskData, rawData] = await Promise.all([
        axios.get('/api/time/user-analytics'),
        axios.get('/api/tasks/user-analytics'),
        axios.get('/api/time/analytics/raw')
      ]);

      setTimeAnalytics(timeData.data);
      setTaskAnalytics(taskData);
      
      // Filter data for current user
      const userData = rawData.data.find(u => u.user === user.name);
      setAnalytics(userData);

    } catch (error) {
      console.error('Error fetching analytics:', error);
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

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    let parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    return parts.join(' ') || '0m';
  };

  const getProductivityScore = () => {
    if (!taskAnalytics) return 0;
    const { totalTasks, completedTasks } = taskAnalytics;
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const getAverageSessionLength = () => {
    if (!timeAnalytics || !timeAnalytics.totalSessions) return 0;
    return Math.round(timeAnalytics.totalTime / timeAnalytics.totalSessions / 60); // in minutes
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Hold': return 'bg-yellow-100 text-yellow-800';
      case 'Not Started': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <FiRefreshCw className="text-4xl text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-xl">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Analytics</h1>
          <p className="text-gray-600">Track your productivity and working hours</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6">
          <div className="flex space-x-2 bg-white rounded-xl p-1 shadow-sm">
            {[
              { key: 'week', label: 'This Week' },
              { key: 'month', label: 'This Month' },
              { key: 'all', label: 'All Time' }
            ].map((range) => (
              <button
                key={range.key}
                onClick={() => setTimeRange(range.key)}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                  timeRange === range.key
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Working Hours */}
          <div className="card-premium p-6 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-semibold">Total Hours</p>
                <p className="text-3xl font-bold text-gray-800">
                  {timeAnalytics ? formatDuration(timeAnalytics.totalTime) : '0h'}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FiClock className="text-blue-600 text-xl" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <span className="text-green-600 font-medium">
                +{timeAnalytics ? Math.round(timeAnalytics.averageTimePerDay / 3600 * 10) / 10 : 0}h
              </span> avg per day
            </div>
          </div>

          {/* Tasks Completed */}
          <div className="card-premium p-6 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-semibold">Tasks Completed</p>
                <p className="text-3xl font-bold text-gray-800">
                  {taskAnalytics ? taskAnalytics.completedTasks : 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FiCheck className="text-green-600 text-xl" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <span className="text-green-600 font-medium">
                {getProductivityScore()}%
              </span> completion rate
            </div>
          </div>

          {/* Active Sessions */}
          <div className="card-premium p-6 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-semibold">Work Sessions</p>
                <p className="text-3xl font-bold text-gray-800">
                  {timeAnalytics ? timeAnalytics.totalSessions : 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FiActivity className="text-purple-600 text-xl" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <span className="text-purple-600 font-medium">
                {getAverageSessionLength()}m
              </span> avg session
            </div>
          </div>

          {/* Productivity Score */}
          <div className="card-premium p-6 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-semibold">Productivity</p>
                <p className="text-3xl font-bold text-gray-800">
                  {getProductivityScore()}%
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <FiTrendingUp className="text-orange-600 text-xl" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <span className="text-orange-600 font-medium">
                {taskAnalytics ? taskAnalytics.totalTasks : 0}
              </span> total tasks
            </div>
          </div>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Time Breakdown */}
          <div className="card-premium p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FiBarChart className="mr-2 text-blue-600" />
              Time Breakdown
            </h3>
            
            {timeAnalytics ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FiClock className="text-blue-600" />
                    <span className="font-medium">Today</span>
                  </div>
                  <span className="font-semibold text-blue-600">
                    {formatDuration(timeAnalytics.todayTime)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FiCalendar className="text-green-600" />
                    <span className="font-medium">This Week</span>
                  </div>
                  <span className="font-semibold text-green-600">
                    {formatDuration(timeAnalytics.weeklyTime)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FiTrendingUp className="text-purple-600" />
                    <span className="font-medium">This Month</span>
                  </div>
                  <span className="font-semibold text-purple-600">
                    {formatDuration(timeAnalytics.monthlyTime)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FiAward className="text-orange-600" />
                    <span className="font-medium">Average/Day</span>
                  </div>
                  <span className="font-semibold text-orange-600">
                    {formatDuration(timeAnalytics.averageTimePerDay)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No time data available</p>
            )}
          </div>

          {/* Task Status Distribution */}
          <div className="card-premium p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FiTarget className="mr-2 text-green-600" />
              Task Status
            </h3>
            
            {taskAnalytics ? (
              <div className="space-y-4">
                {[
                  { status: 'Completed', count: taskAnalytics.completedTasks, icon: FiCheck, color: 'green' },
                  { status: 'In Progress', count: taskAnalytics.inProgressTasks, icon: FiClock, color: 'blue' },
                  { status: 'Hold', count: taskAnalytics.holdTasks, icon: FiPause, color: 'yellow' },
                  { status: 'Not Started', count: taskAnalytics.totalTasks - taskAnalytics.completedTasks - taskAnalytics.inProgressTasks - taskAnalytics.holdTasks, icon: FiTarget, color: 'gray' }
                ].map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <IconComponent className={`text-${item.color}-600`} />
                        <span className="font-medium">{item.status}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-800">{item.count}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {taskAnalytics.totalTasks > 0 ? Math.round((item.count / taskAnalytics.totalTasks) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No task data available</p>
            )}
          </div>
        </div>

        {/* Task Performance */}
        {analytics && analytics.perTask && Object.keys(analytics.perTask).length > 0 && (
          <div className="card-premium p-6 mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FiUsers className="mr-2 text-purple-600" />
              Task Performance
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Task</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Time Spent</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Sessions</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Efficiency</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(analytics.perTask).map(([taskName, taskData], index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-800">{taskName}</td>
                      <td className="py-3 px-4 text-blue-600 font-semibold">
                        {formatDuration(taskData.seconds)}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {taskData.sessions || 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${Math.min((taskData.seconds / 3600) * 10, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">
                            {Math.round((taskData.seconds / 3600) * 10) / 10}h
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Productivity Tips */}
        <div className="card-premium p-6 mt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <FiAward className="mr-2 text-orange-600" />
            Productivity Tips
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Time Management</h4>
              <p className="text-sm text-blue-700">
                Break your work into focused 25-minute sessions with 5-minute breaks to maintain high productivity.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Task Completion</h4>
              <p className="text-sm text-green-700">
                Focus on completing one task at a time rather than switching between multiple tasks.
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2">Regular Breaks</h4>
              <p className="text-sm text-purple-700">
                Take regular breaks to maintain mental clarity and prevent burnout during long work sessions.
              </p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-800 mb-2">Progress Tracking</h4>
              <p className="text-sm text-orange-700">
                Regularly review your progress and adjust your approach based on your productivity patterns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
