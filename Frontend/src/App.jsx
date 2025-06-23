import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";

// CEO pages
import Dashboard from "./pages/CEO/Dashboard";
import Leaderboard from "./pages/CEO/Leaderboard";
import AddTaskPage from "./pages/CEO/AddTaskPage";
import AddUserPage from "./pages/CEO/AddUserPage";
import TopPerfomancePage from "./pages/TopPerfomancePage";
import CEOTasks from "./pages/CEO/CEOTasks";
import CEOLayout from "./pages/CEOLayout";
import CEOProfile from "./pages/CEO/CEOProfile";
// Founding-member layout & pages
import FoundingLayout from "./pages/Founding/FoundingLayout";
import MyTasks from "./pages/Founding/MyTasks";
import FreelancerAnalysis from "./pages/Founding/FreelancerAnalysis";
import AddFreelancerForm from "./pages/Founding/AddFreelancerForm";
import FoundingProfile from "./pages/Founding/FoundingProfile";
import { runAllTests } from "./test-utils";

// Simple test component
function ConnectionTest() {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🧪 Testing backend connection...');
      const axios = (await import('./utils/axios')).default;
      const response = await axios.get('/api/test');
      setTestResult(response.data);
      console.log('✅ Test response:', response.data);
    } catch (err) {
      console.error('❌ Test failed:', err);
      setError({
        message: err.message,
        status: err.response?.status,
        data: err.response?.data
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">🔧 Backend Connection Test</h2>
      
      <button 
        onClick={testConnection}
        disabled={loading}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </button>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h3 className="font-bold">❌ Connection Error</h3>
          <p><strong>Message:</strong> {error.message}</p>
          <p><strong>Status:</strong> {error.status}</p>
          {error.data && (
            <pre className="mt-2 text-sm bg-red-50 p-2 rounded">
              {JSON.stringify(error.data, null, 2)}
            </pre>
          )}
        </div>
      )}

      {testResult && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <h3 className="font-bold">✅ Test Response</h3>
          <pre className="mt-2 text-sm bg-green-50 p-2 rounded">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

// Route guards
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-white p-10">Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

function CEOOnlyRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-white p-10">Loading...</div>;
  return user?.role === "ceo" ? children : <Navigate to="/login" replace />;
}

function FoundingOnlyRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-white p-10">Loading...</div>;
  return user?.role === "founding_member" ? children : <Navigate to="/login" replace />;
}

function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-3 rounded-full shadow-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white hover:scale-110 transition-all duration-300 focus:outline-none"
      aria-label="Toggle theme"
      style={{ boxShadow: "0 4px 24px 0 rgba(139,92,246,0.15)" }}
    >
      {theme === "dark" ? (
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
      ) : (
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" /><path d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 6.95l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41" /></svg>
      )}
    </button>
  );
}

export default function App() {
  // Make test function available globally for testing
  React.useEffect(() => {
    window.testApp = runAllTests;
    console.log('🧪 Test function available: run window.testApp() in console');
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ThemeToggleButton />
          <Routes>
            {/* Public Route */}
            <Route path="/" element={<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">🚀 AfterInk Dashboard</h1>
                <p className="text-gray-600 mb-6 text-center">Welcome to the AfterInk Agency Dashboard</p>
                
                <div className="space-y-4">
                  <a href="/login" className="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Go to Login
                  </a>
                  <a href="/test" className="block w-full bg-green-600 text-white text-center py-3 px-4 rounded-lg hover:bg-green-700 transition-colors">
                    Test Backend Connection
                  </a>
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Demo Credentials:</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>CEO:</strong> ceo@afterink.com / TestPass123!</p>
                    <p><strong>Founding:</strong> founding@afterink.com / TestPass123!</p>
                    <p><strong>Freelancer:</strong> freelancer@afterink.com / TestPass123!</p>
                  </div>
                </div>
              </div>
            </div>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/test" element={<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">🔧 Backend Connection Test</h2>
                <button 
                  onClick={async () => {
                    try {
                      console.log('🧪 Testing backend connection...');
                      const axios = (await import('./utils/axios')).default;
                      const response = await axios.get('/api/test');
                      console.log('✅ Test response:', response.data);
                      alert('✅ Backend is working! Check console for details.');
                    } catch (err) {
                      console.error('❌ Test failed:', err);
                      alert(`❌ Connection failed: ${err.message}`);
                    }
                  }}
                  className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Test Backend Connection
                </button>
                <a href="/" className="block text-center text-blue-600 hover:text-blue-800">
                  ← Back to Home
                </a>
              </div>
            </div>} />

            {/* Protected Profile Route - Accessible to all authenticated users */}
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

            {/* CEO Routes */}
            <Route path="/ceo" element={<CEOOnlyRoute><CEOLayout /></CEOOnlyRoute>}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="add-task" element={<AddTaskPage />} />
              <Route path="add-user" element={<AddUserPage />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="top" element={<TopPerfomancePage />} />
              <Route path="tasks" element={<CEOTasks />} />
              <Route path="profile" element={<CEOProfile />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* Founding Member Routes */}
            <Route path="/founding" element={<FoundingOnlyRoute><FoundingLayout /></FoundingOnlyRoute>}>
              <Route path="tasks" element={<MyTasks />} />
              <Route path="analysis" element={<FreelancerAnalysis />} />
              <Route path="add-user" element={<AddFreelancerForm />} />
              <Route path="profile" element={<FoundingProfile />} />
              <Route index element={<Navigate to="tasks" replace />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
