<<<<<<< HEAD
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiLoader, FiArrowRight, FiShield, FiZap } from 'react-icons/fi';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate('/ceo/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8 fade-in">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <FiShield className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600 text-lg">Sign in to your AfterInk dashboard</p>
        </div>

        {/* Login Form */}
        <div className="glass-card rounded-3xl p-8 shadow-2xl slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-premium w-full pl-12 pr-4"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="input-premium w-full pl-12 pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-premium w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <FiArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Demo Credentials */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <FiZap className="mr-2 text-blue-500" />
              Demo Credentials
            </h3>
            <div className="space-y-1 text-xs text-gray-600">
              <p><strong>CEO:</strong> ceo@afterink.com / TestPass123!</p>
              <p><strong>Founding:</strong> founding@afterink.com / TestPass123!</p>
              <p><strong>Freelancer:</strong> freelancer@afterink.com / TestPass123!</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>© 2024 AfterInk Agency. All rights reserved.</p>
        </div>
      </div>
=======
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../utils/axios";
import logo from "../assets/logo.png"; // Adjust path to your logo

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const { user, login } = useAuth();
  const navigate = useNavigate();

  // ✅ Auto redirect based on role
  useEffect(() => {
    if (!user) return;
    if (user.role === "ceo") {
      navigate("/ceo/dashboard");
    } else if (user.role === "founding_member") {
      navigate("/founding/tasks");
    }
  }, [user, navigate]);

  // ✅ Handle login submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBtnLoading(true);
    try {
      const res = await axios.post("/api/auth/login", { email, password }, { withCredentials: true });
      login(res.data.user); // this updates context & triggers redirect
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Login failed");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#15151b] relative overflow-hidden">
      {/* Subtle background dots */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg className="w-full h-full" width="100%" height="100%">
          <defs>
            <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="#2a2a35" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <form
        onSubmit={handleSubmit}
        className="z-10 w-full max-w-md mx-auto rounded-2xl shadow-2xl p-8 backdrop-blur-xl bg-gradient-to-br from-[#1a1b23] to-[#20212a] border border-[#24243a]/60 relative"
        style={{
          boxShadow: "0 4px 32px 0 rgba(30,30,50,0.45), 0 1.5px 5px 0 rgba(0,0,0,0.18)",
        }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src={logo}
            alt="AfterInk Logo"
            className="w-14 h-14 rounded-xl border border-[#34354a] shadow-lg bg-[#23233b] p-2"
          />
        </div>

        {/* Headings */}
        <h1 className="text-center text-2xl font-semibold text-gray-100">Welcome to AfterInk</h1>
        <p className="text-center text-gray-400 text-sm mb-6">Creative Agency Dashboard</p>

        {/* Error */}
        {error && (
          <p className="text-red-500 mb-4 text-center text-sm">{error}</p>
        )}

        {/* Email Input */}
        <div className="mb-4">
          <label className="text-gray-300 text-sm mb-1 block">Email</label>
          <div className="relative">
            <input
              type="email"
              autoFocus
              required
              placeholder="Enter your email address..."
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[#191923] border border-[#28283c] text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#76aaff] transition"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#76aaff]">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 4h16v16H4z" />
                <path d="M22 6.5l-10 7L2 6.5" />
              </svg>
            </span>
          </div>
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label className="text-gray-300 text-sm mb-1 block">Password</label>
          <input
            type="password"
            required
            placeholder="Enter your password..."
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-[#191923] border border-[#28283c] text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#76aaff] transition"
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={btnLoading}
          className="w-full py-2 rounded-lg bg-[#76aaff] hover:bg-[#4e77e8] text-gray-900 font-semibold text-base shadow-lg transition disabled:opacity-50"
        >
          {btnLoading ? "Signing In..." : "Sign In"}
        </button>
      </form>
>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d
    </div>
  );
}
