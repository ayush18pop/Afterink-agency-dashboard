const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

async function createTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Check if user already exists
    const existingUser = await User.findOne({ email: "ceo@afterink.com" });
    if (existingUser) {
      console.log("Test user already exists!");
      console.log("Email: ceo@afterink.com");
      console.log("Password: TestPass123!");
      process.exit(0);
    }

    // Create test CEO user with compliant password
    const hashedPassword = await bcrypt.hash("TestPass123!", 10);
    
    const testUser = new User({
      name: "Test CEO",
      email: "ceo@afterink.com",
      password: hashedPassword,
      role: "ceo",
      bio: "Test CEO for Afterink Agency Dashboard",
      skills: ["Leadership", "Management", "Strategy"],
      phone: "+1234567890",
      location: "New York, NY",
      department: "Executive"
    });

    await testUser.save();
    console.log("✅ Test CEO user created successfully!");
    console.log("📧 Email: ceo@afterink.com");
    console.log("🔑 Password: TestPass123!");
    console.log("👤 Role: CEO");
    
    // Create test founding member
    const foundingMember = new User({
      name: "Test Founding Member",
      email: "founding@afterink.com",
      password: hashedPassword,
      role: "founding_member",
      bio: "Test Founding Member for Afterink Agency Dashboard",
      skills: ["Development", "Design", "Project Management"],
      phone: "+1234567891",
      location: "San Francisco, CA",
      department: "Development"
    });

    await foundingMember.save();
    console.log("✅ Test Founding Member created successfully!");
    console.log("📧 Email: founding@afterink.com");
    console.log("🔑 Password: TestPass123!");
    console.log("👤 Role: Founding Member");

    // Create test freelancer
    const freelancer = new User({
      name: "Test Freelancer",
      email: "freelancer@afterink.com",
      password: hashedPassword,
      role: "freelancer",
      bio: "Test Freelancer for Afterink Agency Dashboard",
      skills: ["React", "Node.js", "MongoDB"],
      phone: "+1234567892",
      location: "Remote",
      department: "Development"
    });

    await freelancer.save();
    console.log("✅ Test Freelancer created successfully!");
    console.log("📧 Email: freelancer@afterink.com");
    console.log("🔑 Password: TestPass123!");
    console.log("👤 Role: Freelancer");

    console.log("\n🎉 All test users created! You can now login with any of these accounts.");
    
  } catch (error) {
    console.error("❌ Error creating test user:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  }
}

createTestUser(); 