const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["ceo", "founding_member", "freelancer"] },
    bio: { type: String, maxlength: 500 },
    skills: [{ type: String }],
    avatar: String,
    phone: String,
    location: String,
    department: String,
    sessionVersion: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
