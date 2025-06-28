const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");
const Task = require("./models/Task");
const TimeLog = require("./models/TimeLog");

async function setupDatabase() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://afterink:afterink123@cluster0.mongodb.net/afterink-dashboard?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log("✅ Connected to MongoDB successfully");

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log("🧹 Clearing existing data...");
    await User.deleteMany({});
    await Task.deleteMany({});
    await TimeLog.deleteMany({});
    console.log("✅ Existing data cleared");

    // Create test users
    console.log("👥 Creating test users...");
    
    const hashedPassword = await bcrypt.hash("TestPass123!", 10);
    
    const testUsers = [
      {
        name: "Test CEO",
        email: "ceo@afterink.com",
        password: hashedPassword,
        role: "ceo",
        bio: "Test CEO for Afterink Agency Dashboard",
        skills: ["Leadership", "Management", "Strategy"],
        phone: "+1234567890",
        location: "New York, NY",
        department: "Executive"
      },
      {
        name: "Test Founding Member",
        email: "founding@afterink.com",
        password: hashedPassword,
        role: "founding_member",
        bio: "Test Founding Member for Afterink Agency Dashboard",
        skills: ["Development", "Design", "Project Management"],
        phone: "+1234567891",
        location: "San Francisco, CA",
        department: "Development"
      },
      {
        name: "Test Freelancer",
        email: "freelancer@afterink.com",
        password: hashedPassword,
        role: "freelancer",
        bio: "Test Freelancer for Afterink Agency Dashboard",
        skills: ["React", "Node.js", "MongoDB"],
        phone: "+1234567892",
        location: "Remote",
        department: "Development"
      }
    ];

    const createdUsers = await User.insertMany(testUsers);
    console.log("✅ Test users created successfully");

    // Create sample tasks
    console.log("📋 Creating sample tasks...");
    
    const sampleTasks = [
      {
        title: "Website Redesign",
        description: "Complete redesign of company website with modern UI/UX",
        priority: "High",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: "Not Started",
        assignedTo: [createdUsers[1]._id, createdUsers[2]._id], // Founding member and freelancer
        createdBy: createdUsers[0]._id // CEO
      },
      {
        title: "Mobile App Development",
        description: "Develop iOS and Android apps for the platform",
        priority: "Medium",
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: "In Progress",
        assignedTo: [createdUsers[2]._id], // Freelancer
        createdBy: createdUsers[1]._id // Founding member
      },
      {
        title: "Marketing Strategy",
        description: "Develop comprehensive marketing strategy for Q4",
        priority: "High",
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: "Completed",
        assignedTo: [createdUsers[1]._id], // Founding member
        createdBy: createdUsers[0]._id // CEO
      }
    ];

    const createdTasks = await Task.insertMany(sampleTasks);
    console.log("✅ Sample tasks created successfully");

    // Create sample time logs
    console.log("⏰ Creating sample time logs...");
    
    const sampleTimeLogs = [
      {
        user: createdUsers[1]._id, // Founding member
        task: createdTasks[0]._id, // Website Redesign
        startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
        duration: 14400, // 4 hours
        status: "Completed"
      },
      {
        user: createdUsers[2]._id, // Freelancer
        task: createdTasks[1]._id, // Mobile App Development
        startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000),
        duration: 21600, // 6 hours
        status: "Completed"
      },
      {
        user: createdUsers[1]._id, // Founding member
        task: createdTasks[2]._id, // Marketing Strategy
        startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
        duration: 28800, // 8 hours
        status: "Completed"
      }
    ];

    await TimeLog.insertMany(sampleTimeLogs);
    console.log("✅ Sample time logs created successfully");

    console.log("\n🎉 Database setup completed successfully!");
    console.log("\n📋 Summary:");
    console.log(`   - Created ${createdUsers.length} test users`);
    console.log(`   - Created ${createdTasks.length} sample tasks`);
    console.log(`   - Created ${sampleTimeLogs.length} sample time logs`);
    
    console.log("\n🔑 Test Credentials:");
    console.log("   CEO: ceo@afterink.com / TestPass123!");
    console.log("   Founding Member: founding@afterink.com / TestPass123!");
    console.log("   Freelancer: freelancer@afterink.com / TestPass123!");

  } catch (error) {
    console.error("❌ Database setup failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

// Run the setup
setupDatabase(); 