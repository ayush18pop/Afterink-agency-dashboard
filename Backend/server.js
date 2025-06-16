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

// Serve static files (for avatar uploads)
app.use("/uploads", express.static("uploads"));
app.get("/api/test", (req, res) => {
  res.send("Route working!");
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
// app.use("/api/users", profileRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/time", timeRoutes);
app.use("/api/dashboard", dashboardRoutes);

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
