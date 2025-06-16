import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "../utils/axios";
import { FiEdit3, FiSave, FiX, FiUpload, FiUser, FiMail, FiBriefcase, FiAward, FiClock, FiTrendingUp } from "react-icons/fi";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
    skills: [],
    avatar: null,
    phone: "",
    location: "",
    department: "",
    joinDate: "",
  });
  const [newSkill, setNewSkill] = useState("");
  const [performanceMetrics, setPerformanceMetrics] = useState({
    tasksCompleted: 0,
    totalHoursWorked: 0,
    averageRating: 0,
    onTimeDelivery: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  // Initialize profile data from user context
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
  }, [user]);

  const fetchProfileData = async () => {
    if (!user?._id) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`/api/users/profile`, { withCredentials: true });
      const data = response.data;
      
      setProfileData(prev => ({
        ...prev,
        ...data.profile,
      }));
      setPerformanceMetrics(data.metrics || {});
      setRecentActivity(data.recentActivity || []);
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
    } finally {
      setLoading(false);
    }
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
      const formData = new FormData();
      
      // Append profile data
      Object.keys(profileData).forEach(key => {
        if (key === 'skills') {
          formData.append(key, JSON.stringify(profileData[key]));
        } else if (key === 'avatar' && profileData[key] instanceof File) {
          formData.append('avatar', profileData[key]);
        } else if (key !== 'avatar') {
          formData.append(key, profileData[key]);
        }
      });

      const response = await axios.put('/api/users/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });

      // Update user context with new data
      updateUser({
        ...user,
        ...response.data.user
      });

      setIsEditing(false);
      setPreviewImage(null);
    } catch (error) {
      console.error("Failed to save profile:", error);
      setErrors({ general: "Failed to save profile. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original data
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
    setIsEditing(false);
    setErrors({});
    setPreviewImage(null);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors({ avatar: "Image size should be less than 5MB" });
        return;
      }
      
      setProfileData(prev => ({ ...prev, avatar: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
      
      // Clear error
      setErrors(prev => ({ ...prev, avatar: null }));
    }
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

  const formatTime = (hours) => {
    return `${Math.round(hours)}h`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-lg">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          {!isEditing ? (
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
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                {previewImage || profileData.avatar ? (
                  <img
                    src={previewImage || (typeof profileData.avatar === 'string' ? profileData.avatar : '')}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser size={32} className="text-gray-400" />
                )}
              </div>
              {isEditing && (
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="flex items-center gap-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-sm text-white rounded cursor-pointer transition-colors"
                  >
                    <FiUpload size={14} />
                    Upload
                  </label>
                  {errors.avatar && (
                    <p className="text-red-400 text-xs mt-1">{errors.avatar}</p>
                  )}
                </div>
              )}
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
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-gray-900 rounded-xl border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            <FiTrendingUp className="inline mr-2" />
            Performance Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FiAward className="text-green-400" size={20} />
                <span className="text-sm text-gray-400">Tasks Completed</span>
              </div>
              <p className="text-2xl font-bold text-white">{performanceMetrics.tasksCompleted}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FiClock className="text-blue-400" size={20} />
                <span className="text-sm text-gray-400">Hours Worked</span>
              </div>
              <p className="text-2xl font-bold text-white">{formatTime(performanceMetrics.totalHoursWorked)}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FiTrendingUp className="text-yellow-400" size={20} />
                <span className="text-sm text-gray-400">Avg Rating</span>
              </div>
              <p className="text-2xl font-bold text-white">{performanceMetrics.averageRating.toFixed(1)}/5</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FiAward className="text-purple-400" size={20} />
                <span className="text-sm text-gray-400">On-Time Delivery</span>
              </div>
              <p className="text-2xl font-bold text-white">{performanceMetrics.onTimeDelivery}%</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-900 rounded-xl border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.description}</p>
                    <p className="text-gray-400 text-xs">{new Date(activity.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No recent activity to display.</p>
          )}
        </div>
      </div>
    </div>
  );
}
