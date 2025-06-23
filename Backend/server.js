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
  res.send("Route working!");
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
// app.use("/api/users", profileRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/time", timeRoutes);
app.use("/api/dashboard", dashboardRoutes);

<<<<<<< HEAD
// Start server even if MongoDB fails
const startServer = () => {
  app.listen(5000, () => {
    console.log("Server running on port 5000");
    console.log("MongoDB connection status:", mongoose.connection.readyState === 1 ? "Connected" : "Disconnected");
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
      console.log("MongoDB connected successfully");
      startServer();
    })
    .catch((err) => {
      console.error("MongoDB connection failed:", err.message);
      console.log("Starting server without MongoDB...");
      startServer();
    });
} else {
  console.log("No MongoDB URI provided, starting server without database...");
  startServer();
}
=======
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.error(err));
>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d
