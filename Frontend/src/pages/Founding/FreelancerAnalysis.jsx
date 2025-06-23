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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="glass-card rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                <FiBarChart />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-1">Freelancer Analysis</h1>
                <p className="text-gray-600">Comprehensive performance insights and analytics</p>
                <div className="flex items-center mt-2 text-blue-600">
                  <FiActivity className="mr-2" />
                  <span className="text-sm">Real-time data updates</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-800">
                {freelancers.length}
              </div>
              <p className="text-gray-600 text-sm">Active Freelancers</p>
            </div>
          </div>
        </div>

        {/* Time Range Filter */}
        <div className="card-premium p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <FiCalendar className="mr-2 text-blue-600" />
              Analysis Period
            </h2>
            <div className="flex space-x-2 bg-white/50 backdrop-blur-sm rounded-xl p-1">
              {[
                { key: 'week', label: 'This Week' },
                { key: 'month', label: 'This Month' },
                { key: 'all', label: 'All Time' }
              ].map((range) => (
                <button
                  key={range.key}
                  onClick={() => setTimeRange(range.key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    timeRange === range.key
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="card-premium p-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FiAward className="mr-2 text-yellow-600" />
            Top Performers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freelancers.slice(0, 6).map((freelancer, index) => (
              <div
                key={freelancer._id}
                className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {freelancer.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{freelancer.name}</h3>
                      <p className="text-sm text-gray-600">{freelancer.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800">{freelancer.productivityScore}</div>
                    <p className="text-sm text-gray-600">Score</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tasks Completed:</span>
                    <span className="font-semibold text-green-600">{freelancer.completedTasks}/{freelancer.totalTasks}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Efficiency:</span>
                    <span className="font-semibold text-blue-600">{freelancer.efficiency}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Time Spent:</span>
                    <span className="font-semibold text-purple-600">{freelancer.totalTimeSpent}h</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Productivity Chart */}
          <div className="card-premium p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FiTrendingUp className="mr-2 text-green-600" />
              Productivity Overview
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={freelancers.slice(0, 8)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="productivityScore" fill="#667eea" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Task Distribution */}
          <div className="card-premium p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FiPieChart className="mr-2 text-purple-600" />
              Task Status Distribution
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Completed', value: freelancers.reduce((sum, f) => sum + f.completedTasks, 0) },
                      { name: 'In Progress', value: freelancers.reduce((sum, f) => sum + f.inProgressTasks, 0) },
                      { name: 'On Hold', value: freelancers.reduce((sum, f) => sum + f.holdTasks, 0) }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Detailed Analytics */}
        <div className="card-premium p-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FiActivity className="mr-2 text-blue-600" />
            Detailed Performance Metrics
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Freelancer</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-800">Total Tasks</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-800">Completed</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-800">Efficiency</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-800">Time Spent</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-800">Avg Time/Task</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-800">Score</th>
                </tr>
              </thead>
              <tbody>
                {freelancers.map((freelancer, index) => (
                  <tr key={freelancer._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {freelancer.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{freelancer.name}</p>
                          <p className="text-sm text-gray-600">{freelancer.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4 font-semibold text-gray-800">{freelancer.totalTasks}</td>
                    <td className="text-center py-3 px-4 font-semibold text-green-600">{freelancer.completedTasks}</td>
                    <td className="text-center py-3 px-4 font-semibold text-blue-600">{freelancer.efficiency}%</td>
                    <td className="text-center py-3 px-4 font-semibold text-purple-600">{freelancer.totalTimeSpent}h</td>
                    <td className="text-center py-3 px-4 font-semibold text-orange-600">{freelancer.avgTimePerTask}m</td>
                    <td className="text-center py-3 px-4 font-semibold text-gray-800">{freelancer.productivityScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
