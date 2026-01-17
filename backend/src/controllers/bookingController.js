const Booking = require("../models/Booking");
const Event = require("../models/Event");
const mongoose = require("mongoose");

exports.createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { eventId, seatsBooked, seatIds } = req.body;

    // 1️⃣ Basic validation
    if (!eventId || !seatsBooked || !seatIds) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Event, seats, and seat IDs required" });
    }

    // Validate seatIds is an array
    if (!Array.isArray(seatIds) || seatIds.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Seat IDs must be a non-empty array" });
    }

    // Validate seats matches seatIds length
    if (seatsBooked !== seatIds.length) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Seats count must match seat IDs length" });
    }

    // Validate seats is a positive number
    if (typeof seatsBooked !== 'number' || seatsBooked < 1 || !Number.isInteger(seatsBooked)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Seats must be a positive integer" });
    }

    // Validate eventId format
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Invalid event ID" });
    }

    // 2️⃣ Find event
    const event = await Event.findById(eventId).session(session);
    if (!event) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Event not found" });
    }

    // 3️⃣ Check if any requested seats are already booked
    const alreadyBooked = seatIds.filter(seatId => event.bookedSeats.includes(seatId));
    if (alreadyBooked.length > 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: `Seats already booked: ${alreadyBooked.join(', ')}`,
        bookedSeats: alreadyBooked
      });
    }

    // 4️⃣ Check seat availability
    if (event.availableSeats < seatsBooked) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: `Not enough seats available. Only ${event.availableSeats} seats left`
      });
    }

    if (event.availableSeats === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Event is sold out" });
    }

    // 5️⃣ Update event - reduce seats and add to bookedSeats
    event.availableSeats -= seatsBooked;
    event.bookedSeats.push(...seatIds);
    await event.save({ session });

    // 6️⃣ Create booking
    const totalAmount = event.price * seatsBooked;

    const booking = await Booking.create(
      [
        {
          user: req.user._id,
          event: eventId,
          seatsBooked,
          seatIds,
          totalAmount
        }
      ],
      { session }
    );

    // 7️⃣ Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Booking confirmed",
      booking: booking[0]
    });

  } catch (error) {
    // ❌ Rollback everything
    await session.abortTransaction();
    session.endSession();

    res.status(400).json({ message: error.message });
  }
};

// GET LOGGED-IN USER BOOKINGS
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("event", "title date price")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//cancel bookings

exports.cancelBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const booking = await Booking.findById(req.params.id).session(session);

    if (!booking) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }

    if (booking.status === "CANCELLED") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    const event = await Event.findById(booking.event).session(session);

    // Restore seats and remove from bookedSeats
    event.availableSeats += booking.seatsBooked;
    event.bookedSeats = event.bookedSeats.filter(
      seatId => !booking.seatIds.includes(seatId)
    );
    await event.save({ session });

    booking.status = "CANCELLED";
    await booking.save({ session });

    await session.commitTransaction();
    session.endSession();

    console.log("✅ Booking cancelled:", req.params.id);
    res.status(200).json({
      message: "Booking cancelled successfully",
      booking: booking
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("❌ Cancel booking error:", error.message);
    res.status(400).json({ message: error.message });
  }
};
