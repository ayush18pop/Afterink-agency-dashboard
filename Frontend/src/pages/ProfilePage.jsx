import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
<<<<<<< HEAD
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
=======
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { FiEdit3, FiSave, FiX, FiUser, FiMail, FiBriefcase, FiArrowLeft } from "react-icons/fi";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
    skills: [],
<<<<<<< HEAD
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
=======
    avatar: null,
    phone: "",
    location: "",
    department: "",
    joinDate: "",
  });  const [newSkill, setNewSkill] = useState("");
  const [errors, setErrors] = useState({});// Initialize profile data from user context
  useEffect(() => {    
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        skills: user.skills || [],
        avatar: user.avatar || null,
        phone: user.phone || "",
        location: user.location || "",
        department: user.department || "",
        joinDate: user.joinDate || new Date().toISOString().split('T')[0],
      });
      fetchProfileData();
    }
  }, [user]);  const fetchProfileData = async () => {
    if (!user?._id) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`/api/users/profile`, { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });      const data = response.data;        setProfileData(prev => ({
        ...prev,
        ...data.profile,
      }));
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
      setErrors({ general: "Failed to load profile data. Please try refreshing the page." });
>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
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

=======
>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d
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
<<<<<<< HEAD
  };

  const handleSave = async () => {
=======
  };  const handleSave = async () => {
>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d
    if (!validateForm()) return;
    
    setSaving(true);
    try {
      const response = await axios.put('/api/users/profile', profileData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

<<<<<<< HEAD
=======
      // Update user context with new data
>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d
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
<<<<<<< HEAD

  const handleCancel = () => {
=======
  const handleCancel = () => {
    // Reset to fetched profile data instead of user context
>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d
    fetchProfileData();
    setIsEditing(false);
    setErrors({});
  };
<<<<<<< HEAD

=======
>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d
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
<<<<<<< HEAD
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
=======
      skills: prev.skills.filter(skill => skill !== skillToRemove)    }));
>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d
  };

  if (loading) {
    return (
<<<<<<< HEAD
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-premium mx-auto mb-4"></div>
          <p className="text-premium-secondary text-xl">Loading profile...</p>
        </div>
=======
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-lg">Loading profile...</div>
>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d
      </div>
    );
  }

  return (
<<<<<<< HEAD
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
=======
    <div className="min-h-screen bg-gray-950 p-6">      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FiArrowLeft size={20} />
              Back
            </button>
            <h1 className="text-3xl font-bold text-white">Profile</h1>
          </div>          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <FiEdit3 size={16} />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg transition-colors"
              >
                <FiSave size={16} />
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <FiX size={16} />
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {errors.general && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
            {errors.general}
          </div>
        )}

        {/* Profile Header Card */}
        <div className="bg-gray-900 rounded-xl border border-gray-700 p-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}            <div className="flex flex-col items-center gap-3">
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden relative">
                {profileData.avatar ? (
                  <img
                    src={profileData.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser size={32} className="text-gray-400" />
                )}
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Auto-generated Avatar</p>
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    <FiUser className="inline mr-1" size={14} />
                    Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-white text-lg font-semibold">{profileData.name}</p>
                  )}
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    <FiMail className="inline mr-1" size={14} />
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-300">{profileData.email}</p>
                  )}
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-300">{profileData.phone || "Not provided"}</p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-300">{profileData.location || "Not provided"}</p>
                  )}
                </div>
              </div>

              {/* Role and Department */}
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full capitalize">
                  <FiBriefcase className="inline mr-1" size={12} />
                  {user?.role?.replace('_', ' ')}
                </span>
                {profileData.department && (
                  <span className="text-gray-400 text-sm">{profileData.department}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-gray-900 rounded-xl border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Bio</h2>
          {isEditing ? (
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell us about yourself..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 h-24 resize-none"
            />
          ) : (
            <p className="text-gray-300">
              {profileData.bio || "No bio provided yet."}
            </p>
          )}
        </div>

        {/* Skills Section */}
        <div className="bg-gray-900 rounded-xl border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Skills</h2>
          {isEditing && (
            <div className="mb-4 flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                placeholder="Add a skill..."
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={addSkill}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {profileData.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-700 text-gray-200 text-sm rounded-full flex items-center gap-2"
              >
                {skill}
                {isEditing && (
                  <button
                    onClick={() => removeSkill(skill)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <FiX size={14} />
                  </button>
                )}
              </span>
            ))}
            {profileData.skills.length === 0 && (
              <p className="text-gray-400">No skills added yet.</p>
            )}          </div>
>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d
        </div>
      </div>
    </div>
  );
}
