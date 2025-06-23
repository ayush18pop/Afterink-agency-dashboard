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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`input-premium w-full ${errors.name ? 'border-red-300 focus:border-red-500' : ''}`}
                  placeholder="Enter full name"
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
                  value={formData.email}
                  onChange={handleChange}
                  className={`input-premium w-full ${errors.email ? 'border-red-300 focus:border-red-500' : ''}`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`input-premium w-full ${errors.password ? 'border-red-300 focus:border-red-500' : ''}`}
                placeholder="Enter password"
              />
              {errors.password && (
                <p className="text-red-600 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Role Selection */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                Role *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: 'freelancer', label: 'Freelancer' },
                  { value: 'founding_member', label: 'Founding Member' },
                  { value: 'ceo', label: 'CEO' }
                ].map((role) => (
                  <div
                    key={role.value}
                    className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all duration-300 ${
                      formData.role === role.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    onClick={() => handleChange({ target: { name: 'role', value: role.value } })}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        formData.role === role.value
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {formData.role === role.value && (
                          <FiCheck className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{role.label}</p>
                        <p className="text-sm text-gray-600">
                          {getRoleInfo(role.value).description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
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
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                Skills
              </label>
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
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={loading}
                className="btn-premium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin" />
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
      </div>
    </div>
  );
}
