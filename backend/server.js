// Server entry point - Updated to trigger restart
require("dotenv").config();
const connectDB = require("./src/config/db");
const app = require("./src/app");
const PORT = process.env.PORT || 5000;

console.log("🚀 Starting server...");
console.log("📝 Environment check:");
console.log("   PORT:", process.env.PORT);
console.log("   MONGO_URI exists:", !!process.env.MONGO_URI);
console.log("   JWT_SECRET exists:", !!process.env.JWT_SECRET);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 API available at http://localhost:${PORT}/api`);
    });
  })
  .catch((error) => {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});
