const mongoose = require("mongoose");
const User = require("./models/User");
const { createAvatar } = require("@dicebear/core");
const { personas } = require("@dicebear/collection");
require("dotenv").config();

// Helper function to generate random avatar using UI-Avatars service
const generateRandomAvatar = (seed) => {
  try {
    // Use the user's name if available, otherwise use email
    const name = seed.includes("@") ? seed.split("@")[0] : seed;

    // Generate random colors
    const colors = [
      "3B82F6",
      "8B5CF6",
      "EF4444",
      "10B981",
      "F59E0B",
      "EC4899",
      "6366F1",
      "14B8A6",
    ];
    const backgrounds = [
      "F1F5F9",
      "F8FAFC",
      "EDE9FE",
      "FEF2F2",
      "ECFDF5",
      "FFFBEB",
      "FCE7F3",
      "EEF2FF",
    ];

    const randomColor = colors[Math.abs(hashCode(seed)) % colors.length];
    const randomBg =
      backgrounds[Math.abs(hashCode(seed + "bg")) % backgrounds.length];

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&size=128&background=${randomBg}&color=${randomColor}&bold=true&format=png`;
  } catch (error) {
    console.error("Error generating avatar:", error);
    // Fallback
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      seed
    )}&size=128&background=random`;
  }
};

// Simple hash function for consistent random generation
const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash;
};

async function updateExistingAvatars() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Find all users
    const users = await User.find({}).select("name email avatar");
    console.log(`Found ${users.length} users to update:`);

    for (const user of users) {
      console.log(`\nUpdating avatar for: ${user.name} (${user.email})`);

      // Generate new random avatar using user's name as seed for better avatars
      const newAvatar = generateRandomAvatar(user.name || user.email);

      // Update user with new avatar
      await User.findByIdAndUpdate(user._id, { avatar: newAvatar });

      console.log(`✅ Avatar updated successfully`);
      console.log(
        `Avatar type: ${newAvatar.startsWith("data:") ? "Base64" : "URL"}`
      );
      console.log(`Avatar preview: ${newAvatar.substring(0, 50)}...`);
    }

    console.log("\n🎉 All users updated with random avatars!");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

updateExistingAvatars();
