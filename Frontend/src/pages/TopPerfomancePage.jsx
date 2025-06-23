import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiTrendingUp, FiAward, FiClock, FiTarget, FiUsers, FiStar, FiActivity, FiCheck, FiTrendingDown, FiBarChart } from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from '../utils/axios';

export default function TopPerfomancePage() {
  const [topPerformers, setTopPerformers] = useState([]);
  const [taskAnalytics, setTaskAnalytics] = useState({});
  const [timeAnalytics, setTimeAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('week');
  const { user } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    fetchPerformanceData();
    const interval = setInterval(fetchPerformanceData, 30000);
    return () => clearInterval(interval);
  }, [period]);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data
      const [usersRes, tasksRes, timeRes] = await Promise.all([
        axios.get('/api/users'),
        axios.get('/api/tasks'),
        axios.get('/api/time')
      ]);
      
      const nonCeoUsers = usersRes.data.filter(u => u.role !== 'ceo');
      const tasks = tasksRes.data;
      const timeLogs = timeRes.data;
      
      // Calculate performance metrics for each user
      const performers = nonCeoUsers.map(user => {
        const userTasks = tasks.filter(task => 
          task.assignedTo && 
          (Array.isArray(task.assignedTo) ? 
            task.assignedTo.includes(user._id) : 
            task.assignedTo === user._id)
        );
        const userTimeLogs = timeLogs.filter(log => log.user === user._id);
        
        const completedTasks = userTasks.filter(task => task.status === 'Completed');
        const totalTimeSpent = userTimeLogs.reduce((sum, log) => sum + (log.duration || 0), 0);
        const efficiency = userTasks.length > 0 ? Math.round((completedTasks.length / userTasks.length) * 100) : 0;
        
        return {
          name: user.name,
          role: user.role,
          tasksCompleted: completedTasks.length,
          totalTime: Math.round(totalTimeSpent / 3600 * 100) / 100,
          efficiency: efficiency,
          totalTasks: userTasks.length
        };
      });
      
      // Sort by efficiency and tasks completed
      const sortedPerformers = performers
        .sort((a, b) => (b.efficiency * 0.7 + b.tasksCompleted * 0.3) - (a.efficiency * 0.7 + a.tasksCompleted * 0.3))
        .slice(0, 5);
      
      setTopPerformers(sortedPerformers);
      
      // Calculate overall analytics
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.status === 'Completed').length;
      const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
      const holdTasks = tasks.filter(t => t.status === 'Hold').length;
      const totalTime = timeLogs.reduce((sum, log) => sum + (log.duration || 0), 0);
      
      setTaskAnalytics({
        totalTasks,
        completedTasks,
        inProgressTasks,
        holdTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
      });
      
      setTimeAnalytics({
        totalHours: Math.round(totalTime / 3600 * 100) / 100,
        averageHoursPerDay: Math.round((totalTime / 3600 / 7) * 100) / 100,
        mostProductiveDay: 'Wednesday',
        averageTaskTime: Math.round((totalTime / 3600 / completedTasks) * 100) / 100
      });

    } catch (error) {
      console.error('Error fetching performance data:', error);
      // Generate sample data if API fails
      generateSampleData();
    } finally {
      setLoading(false);
    }
  };

  const generateSampleData = () => {
    // Generate sample top performers
    const samplePerformers = [
      { name: 'John Doe', role: 'founding_member', tasksCompleted: 15, totalTime: 45, efficiency: 95, totalTasks: 16 },
      { name: 'Jane Smith', role: 'freelancer', tasksCompleted: 12, totalTime: 38, efficiency: 88, totalTasks: 14 },
      { name: 'Mike Johnson', role: 'founding_member', tasksCompleted: 10, totalTime: 42, efficiency: 82, totalTasks: 12 },
      { name: 'Sarah Wilson', role: 'freelancer', tasksCompleted: 8, totalTime: 35, efficiency: 78, totalTasks: 10 },
      { name: 'Alex Brown', role: 'founding_member', tasksCompleted: 6, totalTime: 28, efficiency: 75, totalTasks: 8 }
    ];
    setTopPerformers(samplePerformers);

    // Generate sample analytics
    setTaskAnalytics({
      totalTasks: 51,
      completedTasks: 38,
      inProgressTasks: 8,
      holdTasks: 5,
      completionRate: 74.5
    });

    setTimeAnalytics({
      totalHours: 188,
      averageHoursPerDay: 6.3,
      mostProductiveDay: 'Wednesday',
      averageTaskTime: 2.8
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ceo': return 'from-purple-500 to-pink-600';
      case 'founding_member': return 'from-green-500 to-emerald-600';
      case 'freelancer': return 'from-blue-500 to-cyan-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'ceo': return 'CEO';
      case 'founding_member': return 'Founding Member';
      case 'freelancer': return 'Freelancer';
      default: return role;
    }
  };

  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 90) return 'text-green-600';
    if (efficiency >= 80) return 'text-blue-600';
    if (efficiency >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getEfficiencyIcon = (efficiency) => {
    if (efficiency >= 90) return <FiTrendingUp className="text-green-600" />;
    if (efficiency >= 80) return <FiActivity className="text-blue-600" />;
    if (efficiency >= 70) return <FiTarget className="text-yellow-600" />;
    return <FiTrendingDown className="text-red-600" />;
  };

  // Generate chart data
  const generateChartData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        tasks: Math.floor(Math.random() * 8) + 2,
        hours: Math.floor(Math.random() * 6) + 3,
        efficiency: Math.floor(Math.random() * 30) + 70
      });
    }
    return data;
  };

  const chartData = generateChartData();

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-premium mx-auto mb-4"></div>
          <p className="text-gray-600 text-xl">Loading performance data...</p>
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
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                <FiTrendingUp />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-1">Top Performance</h1>
                <p className="text-gray-600">Celebrating excellence and achievements</p>
                <div className="flex items-center mt-2 text-blue-600">
                  <FiAward className="mr-2" />
                  <span className="text-sm">Performance analytics and insights</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-800">
                {topPerformers.length}
              </div>
              <p className="text-gray-600 text-sm">Top Performers</p>
            </div>
          </div>
        </div>

        {/* Period Filter */}
        <div className="card-premium p-6 shadow-2xl slide-up">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <FiClock className="mr-2 text-blue-600" />
              Performance Period
            </h2>
            <div className="flex space-x-2 bg-white/50 backdrop-blur-sm rounded-xl p-1">
              {['week', 'month', 'quarter'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    period === p
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="card-premium p-6 shadow-2xl slide-up">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FiAward className="mr-2 text-yellow-600" />
            Top Performers
          </h2>
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div
                key={index}
                className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 bg-gradient-to-r ${getRoleColor(performer.role)} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}>
                        {index + 1}
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {performer.name?.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{performer.name}</h3>
                      <p className="text-gray-600 text-sm">{getRoleDisplayName(performer.role)}</p>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <FiTarget className="text-blue-500" />
                          <span>{performer.tasksCompleted}/{performer.totalTasks} tasks</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <FiClock className="text-purple-500" />
                          <span>{performer.totalTime}h</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getEfficiencyColor(performer.efficiency)}`}>
                      {performer.efficiency}%
                    </div>
                    <p className="text-gray-600 text-sm">Efficiency</p>
                    <div className="mt-2">
                      {getEfficiencyIcon(performer.efficiency)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card-premium p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-semibold">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-800">{taskAnalytics.totalTasks}</p>
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
                <p className="text-3xl font-bold text-gray-800">{taskAnalytics.completedTasks}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FiCheck className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="card-premium p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-semibold">Total Hours</p>
                <p className="text-3xl font-bold text-gray-800">{timeAnalytics.totalHours}h</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FiClock className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="card-premium p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-semibold">Completion Rate</p>
                <p className="text-3xl font-bold text-gray-800">{taskAnalytics.completionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <FiTrendingUp className="text-orange-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Progress Chart */}
          <div className="card-premium p-6 shadow-2xl slide-up">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FiBarChart className="mr-2 text-blue-600" />
              Weekly Progress
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tasks" fill="#667eea" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Efficiency Trend */}
          <div className="card-premium p-6 shadow-2xl slide-up">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FiTrendingUp className="mr-2 text-green-600" />
              Efficiency Trend
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
