<<<<<<< HEAD
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FiUserPlus, FiUser, FiMail, FiShield, FiSave, FiArrowLeft, FiLoader, FiUsers, FiAward, FiLock, FiAlertCircle, FiCheck } from 'react-icons/fi';
import axios from '../../utils/axios';

export default function AddUserPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'freelancer',
    department: '',
    skills: []
  });
  const [errors, setErrors] = useState({});
  const [newSkill, setNewSkill] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
=======
import React, { useState } from "react";

import Sidebar from "../../components/Sidebar";
import axios from "../../utils/axios"; // Adjust the import path as necessary
export default function AddUserPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "freelancer",
  });
  const [message, setMessage] = useState(null);

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await axios.post('/api/users/add', formData);
      navigate('/ceo/dashboard');
    } catch (error) {
      console.error('Error creating user:', error);
      setErrors({ general: error.response?.data?.error || 'Failed to create user' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
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

  const roleInfo = getRoleInfo(formData.role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="glass-card rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                <FiUserPlus />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-1">Add New User</h1>
                <p className="text-gray-600">Invite team members to join AfterInk</p>
                <div className="flex items-center mt-2 text-blue-600">
                  <FiUsers className="mr-2" />
                  <span className="text-sm">Team management system</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/ceo/dashboard')}
              className="btn-premium-secondary flex items-center space-x-2"
            >
              <FiArrowLeft />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>

        {/* Form Section */}
        <div className="card-premium p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FiUser className="mr-2 text-blue-600" />
            User Information
          </h2>

          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center">
              <FiAlertCircle className="mr-2" />
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Full Name *
              </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
=======
    if (!passwordRegex.test(formData.password)) {
      setMessage(
        "Password must be at least 8 characters and include 1 uppercase, 1 lowercase, 1 digit, and 1 special character."
      );
      setTimeout(() => setMessage(null), 4000);
      return;
    }
    try {
      const res = await axios.post(
        "/api/auth/register",
        formData,
        { withCredentials: true }
      );

      console.log(res);
      setMessage("User created successfully.");
      setFormData({ name: "", email: "", password: "", role: "freelancer" });

      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to create user.");
      setTimeout(() => setMessage(null), 4000);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0f0f1a] text-white">
      {/* <Sidebar /> */}
      <div className="flex-1 p-10">
        <h2 className="text-3xl font-bold mb-8 text-white">Add New User</h2>

        <div className="bg-[#151526] p-10 rounded-2xl shadow-xl w-full max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-300">
                Name
              </label>
>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
<<<<<<< HEAD
                    className={`input-premium w-full pl-12 ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500/50' : ''}`}
                    placeholder="Enter full name"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-600 text-sm flex items-center">
                    <FiAlertCircle className="mr-1" />
                    {errors.name}
                  </p>
                )}
            </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Email Address *
              </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
=======
                required
                className="w-full px-4 py-3 rounded-lg bg-[#1e1e2f] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2962ff]"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-300">
                Email
              </label>
>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
<<<<<<< HEAD
                    className={`input-premium w-full pl-12 ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500/50' : ''}`}
                    placeholder="Enter email address"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-600 text-sm flex items-center">
                    <FiAlertCircle className="mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Password *
              </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
=======
                required
                className="w-full px-4 py-3 rounded-lg bg-[#1e1e2f] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2962ff]"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-300">
                Password
              </label>
>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
<<<<<<< HEAD
                    className={`input-premium w-full pl-12 ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500/50' : ''}`}
                    placeholder="Enter password"
                  />
                </div>
                {errors.password && (
                  <p className="text-red-600 text-sm flex items-center">
                    <FiAlertCircle className="mr-1" />
                    {errors.password}
                  </p>
                )}
            </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                Role
              </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiShield className="text-gray-400" />
                  </div>
=======
                required
                className="w-full px-4 py-3 rounded-lg bg-[#1e1e2f] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2962ff]"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-300">
                Role
              </label>
>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
<<<<<<< HEAD
                    className="input-premium w-full pl-12"
=======
                className="w-full px-4 py-3 rounded-lg bg-[#1e1e2f] text-white focus:outline-none focus:ring-2 focus:ring-[#2962ff]"
>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d
              >
                <option value="freelancer">Freelancer</option>
                <option value="founding_member">Founding Member</option>
                <option value="ceo">CEO</option>
              </select>
<<<<<<< HEAD
                </div>
              </div>
            </div>

            {/* Department */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="input-premium w-full"
                placeholder="Enter department (optional)"
              />
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Skills
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  className="input-premium flex-1"
                  placeholder="Add a skill and press Enter"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="btn-premium-secondary px-4"
                >
                  Add
                </button>
              </div>
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700"
                    >
                      {skill}
            <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-blue-500 hover:text-blue-700"
            >
                        ×
            </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Role Preview */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <FiShield className="mr-2 text-blue-600" />
                Role Preview
              </h3>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${roleInfo.color} text-white`}>
                  {roleInfo.title}
                </span>
                <span className="text-sm text-gray-600">{roleInfo.description}</span>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/ceo/dashboard')}
                className="btn-premium-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-premium flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="loading-premium w-4 h-4"></div>
                    <span>Creating User...</span>
                  </>
                ) : (
                  <>
                    <FiSave />
                    <span>Create User</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Role Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-premium p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FiAward className="text-purple-600 text-xl" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">CEO</h3>
            <p className="text-gray-600 text-sm">Full system access and management capabilities</p>
          </div>

          <div className="card-premium p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FiUsers className="text-blue-600 text-xl" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Founding Member</h3>
            <p className="text-gray-600 text-sm">Team management and task assignment</p>
          </div>

          <div className="card-premium p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FiUser className="text-green-600 text-xl" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Freelancer</h3>
            <p className="text-gray-600 text-sm">Task execution and time tracking</p>
          </div>
        </div>
=======
            </div>

            <button
              type="submit"
              className="w-full bg-[#2962ff] hover:bg-[#3b7bff] py-3 rounded-lg text-white font-semibold text-lg transition-colors duration-200"
            >
              Create User
            </button>

            {message && (
              <p
                className={`mt-4 text-sm text-center ${
                  message === "User created successfully."
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </div>
>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d
      </div>
    </div>
  );
}
