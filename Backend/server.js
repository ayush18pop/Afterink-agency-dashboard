const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const taskRoutes = require("./routes/tasks");
const timeRoutes = require("./routes/time");
const dashboardRoutes = require("./routes/dashboard");
// const profileRoutes = require("./routes/profile");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["https://afterink.vercel.app", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
  })
);
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json({ 
    message: "Backend is working!", 
    timestamp: new Date().toISOString(),
    cors: "enabled",
    cookies: req.cookies ? Object.keys(req.cookies) : "no cookies"
  });
});

// Add a simple health check route
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "healthy",
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
// app.use("/api/users", profileRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/time", timeRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.error("Server error:", err);
  }
  res.status(500).json({ error: "Internal server error" });
});

// Start server function
const startServer = () => {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Server running on port ${port}`);
      console.log("MongoDB connection status:", mongoose.connection.readyState === 1 ? "Connected" : "Disconnected");
    }
  });
};

// Try to connect to MongoDB
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
    .then(() => {
      if (process.env.NODE_ENV === 'development') {
        console.log("MongoDB connected successfully");
      }
      startServer();
    })
    .catch((err) => {
      if (process.env.NODE_ENV === 'development') {
        console.error("MongoDB connection failed:", err.message);
        console.log("Starting server without MongoDB...");
      }
      startServer();
    });
} else {
  if (process.env.NODE_ENV === 'development') {
    console.log("No MongoDB URI provided, starting server without database...");
  }
  startServer();
}
