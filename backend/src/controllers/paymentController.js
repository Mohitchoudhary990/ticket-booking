const Booking = require("../models/Booking");
const Event = require("../models/Event");
const mongoose = require("mongoose");

exports.createOrder = async (req, res) => {
  try {
    const { eventId, seatsBooked, seatIds } = req.body;

    // Validate required fields
    if (!eventId || !seatsBooked || !seatIds) {
      return res.status(400).json({ message: "Event ID, seats, and seat IDs are required" });
    }

    // Validate seatIds is an array
    if (!Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({ message: "Seat IDs must be a non-empty array" });
    }

    // Validate seats matches seatIds length
    if (seatsBooked !== seatIds.length) {
      return res.status(400).json({ message: "Seats count must match seat IDs length" });
    }

    // Validate seats is a positive number
    if (typeof seatsBooked !== 'number' || seatsBooked < 1 || !Number.isInteger(seatsBooked)) {
      return res.status(400).json({ message: "Seats must be a positive integer" });
    }

    // Validate eventId format
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if any requested seats are already booked
    const alreadyBooked = seatIds.filter(seatId => event.bookedSeats.includes(seatId));
    if (alreadyBooked.length > 0) {
      return res.status(400).json({
        message: `Seats already booked: ${alreadyBooked.join(', ')}`,
        bookedSeats: alreadyBooked
      });
    }

    if (event.availableSeats < seatsBooked) {
      return res.status(400).json({
        message: `Not enough seats available. Only ${event.availableSeats} seats left`
      });
    }

    if (event.availableSeats === 0) {
      return res.status(400).json({ message: "Event is sold out" });
    }

    // ✅ DIRECT BOOKING (No Transactions for local reliability)
    console.log("📝 Processing direct booking");

    // 1. Update Event (Reserve Seats)
    event.availableSeats -= seatsBooked;
    event.bookedSeats.push(...seatIds);
    await event.save();

    // 2. Create Booking
    try {
      const totalAmount = event.price * seatsBooked;
      const booking = await Booking.create({
        user: req.user._id,
        event: eventId,
        seatsBooked,
        seatIds,
        totalAmount
      });

      console.log("✅ Booking created successfully:", booking._id);
      res.status(201).json({
        success: true,
        message: "🎉 Ticket booked successfully!",
        booking: booking
      });
    } catch (bookingError) {
      // Rollback event update if booking fails
      console.error("❌ Booking creation failed, rolling back event seats...");
      event.availableSeats += seatsBooked;
      event.bookedSeats = event.bookedSeats.filter(id => !seatIds.includes(id));
      await event.save();
      throw bookingError;
    }

  } catch (error) {
    console.error("❌ Booking Error:");
    console.error("   Message:", error.message);

    res.status(500).json({
      message: error.message || "Failed to create booking"
    });
  }
};
