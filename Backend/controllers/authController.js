const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

<<<<<<< HEAD
    // Password validation: 6+ chars for demo, 8+ with complexity for production
    const isProduction = process.env.NODE_ENV === 'production';
    let passwordValid = true;
    let passwordError = '';

    if (isProduction) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        passwordValid = false;
        passwordError = "Password must be at least 8 characters and include 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character.";
      }
    } else {
      // Demo environment: just require 6+ characters
      if (password.length < 6) {
        passwordValid = false;
        passwordError = "Password must be at least 6 characters long.";
      }
    }

    if (!passwordValid) {
      return res.status(400).json({ error: passwordError });
=======
    // Password validation: 8+ chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters and include 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character.",
      });
>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d
    }

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ error: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });

    res.status(201).json({ message: `${role} registered successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    // 🔐 Generate a new session version (timestamp)
    const sessionVersion = new Date().toISOString();
    user.sessionVersion = sessionVersion;
    await user.save();

    // 🪪 Include sessionVersion in JWT payload
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        sessionVersion,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // **Set JWT as HttpOnly cookie**
    res.cookie("token", token, {
      httpOnly: true,
<<<<<<< HEAD
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? "None" : "Lax",
=======
      secure: true,
      sameSite: "None",

>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Respond with complete user profile (never send password or token)
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio || "",
        skills: user.skills || [],
        avatar: user.avatar,
        phone: user.phone || "",
        location: user.location || "",
        department: user.department || "",
        joinDate: user.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
