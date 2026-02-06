const express = require("express");
const cors = require("cors");

const eventRoutes = require("./routes/eventRoutes");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const app = express();

// CORS Configuration - Supports both localhost and production
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    process.env.FRONTEND_URL // Production frontend URL from Render env vars
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.get("/", (req, res) => {
  res.send("Ticket Booking API is running");
});

module.exports = app;
