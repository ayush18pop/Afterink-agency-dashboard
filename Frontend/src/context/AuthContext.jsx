import { createContext, useContext, useState, useEffect } from "react";
import axios from "../utils/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
    
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored && stored !== "undefined") {
        setUser(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to parse user from localStorage:", err);
      localStorage.removeItem("user"); // optional: clear bad value
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      const userInfo = response.data.user;
      setUser(userInfo);
      localStorage.setItem("user", JSON.stringify(userInfo));
      return userInfo;
    } catch (error) {
      throw error;
    }
  };

  const updateUser = (updatedUserInfo) => {
    setUser(updatedUserInfo);
    localStorage.setItem("user", JSON.stringify(updatedUserInfo));
  };
  
  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
