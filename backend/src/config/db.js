const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");
    console.log("   Database:", mongoose.connection.name);
  } catch (error) {
    console.error("❌ DB Connection Failed:", error.message);
    console.error("   Full error:", error);
    throw error; // Re-throw to be caught by server.js
  }
};

module.exports = connectDB;
