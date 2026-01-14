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

router.delete("/:id", protect, cancelBooking);

module.exports = router;
