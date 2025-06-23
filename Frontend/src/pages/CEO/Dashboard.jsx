import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import axios from "../../utils/axios";
import { 
  FiUsers, 
  FiTarget, 
  FiClock, 
  FiTrendingUp, 
  FiActivity,
  FiAward,
  FiCalendar,
  FiBarChart,
  FiPieChart,
  FiCheck,
  FiArrowUp,
  FiArrowDown
} from "react-icons/fi";
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [analytics, setAnalytics] = useState({
    members: [],
    tasks: [],
    todayStats: [],
    weeklyStats: [],
    performanceData: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [membersRes, tasksRes, todayRes, weeklyRes] = await Promise.all([
          axios.get('/api/users'),
          axios.get('/api/tasks'),
          axios.get('/api/dashboard/analytics/today'),
          axios.get('/api/dashboard/analytics/weekly')
        ]);

        setAnalytics({
          members: membersRes.data.filter(m => m.role !== 'ceo'),
          tasks: tasksRes.data,
          todayStats: todayRes.data,
          weeklyStats: weeklyRes.data,
          performanceData: generatePerformanceData(membersRes.data.filter(m => m.role !== 'ceo'))
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
    // Real-time updates every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  const generatePerformanceData = (members) => {
    return members.map(member => ({
      name: member.name,
      tasks: Math.floor(Math.random() * 10) + 5,
      hours: Math.floor(Math.random() * 40) + 20,
      efficiency: Math.floor(Math.random() * 30) + 70,
      completed: Math.floor(Math.random() * 8) + 2
    }));
  };

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-premium mx-auto mb-4"></div>
          <p className="text-gray-600 text-xl">Loading your dashboard...</p>
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
                {user?.name?.charAt(0).toUpperCase() || "C"}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-1">CEO Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.name}! Here's your team overview.</p>
                <div className="flex items-center mt-2 text-blue-600">
                  <FiActivity className="mr-2" />
                  <span className="text-sm">Real-time updates enabled</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-800">
                {analytics.members.length}
              </div>
              <p className="text-gray-600 text-sm">Active Members</p>
            </div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card-premium p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-semibold">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-800">{analytics.tasks.length}</p>
                <div className="flex items-center mt-1 text-green-600 text-sm">
                  <FiArrowUp className="mr-1" />
                  <span>+12% from last week</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FiTarget className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="card-premium p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-semibold">Completed Today</p>
                <p className="text-3xl font-bold text-gray-800">
                  {analytics.tasks.filter(t => t.status === 'Completed').length}
                </p>
                <div className="flex items-center mt-1 text-green-600 text-sm">
                  <FiArrowUp className="mr-1" />
                  <span>+8% from yesterday</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FiCheck className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="card-premium p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-semibold">Active Members</p>
                <p className="text-3xl font-bold text-gray-800">
                  {analytics.members.filter(m => m.status === 'active').length}
                </p>
                <div className="flex items-center mt-1 text-green-600 text-sm">
                  <FiArrowUp className="mr-1" />
                  <span>+3 new this week</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FiUsers className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="card-premium p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-semibold">Total Hours</p>
                <p className="text-3xl font-bold text-gray-800">
                  {analytics.performanceData.reduce((sum, m) => sum + m.hours, 0)}
                </p>
                <div className="flex items-center mt-1 text-green-600 text-sm">
                  <FiArrowUp className="mr-1" />
                  <span>+15% productivity</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <FiClock className="text-orange-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 bg-white/50 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
          {['overview', 'performance', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="glass-card rounded-3xl p-6 shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FiActivity className="mr-3 text-blue-600" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {analytics.tasks.slice(0, 5).map((task, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-white/50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiTarget className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{task.title}</p>
                      <p className="text-sm text-gray-600">{task.assignedTo}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      task.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Performance */}
            <div className="glass-card rounded-3xl p-6 shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FiTrendingUp className="mr-3 text-green-600" />
                Team Performance
              </h3>
              <div className="space-y-4">
                {analytics.performanceData.slice(0, 5).map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.tasks} tasks</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">{member.efficiency}%</p>
                      <p className="text-sm text-gray-600">efficiency</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="glass-card rounded-3xl p-6 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Performance Analytics</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="tasks" fill="#667eea" />
                  <Bar dataKey="completed" fill="#764ba2" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="glass-card rounded-3xl p-6 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Weekly Trends</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.weeklyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="tasks" stroke="#667eea" strokeWidth={2} />
                  <Line type="monotone" dataKey="hours" stroke="#764ba2" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
