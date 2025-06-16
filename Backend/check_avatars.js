const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

async function checkAvatars() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const users = await User.find({
      avatar: { $exists: true, $ne: null },
    }).select("name email avatar");
    console.log(`Found ${users.length} users with avatars:`);

    users.forEach((user) => {
      console.log(`\nUser: ${user.name} (${user.email})`);
      if (user.avatar) {
        if (user.avatar.startsWith("data:")) {
          console.log("Avatar type: Base64 (stored in database)");
          console.log(`Avatar size: ${user.avatar.length} characters`);
          console.log(`Avatar preview: ${user.avatar.substring(0, 50)}...`);
        } else {
          console.log("Avatar type: File Path");
          console.log(`Avatar path: ${user.avatar}`);
        }
      }
      console.log("---");
    });

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkAvatars();
