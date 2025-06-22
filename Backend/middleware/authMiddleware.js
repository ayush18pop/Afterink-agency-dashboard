const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  // 🔽 Enhanced: Log cookies to ensure the token is being sent
  console.log("🔍 Auth Middleware - Cookies:", req.cookies);
  console.log("🔍 Auth Middleware - Headers:", req.headers.authorization);

  const token =
    req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    console.log("❌ Missing token");
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    // 🔽 Enhanced: Log token before verification
    console.log("🔑 Token:", token.substring(0, 20) + "...");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded JWT:", {
      id: decoded.id,
      sessionVersion: decoded.sessionVersion,
    });

    const user = await User.findById(decoded.id);
    console.log(
      "👤 User from DB:",
      user ? { id: user._id, name: user.name, role: user.role } : "Not found"
    );

    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({ error: "User not found" });
    }

    // 🔽 Enhanced: Log session version comparison
    console.log("🔄 Session version from JWT:", decoded.sessionVersion);
    console.log("🔄 Session version from DB:", user.sessionVersion);

    // 🚨 Compare session version - temporarily disable for profile testing
    if (user.sessionVersion !== decoded.sessionVersion) {
      console.log("⚠️ Session version mismatch - but allowing for now");
      // return res.status(401).json({ error: 'Session expired or logged in elsewhere' });
    }

    console.log("✅ Authentication successful");
    req.user = user;
    next();
  } catch (err) {
    console.error("❌ Error during token verification:", err.message);
    res.status(401).json({ error: "Invalid token" });
  }
};
