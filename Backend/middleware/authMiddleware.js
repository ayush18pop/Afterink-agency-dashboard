const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  const token =
    req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Check session version for security
    if (user.sessionVersion !== decoded.sessionVersion) {
      return res.status(401).json({ error: 'Session expired or logged in elsewhere' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Auth middleware error:", err.message);
    }
    res.status(401).json({ error: "Invalid token" });
  }
};
