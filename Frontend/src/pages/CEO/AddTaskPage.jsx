import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FiPlus, FiTarget, FiUser, FiCalendar, FiFileText, FiSave, FiArrowLeft, FiLoader, FiUsers, FiClock, FiAlertCircle } from 'react-icons/fi';
import axios from '../../utils/axios';

export default function AddTaskPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'Medium',
    dueDate: '',
    status: 'Not Started'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Use the correct endpoint for getting member names
      const response = await axios.get('/api/tasks/all-names');
      console.log("👥 Fetched users:", response.data.members);
      setUsers(response.data.members);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback to the old endpoint if the new one fails
      try {
        const fallbackResponse = await axios.get('/api/users');
        console.log("👥 Fallback - Fetched users:", fallbackResponse.data);
        setUsers(fallbackResponse.data);
      } catch (fallbackError) {
        console.error('Fallback error fetching users:', fallbackError);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Task description is required';
    }
    
    if (!formData.assignedTo) {
      newErrors.assignedTo = 'Please assign the task to someone';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    console.log("📝 Form Data to Send:", formData);
    
    setLoading(true);
    try {
      const response = await axios.post('/api/tasks/create', formData);
      console.log("✅ Task Created Successfully:", response.data);
      navigate('/ceo/tasks');
    } catch (error) {
      console.error('❌ Error creating task:', error);
      console.error('❌ Error response:', error.response?.data);
      setErrors({ general: error.response?.data?.error || 'Failed to create task' });
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="glass-card rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                <FiPlus />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-1">Create New Task</h1>
                <p className="text-gray-600">Assign tasks to team members and track progress</p>
                <div className="flex items-center mt-2 text-blue-600">
                  <FiTarget className="mr-2" />
                  <span className="text-sm">Task management system</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/ceo/tasks')}
              className="btn-premium-secondary flex items-center space-x-2"
            >
              <FiArrowLeft />
              <span>Back to Tasks</span>
            </button>
          </div>
        </div>

        {/* Form Section */}
        <div className="card-premium p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FiFileText className="mr-2 text-blue-600" />
            Task Details
          </h2>

          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center">
              <FiAlertCircle className="mr-2" />
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Task Title */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Task Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`input-premium w-full ${errors.title ? 'border-red-300 focus:border-red-500' : ''}`}
                placeholder="Enter task title"
              />
              {errors.title && (
                <p className="text-red-600 text-sm">{errors.title}</p>
              )}
            </div>

            {/* Task Description */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`input-premium w-full ${errors.description ? 'border-red-300 focus:border-red-500' : ''}`}
                placeholder="Describe the task in detail"
              />
              {errors.description && (
                <p className="text-red-600 text-sm">{errors.description}</p>
              )}
            </div>

            {/* Assigned To */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Assign To *
              </label>
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className={`input-premium w-full ${errors.assignedTo ? 'border-red-300 focus:border-red-500' : ''}`}
              >
                <option value="">Select team member</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
              {errors.assignedTo && (
                <p className="text-red-600 text-sm">{errors.assignedTo}</p>
              )}
            </div>

            {/* Priority and Due Date Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Priority */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="input-premium w-full"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Due Date *
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className={`input-premium w-full ${errors.dueDate ? 'border-red-300 focus:border-red-500' : ''}`}
                />
                {errors.dueDate && (
                  <p className="text-red-600 text-sm">{errors.dueDate}</p>
                )}
              </div>
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
                    <span>Creating Task...</span>
                  </>
                ) : (
                  <>
                    <FiSave />
                    <span>Create Task</span>
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
