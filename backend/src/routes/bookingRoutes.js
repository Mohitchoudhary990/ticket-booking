const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");
const {
  createBooking,
  getMyBookings,
  cancelBooking
} = require("../controllers/bookingController");

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);

// Support both DELETE and POST for cancelling booking
router.delete("/:id", protect, cancelBooking);
router.post("/:id/cancel", protect, cancelBooking);

module.exports = router;
