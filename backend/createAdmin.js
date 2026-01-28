// Script to create an admin user
// Run this script once to create your first admin user
// Usage: node createAdmin.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./src/models/User");

const createAdminUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // Admin user details
        const adminData = {
            name: "Admin",
            email: "admin@ticketbooking.com",
            password: "admin123", // Change this to a secure password
            isAdmin: true
        };

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log("Admin user already exists!");
            console.log("Email:", adminData.email);
            process.exit(0);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminData.password, salt);

        // Create admin user
        const admin = new User({
            name: adminData.name,
            email: adminData.email,
            password: hashedPassword,
            isAdmin: true
        });

        await admin.save();

        console.log("✅ Admin user created successfully!");
        console.log("Email:", adminData.email);
        console.log("Password:", adminData.password);
        console.log("\n⚠️  Please change the password after first login!");
        console.log("\nYou can now login at: http://localhost:3000/login");

        process.exit(0);
    } catch (error) {
        console.error("Error creating admin user:", error.message);
        process.exit(1);
    }
};

createAdminUser();
