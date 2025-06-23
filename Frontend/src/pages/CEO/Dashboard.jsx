<<<<<<< HEAD
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
            {/* Team Performance Chart */}
            <div className="card-premium p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FiBarChart className="mr-2 text-blue-600" />
                Team Performance
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar dataKey="tasks" fill="#667eea" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Task Status Distribution */}
            <div className="card-premium p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FiPieChart className="mr-2 text-purple-600" />
                Task Status
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={[
                      { name: 'Completed', value: analytics.tasks.filter(t => t.status === 'Completed').length },
                      { name: 'In Progress', value: analytics.tasks.filter(t => t.status === 'In Progress').length },
                      { name: 'Hold', value: analytics.tasks.filter(t => t.status === 'Hold').length },
                      { name: 'Not Started', value: analytics.tasks.filter(t => t.status === 'Not Started').length }
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
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="card-premium p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <FiTrendingUp className="mr-2 text-green-600" />
              Performance Analytics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {analytics.performanceData.map((member, index) => (
                <div key={index} className="bg-gradient-to-br from-white/50 to-white/30 rounded-xl p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-800">{member.name}</h4>
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {member.efficiency}%
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tasks:</span>
                      <span className="font-semibold text-gray-800">{member.tasks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hours:</span>
                      <span className="font-semibold text-gray-800">{member.hours}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completed:</span>
                      <span className="font-semibold text-green-600">{member.completed}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="card-premium p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <FiAward className="mr-2 text-yellow-600" />
              Detailed Analytics
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Weekly Trends</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={analytics.weeklyStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#667eea" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Team Overview</h4>
                <div className="space-y-4">
                  {analytics.members.slice(0, 5).map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-white/20">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {member.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{member.name}</p>
                          <p className="text-sm text-gray-500">{member.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-800">Active</p>
                        <p className="text-xs text-green-600">Online</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
=======
import Sidebar from "../../components/Sidebar";
import TaskOverviewCards from "./TaskOverviewCards";
import MemberOverviewCards from "./MemberOverviewCards";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-[#17171e]">
      {/* Sidebar: fixed width, vertical layout */}
      {/* <aside className="w-64 flex-shrink-0 h-full overflow-y-auto">
        <Sidebar />
      </aside> */}

      {/* Main content: flexible area, scrollable */}
      <main className="flex-1 overflow-y-auto px-10 py-8 space-y-12">
        <TaskOverviewCards />
        <MemberOverviewCards />
      </main>
>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d
    </div>
  );
}
