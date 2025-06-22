import React from "react";
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
            <Route path="/login" element={<LoginPage />} />

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
