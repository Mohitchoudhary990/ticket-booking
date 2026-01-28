# Backend Debugging Guide

## Issue Summary
The backend server is not starting properly and showing no console output.

## Identified Problems

### 1. Server Not Producing Console Output
- Running `npm run dev` or `node server.js` produces no output
- Server exits immediately with code 0
- This typically indicates:
  - MongoDB connection failure
  - Missing environment variables
  - Silent crash during startup

### 2. Possible Causes

#### MongoDB Connection Issue
The `.env` file contains:
```
MONGO_URI=mongodb+srv://mohit233choudhary:mohit123@cluster0.o0f36.mongodb.net/
```

**Problems:**
- Missing database name in the connection string
- Should be: `mongodb+srv://mohit233choudhary:mohit123@cluster0.o0f36.mongodb.net/ticketbooking`
- MongoDB might be rejecting the connection silently

#### Environment Variables
```env
PORT=5000
MONGO_URI=mongodb+srv://mohit233choudhary:mohit123@cluster0.o0f36.mongodb.net/
JWT_SECRET=ewdcrtfvbghnjm
RAZORPAY_KEY_ID=rzp_test_gfds      # Incomplete
RAZORPAY_KEY_SECRET=fcghjb         # Incomplete
```

## Solutions

### Fix 1: Update MongoDB Connection String
Add database name to the MONGO_URI:
```env
MONGO_URI=mongodb+srv://mohit233choudhary:mohit123@cluster0.o0f36.mongodb.net/ticketbooking?retryWrites=true&w=majority
```

### Fix 2: Add Better Error Handling in server.js
The current `server.js` doesn't have proper error handling. Update it to:

```javascript
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
```

### Fix 3: Update db.js for Better Error Messages
```javascript
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");
    console.log("   URI:", process.env.MONGO_URI?.substring(0, 30) + "...");
    
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
```

## Testing Steps

1. **Update `.env` file** with correct MongoDB URI
2. **Update `server.js`** with better error handling
3. **Update `src/config/db.js`** with logging
4. **Restart the server**: `node server.js`
5. **Check console output** for connection status

## Expected Output After Fixes

```
🚀 Starting server...
📝 Environment check:
   PORT: 5000
   MONGO_URI exists: true
   JWT_SECRET exists: true
🔌 Connecting to MongoDB...
   URI: mongodb+srv://mohit233choudhary...
✅ MongoDB Connected
   Database: ticketbooking
✅ Server running on port 5000
🌐 API available at http://localhost:5000/api
```

## Login Issue Analysis

Once the server is running, the login issue could be caused by:

1. **Password Hashing Mismatch**
   - User registered with one version of bcrypt
   - Trying to login with different version
   - **Solution**: Re-register the user

2. **Email Case Sensitivity**
   - MongoDB stores email in lowercase (schema has `lowercase: true`)
   - Frontend might be sending mixed case
   - **Solution**: Already handled in schema

3. **Whitespace in Input**
   - Extra spaces in email or password
   - **Solution**: Add `.trim()` to inputs in frontend

## Events Not Showing Issue

After successful login, events might not show because:

1. **No Events in Database**
   - Database is empty
   - **Solution**: Create events via admin panel or directly in MongoDB

2. **CORS Issue**
   - Frontend can't reach backend
   - **Solution**: Already configured in `app.js`

3. **Token Not Being Sent**
   - Authorization header missing
   - **Solution**: Already handled in `api.js` interceptor

4. **Protected Route Issue**
   - Events endpoint might require authentication
   - **Solution**: Check if `/api/events` route has `protect` middleware

## Next Steps

1. Fix MongoDB connection string
2. Add error logging to server.js
3. Restart server and verify it starts
4. Test registration and login
5. Create test events if database is empty
6. Verify events display on frontend
