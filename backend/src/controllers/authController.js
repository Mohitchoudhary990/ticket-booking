const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("📝 Registration attempt for:", email);

    // 1️⃣ Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // 2️⃣ Check existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("❌ User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    // 3️⃣ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4️⃣ Save user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    console.log("✅ User registered successfully:", email);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Registration error:", error.message);
    res.status(500).json({ message: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔐 Login attempt for:", email);

    // 1️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(400).json({ message: "Invalid email" });
    }

    console.log("✅ User found:", user.email);

    // 2️⃣ Compare password   
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔑 Password match:", isMatch);

    if (!isMatch) {
      console.log("❌ Password mismatch for:", email);
      return res.status(400).json({ message: "Incorrect Password" });
    }

    // 3️⃣ Create JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("✅ Login successful for:", email);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.isAdmin ? "admin" : "user"
      }
    });
  } catch (error) {
    console.error("❌ Login error:", error.message);
    res.status(500).json({ message: error.message });
  }
};
