// Set environment variables
process.env.MONGO_URI = "mongodb+srv://afterink:afterink123@cluster0.mongodb.net/afterink-dashboard?retryWrites=true&w=majority";
process.env.JWT_SECRET = "your-super-secret-jwt-key-here-make-it-long-and-random";
process.env.PORT = 5000;
process.env.NODE_ENV = "development";

console.log("🔧 Environment variables set:");
console.log("📡 MONGO_URI:", process.env.MONGO_URI ? "Set" : "Not set");
console.log("🔐 JWT_SECRET:", process.env.JWT_SECRET ? "Set" : "Not set");
console.log("🚀 PORT:", process.env.PORT);
console.log("🌍 NODE_ENV:", process.env.NODE_ENV);

// Start the server
require('./server.js'); 