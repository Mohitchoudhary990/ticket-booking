const express = require("express");
const cors = require("cors");

const eventRoutes = require("./routes/eventRoutes");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.get("/", (req, res) => {
  res.send("Ticket Booking API is running");
});

module.exports = app;
