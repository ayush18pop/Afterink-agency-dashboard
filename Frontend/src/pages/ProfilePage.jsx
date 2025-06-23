import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { 
  FiArrowLeft, 
  FiEdit3, 
  FiSave, 
  FiX, 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiBriefcase,
  FiClock,
  FiTarget,
  FiTrendingUp,
  FiAward,
  FiActivity,
  FiBarChart,
  FiPieChart,
  FiCalendar,
  FiShield,
  FiCamera,
  FiCheck,
  FiStar,
  FiZap,
  FiGift,
  FiSettings
} from "react-icons/fi";
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    taskStats: [],
    timeData: [],
    performance: {},
    weeklyProgress: [],
    time: {
      totalSessions: 0,
      todayTime: 0
    }
  });
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
    skills: [],
    phone: "",
    location: "",
    department: ""
  });
  const [newSkill, setNewSkill] = useState("");
  const [errors, setErrors] = useState({});
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    totalHours: 0,
    efficiency: 0
  });
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
    avatar: user?.avatar || ''
  });
  const [timeAnalytics, setTimeAnalytics] = useState({});
  const [streakData, setStreakData] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  useEffect(() => {    
    fetchProfileData();
    fetchAnalytics();
    fetchUserStats();
    generateStreakData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get('/api/users/profile', { withCredentials: true });
      setProfileData(response.data.user);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const [taskRes, timeRes, performanceRes] = await Promise.all([
        axios.get('/api/tasks/user-analytics'),
        axios.get('/api/time/user-analytics'),
        axios.get('/api/users/performance')
      ]);

      setAnalytics({
        taskStats: taskRes.data || [],
        timeData: timeRes.data || [],
        performance: performanceRes.data || {},
        weeklyProgress: generateWeeklyData(),
        time: {
          totalSessions: timeRes.data.totalSessions || 0,
          todayTime: timeRes.data.todayTime || 0
        }
      });
      setTimeAnalytics(timeRes.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  };

  const fetchUserStats = async () => {
    try {
      const [tasksRes, timeRes] = await Promise.all([
        axios.get('/api/tasks'),
        axios.get('/api/time/user/stats')
      ]);
      
      const userTasks = tasksRes.data.filter(task => task.assignedTo === user._id);
      const completedTasks = userTasks.filter(task => task.status === 'Completed');
      const totalHours = timeRes.data.totalHours || 0;
      const efficiency = userTasks.length > 0 ? Math.round((completedTasks.length / userTasks.length) * 100) : 0;

      setStats({
        totalTasks: userTasks.length,
        completedTasks: completedTasks.length,
        totalHours,
        efficiency
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const generateWeeklyData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      day,
      tasks: Math.floor(Math.random() * 10) + 1,
      hours: Math.floor(Math.random() * 8) + 1
    }));
  };

  const generateStreakData = () => {
    const data = [];
    for (let i = 0; i < 30; i++) {
      data.push({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        completed: Math.random() > 0.3 ? 1 : 0
      });
    }
    setStreakData(data);
    
    // Calculate streaks
    let current = 0;
    let longest = 0;
    let temp = 0;
    
    data.forEach(day => {
      if (day.completed === 1) {
        temp++;
        current = temp;
        if (temp > longest) longest = temp;
      } else {
        temp = 0;
      }
    });
    
    setCurrentStreak(current);
    setLongestStreak(longest);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!profileData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setSaving(true);
    try {
      const response = await axios.put('/api/users/profile', profileData, {
        withCredentials: true
      });
      
      updateUser(response.data.user);
      setIsEditing(false);
      setErrors({});
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ general: error.response?.data?.error || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const getRoleInfo = (role) => {
    switch (role) {
      case 'ceo':
        return {
          title: 'CEO',
          description: 'Full system access and management',
          color: 'from-purple-500 to-pink-500',
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-600'
        };
      case 'founding_member':
        return {
          title: 'Founding Member',
          description: 'Team management and task assignment',
          color: 'from-blue-500 to-cyan-500',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-600'
        };
      case 'freelancer':
        return {
          title: 'Freelancer',
          description: 'Task execution and time tracking',
          color: 'from-green-500 to-emerald-500',
          bgColor: 'bg-green-100',
          textColor: 'text-green-600'
        };
      default:
        return {
          title: 'User',
          description: 'Basic access',
          color: 'from-gray-500 to-gray-600',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-600'
        };
    }
  };

  const roleInfo = getRoleInfo(user?.role);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-premium mx-auto mb-4"></div>
          <p className="text-gray-600 text-xl">Loading profile...</p>
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
              <button
                onClick={() => navigate(-1)}
                className="btn-premium-secondary flex items-center space-x-2"
              >
                <FiArrowLeft />
                <span>Back</span>
              </button>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                <FiUser />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-1">Profile</h1>
                <p className="text-gray-600">Manage your account and view analytics</p>
                <div className="flex items-center mt-2 text-blue-600">
                  <FiShield className="mr-2" />
                  <span className="text-sm">Account settings and preferences</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-800">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <p className="text-gray-600 text-sm">Profile Avatar</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card-premium p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-semibold">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalTasks}</p>
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
                <p className="text-3xl font-bold text-gray-800">{stats.completedTasks}</p>
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
                <p className="text-3xl font-bold text-gray-800">{stats.totalHours}h</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FiClock className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="card-premium p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-semibold">Efficiency</p>
                <p className="text-3xl font-bold text-gray-800">{stats.efficiency}%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <FiTrendingUp className="text-orange-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="card-premium p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FiUser className="mr-2 text-blue-600" />
              Personal Information
            </h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-premium-secondary flex items-center space-x-2"
              >
                <FiEdit3 />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn-premium-secondary flex items-center space-x-2"
                >
                  <FiX />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-premium flex items-center space-x-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="loading-premium w-4 h-4"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <FiSave />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {errors.general}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className={`input-premium w-full ${errors.name ? 'border-red-300 focus:border-red-500' : ''} ${!isEditing ? 'bg-gray-50' : ''}`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-red-600 text-sm">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className={`input-premium w-full ${errors.email ? 'border-red-300 focus:border-red-500' : ''} ${!isEditing ? 'bg-gray-50' : ''}`}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="text-red-600 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className={`input-premium w-full ${!isEditing ? 'bg-gray-50' : ''}`}
                placeholder="Enter your phone number"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={profileData.location}
                onChange={handleChange}
                disabled={!isEditing}
                className={`input-premium w-full ${!isEditing ? 'bg-gray-50' : ''}`}
                placeholder="Enter your location"
              />
            </div>

            {/* Department */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={profileData.department}
                onChange={handleChange}
                disabled={!isEditing}
                className={`input-premium w-full ${!isEditing ? 'bg-gray-50' : ''}`}
                placeholder="Enter your department"
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Role
              </label>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${roleInfo.color} text-white`}>
                  {roleInfo.title}
                </span>
                <span className="text-sm text-gray-600">{roleInfo.description}</span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-6 space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Bio
            </label>
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={handleChange}
              disabled={!isEditing}
              rows={4}
              className={`input-premium w-full ${!isEditing ? 'bg-gray-50' : ''}`}
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Skills */}
          <div className="mt-6 space-y-4">
            <label className="block text-sm font-semibold text-gray-700">
              Skills
            </label>
            {isEditing && (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="input-premium flex-1"
                  placeholder="Add a skill"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="btn-premium-secondary px-4"
                >
                  Add
                </button>
              </div>
            )}
            {profileData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {skill}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Progress */}
          <div className="card-premium p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FiBarChart className="mr-2 text-blue-600" />
              Weekly Progress
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tasks" fill="#667eea" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Streak Data */}
          <div className="card-premium p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FiActivity className="mr-2 text-green-600" />
              Activity Streak
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{currentStreak}</div>
                  <p className="text-sm text-gray-600">Current Streak</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{longestStreak}</div>
                  <p className="text-sm text-gray-600">Longest Streak</p>
                </div>
              </div>
              <div className="grid grid-cols-30 gap-1">
                {streakData.map((day, index) => (
                  <div
                    key={index}
                    className={`h-8 rounded ${
                      day.completed ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                    title={`${day.date}: ${day.completed ? 'Completed' : 'No activity'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
