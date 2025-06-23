import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { motion } from "framer-motion";
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FiAward, FiTrendingUp, FiUsers, FiTarget, FiClock, FiStar, FiBarChart, FiArrowUp, FiArrowDown, FiCheck } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('week');
  const { user } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    fetchLeaderboardData();
    const interval = setInterval(fetchLeaderboardData, 30000);
    return () => clearInterval(interval);
  }, [timeFilter]);

  const fetchLeaderboardData = async () => {
    try {
      const [usersRes, tasksRes] = await Promise.all([
        axios.get('/api/users'),
        axios.get('/api/tasks')
      ]);
      
      const nonCeoUsers = usersRes.data.filter(u => u.role !== 'ceo');
      const tasks = tasksRes.data;
      
      // Calculate performance metrics for each user
      const performanceData = nonCeoUsers.map(user => {
        const userTasks = tasks.filter(task => task.assignedTo === user._id);
        const completedTasks = userTasks.filter(task => task.status === 'Completed');
        const inProgressTasks = userTasks.filter(task => task.status === 'In Progress');
        
        const completionRate = userTasks.length > 0 ? (completedTasks.length / userTasks.length) * 100 : 0;
        const efficiency = Math.round(completionRate);
        
        return {
          ...user,
          totalTasks: userTasks.length,
          completedTasks: completedTasks.length,
          inProgressTasks: inProgressTasks.length,
          efficiency,
          score: Math.round((completedTasks.length * 10) + (efficiency * 0.5))
        };
      });
      
      // Sort by score (highest first)
      const sortedData = performanceData.sort((a, b) => b.score - a.score);
      setLeaderboardData(sortedData);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <FiAward className="text-yellow-500 text-2xl" />;
      case 2: return <FiStar className="text-gray-400 text-xl" />;
      case 3: return <FiAward className="text-orange-500 text-xl" />;
      default: return <FiStar className="text-blue-500 text-lg" />;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-orange-500';
      case 2: return 'from-gray-300 to-gray-400';
      case 3: return 'from-orange-400 to-red-500';
      default: return 'from-blue-400 to-purple-500';
    }
  };

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-premium mx-auto mb-4"></div>
          <p className="text-gray-600 text-xl">Loading leaderboard...</p>
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
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                <FiAward />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-1">Team Leaderboard</h1>
                <p className="text-gray-600">Celebrating top performers and achievements</p>
                <div className="flex items-center mt-2 text-blue-600">
                  <FiTrendingUp className="mr-2" />
                  <span className="text-sm">Real-time performance tracking</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-800">
                {leaderboardData.length}
              </div>
              <p className="text-gray-600 text-sm">Team Members</p>
            </div>
          </div>
        </div>

        {/* Time Filter */}
        <div className="card-premium p-6 shadow-2xl slide-up">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <FiBarChart className="mr-2 text-blue-600" />
              Performance Period
            </h2>
            <div className="flex space-x-2 bg-white/50 backdrop-blur-sm rounded-xl p-1">
              {['week', 'month', 'quarter'].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeFilter(period)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    timeFilter === period
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Top 3 Podium */}
        {leaderboardData.length >= 3 && (
          <div className="card-premium p-8 shadow-2xl slide-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🏆 Top Performers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 2nd Place */}
              <div className="text-center scale-in stagger-1">
                <div className="relative mb-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-lg">
                    {leaderboardData[1]?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{leaderboardData[1]?.name}</h3>
                <p className="text-gray-600 text-sm">{leaderboardData[1]?.role}</p>
                <div className="mt-2 text-2xl font-bold text-gray-600">{leaderboardData[1]?.score}</div>
              </div>

              {/* 1st Place */}
              <div className="text-center scale-in stagger-2">
                <div className="relative mb-4">
                  <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-xl">
                    {leaderboardData[0]?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                    1
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800">{leaderboardData[0]?.name}</h3>
                <p className="text-gray-600 text-sm">{leaderboardData[0]?.role}</p>
                <div className="mt-2 text-3xl font-bold gradient-text">{leaderboardData[0]?.score}</div>
              </div>

              {/* 3rd Place */}
              <div className="text-center scale-in stagger-3">
                <div className="relative mb-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-lg">
                    {leaderboardData[2]?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    3
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{leaderboardData[2]?.name}</h3>
                <p className="text-gray-600 text-sm">{leaderboardData[2]?.role}</p>
                <div className="mt-2 text-2xl font-bold text-orange-600">{leaderboardData[2]?.score}</div>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="card-premium p-6 shadow-2xl slide-up">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FiUsers className="mr-2 text-blue-600" />
            Complete Leaderboard
          </h2>
          <div className="space-y-4">
            {leaderboardData.map((member, index) => (
              <motion.div
                key={member._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 bg-gradient-to-r ${getRankColor(index + 1)} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}>
                        {index + 1}
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {member.name?.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
                      <p className="text-gray-600 text-sm">{member.role}</p>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <FiTarget className="text-blue-500" />
                          <span>{member.totalTasks} tasks</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <FiCheck className="text-green-500" />
                          <span>{member.completedTasks} completed</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <FiTrendingUp className="text-purple-500" />
                          <span>{member.efficiency}% efficiency</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800">{member.score}</div>
                    <p className="text-gray-600 text-sm">Total Score</p>
                    {index < 3 && (
                      <div className="mt-2">
                        {getRankIcon(index + 1)}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Performance Chart */}
        <div className="card-premium p-6 shadow-2xl slide-up">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FiBarChart className="mr-2 text-blue-600" />
            Performance Overview
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leaderboardData.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#667eea" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
