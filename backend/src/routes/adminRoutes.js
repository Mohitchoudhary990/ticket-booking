const express = require("express");
const router = express.Router();
const adminAuth = require("../middlewares/adminAuth");
const adminController = require("../controllers/adminController");

// All routes require admin authentication
router.use(adminAuth);

// Dashboard
router.get("/stats", adminController.getDashboardStats);

// Event management
router.post("/events", adminController.createEvent);
router.put("/events/:id", adminController.updateEvent);
router.delete("/events/:id", adminController.deleteEvent);

// Booking management
router.get("/bookings", adminController.getAllBookings);
router.delete("/bookings/:id", adminController.cancelBooking);

// User management
router.get("/users", adminController.getAllUsers);
router.patch("/users/:id/role", adminController.updateUserRole);

module.exports = router;
