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
    return [
      { day: 'Mon', hours: 8, tasks: 5 },
      { day: 'Tue', hours: 7.5, tasks: 4 },
      { day: 'Wed', hours: 9, tasks: 6 },
      { day: 'Thu', hours: 6.5, tasks: 3 },
      { day: 'Fri', hours: 8.5, tasks: 5 },
      { day: 'Sat', hours: 4, tasks: 2 },
      { day: 'Sun', hours: 2, tasks: 1 }
    ];
  };

  const generateStreakData = () => {
    // Generate last 365 days of activity data
    const data = [];
    const today = new Date();
    let streak = 0;
    let maxStreak = 0;
    let currentStreakCount = 0;

    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Simulate activity (you can replace this with real data)
      const hasActivity = Math.random() > 0.3; // 70% chance of activity
      
      if (hasActivity) {
        currentStreakCount++;
        if (currentStreakCount > maxStreak) {
          maxStreak = currentStreakCount;
        }
      } else {
        if (i === 0) { // Today
          currentStreak = currentStreakCount;
        }
        currentStreakCount = 0;
      }

      data.push({
        date: date.toISOString().split('T')[0],
        activity: hasActivity ? Math.floor(Math.random() * 4) + 1 : 0 // 0-4 hours
      });
    }

    setStreakData(data);
    setCurrentStreak(currentStreak);
    setLongestStreak(maxStreak);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!profileData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!profileData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = "Email is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setSaving(true);
    try {
      const response = await axios.put('/api/users/profile', profileData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      updateUser({
        ...user,
        ...response.data.user
      });

      setIsEditing(false);
      setErrors({});
    } catch (error) {
      console.error("Failed to save profile:", error);
      const errorMessage = error.response?.data?.error || "Failed to save profile. Please try again.";
      setErrors({ general: errorMessage });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    fetchProfileData();
    setIsEditing(false);
    setErrors({});
  };

  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      setLoading(false);
      return;
    }

    try {
      const updateData = {
        name: formData.name,
        email: formData.email
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await axios.put('/api/users/profile', updateData);
      
      if (response.data.success) {
        updateUser(response.data.user);
        setIsEditing(false);
        setFormData({
          ...formData,
          password: '',
          confirmPassword: ''
        });
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getRoleDisplay = (role) => {
    switch (role) {
      case 'ceo': return 'CEO';
      case 'founding_member': return 'Founding Member';
      case 'freelancer': return 'Freelancer';
      default: return role;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ceo': return 'from-purple-500 to-pink-600';
      case 'founding_member': return 'from-green-500 to-emerald-600';
      case 'freelancer': return 'from-blue-500 to-cyan-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

  // Generate sample data for charts
  const generateChartData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        tasks: Math.floor(Math.random() * 5) + 1,
        hours: Math.floor(Math.random() * 8) + 2
      });
    }
    return data;
  };

  const chartData = generateChartData();

  const getActivityColor = (level) => {
    if (level === 0) return 'activity-none';
    if (level === 1) return 'activity-low';
    if (level === 2) return 'activity-medium';
    if (level === 3) return 'activity-high';
    return 'activity-max';
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-premium mx-auto mb-4"></div>
          <p className="text-premium-secondary text-xl">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-premium mb-2">My Profile</h1>
          <p className="text-premium-secondary">Manage your account and track your progress</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="card-premium p-6">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <img
                    src={profileData?.avatar || `https://ui-avatars.com/api/?name=${profileData?.name}&size=128&background=3B82F6&color=fff&bold=true`}
                    alt={profileData?.name}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg mx-auto"
                  />
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
                      <FiEdit3 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mt-4">{profileData?.name}</h2>
                <p className="text-gray-600 capitalize">{getRoleDisplay(profileData?.role)}</p>
                <div className="flex items-center justify-center mt-2">
                  <FiStar className="text-yellow-500 mr-1" />
                  <span className="text-sm text-gray-600">Member since {new Date(profileData?.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Profile Actions */}
              <div className="flex space-x-2 mb-6">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <FiSave className="mr-2" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
                    >
                      <FiX className="mr-2" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <FiEdit3 className="mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Profile Details */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FiMail className="text-gray-500" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Email</p>
                    {isEditing ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        name="email"
                        className="w-full p-1 border border-gray-300 rounded text-sm"
                      />
                    ) : (
                      <p className="font-medium text-gray-800">{profileData?.email}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FiPhone className="text-gray-500" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Phone</p>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData?.phone || ''}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full p-1 border border-gray-300 rounded text-sm"
                      />
                    ) : (
                      <p className="font-medium text-gray-800">{profileData?.phone || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FiMapPin className="text-gray-500" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Location</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData?.location || ''}
                        onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full p-1 border border-gray-300 rounded text-sm"
                      />
                    ) : (
                      <p className="font-medium text-gray-800">{profileData?.location || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FiAward className="text-gray-500" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Department</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData?.department || ''}
                        onChange={(e) => setProfileData(prev => ({ ...prev, department: e.target.value }))}
                        className="w-full p-1 border border-gray-300 rounded text-sm"
                      />
                    ) : (
                      <p className="font-medium text-gray-800">{profileData?.department || 'Not assigned'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-800 mb-3">About</h3>
                {isEditing ? (
                  <textarea
                    value={profileData?.bio || ''}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none"
                    rows="4"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                    {profileData?.bio || 'No bio provided yet.'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="card-premium p-4 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <FiTarget className="text-blue-600 text-xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{stats.totalTasks}</h3>
                <p className="text-sm text-gray-600">Total Tasks</p>
              </div>

              <div className="card-premium p-4 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <FiCheck className="text-green-600 text-xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{stats.completedTasks}</h3>
                <p className="text-sm text-gray-600">Completed</p>
              </div>

              <div className="card-premium p-4 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <FiClock className="text-purple-600 text-xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {Math.round(stats.totalHours)}h
                </h3>
                <p className="text-sm text-gray-600">Total Time</p>
              </div>

              <div className="card-premium p-4 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <FiTrendingUp className="text-orange-600 text-xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{stats.efficiency}%</h3>
                <p className="text-sm text-gray-600">Efficiency</p>
              </div>
            </div>

            {/* LeetCode-style Activity Tracker */}
            <div className="card-premium p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <FiCalendar className="mr-2 text-blue-600" />
                  Activity Tracker
                </h3>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 activity-none rounded"></div>
                    <span className="text-premium-secondary">No activity</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 activity-low rounded"></div>
                    <span className="text-premium-secondary">Low</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 activity-high rounded"></div>
                    <span className="text-premium-secondary">High</span>
                  </div>
                </div>
              </div>

              {/* Streak Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-glass-bg rounded-xl">
                  <h4 className="text-2xl font-bold text-blue-600">{currentStreak}</h4>
                  <p className="text-sm text-premium-secondary">Current Streak</p>
                </div>
                <div className="text-center p-4 bg-glass-bg rounded-xl">
                  <h4 className="text-2xl font-bold text-green-600">{longestStreak}</h4>
                  <p className="text-sm text-premium-secondary">Longest Streak</p>
                </div>
                <div className="text-center p-4 bg-glass-bg rounded-xl">
                  <h4 className="text-2xl font-bold text-purple-600">
                    {Math.round((streakData.filter(d => d.activity > 0).length / 365) * 100)}%
                  </h4>
                  <p className="text-sm text-premium-secondary">Activity Rate</p>
                </div>
              </div>

              {/* Activity Grid */}
              <div className="overflow-x-auto">
                <div className="grid grid-cols-53 gap-1 min-w-max">
                  {streakData.map((day, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-sm ${getActivityColor(day.activity)}`}
                      title={`${day.date}: ${day.activity > 0 ? `${day.activity} hours` : 'No activity'}`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-premium-secondary mt-3 text-center">
                Last 365 days of activity
              </p>
            </div>

            {/* Recent Activity */}
            <div className="card-premium p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FiActivity className="mr-2 text-green-600" />
                Recent Activity
              </h3>
              
              <div className="space-y-4">
                {analytics?.time?.totalSessions > 0 ? (
                  <div className="flex items-center justify-between p-4 bg-glass-bg rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <FiClock className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-premium">Work Session</p>
                        <p className="text-sm text-premium-secondary">Today</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-premium">
                        {analytics?.time ? formatTime(analytics.time.todayTime) : '0h 0m'}
                      </p>
                      <p className="text-sm text-premium-secondary">Time spent</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-premium-secondary">
                    <FiActivity className="text-4xl mx-auto mb-2 text-premium-secondary" />
                    <p>No recent activity</p>
                    <p className="text-sm">Start working on tasks to see your activity here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Skills Section */}
            <div className="card-premium p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FiZap className="mr-2 text-yellow-600" />
                Skills & Expertise
              </h3>
              
              {isEditing ? (
                <div>
                  <textarea
                    value={Array.isArray(profileData?.skills) ? profileData.skills.join(', ') : profileData?.skills || ''}
                    onChange={(e) => setProfileData(prev => ({ ...prev, skills: e.target.value.split(',').map(s => s.trim()) }))}
                    className="w-full p-3 border border-border-primary rounded-lg text-sm resize-none input-premium"
                    rows="3"
                    placeholder="Enter your skills separated by commas..."
                  />
                  <p className="text-xs text-premium-secondary mt-1">Separate skills with commas</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profileData?.skills && profileData.skills.length > 0 ? (
                    profileData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-premium-secondary">No skills added yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
