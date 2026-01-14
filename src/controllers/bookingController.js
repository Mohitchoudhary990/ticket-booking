const Booking = require("../models/Booking");
const Event = require("../models/Event");

exports.createBooking = async (req, res) => {
  try {
    const { eventId, seatsBooked } = req.body;

    // 1️⃣ Basic validation
    if (!eventId || !seatsBooked) {
      return res.status(400).json({ message: "Event and seats required" });
    }

    // 2️⃣ Find event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 3️⃣ Check seat availability
    if (event.availableSeats < seatsBooked) {
      return res.status(400).json({ message: "Not enough seats available" });
    }
    
        // 5️⃣ Reduce seats
        event.availableSeats -= seatsBooked;
        await event.save();
// 4️⃣ Create booking
    const totalAmount = event.price * seatsBooked;

    const booking = await Booking.create(
      [
        {
          user: req.user._id,
          event: eventId,
          seatsBooked,
          totalAmount
        }
      ],
      { session }
    );

    // 5️⃣ Commit transaction
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
      throw new Error("Booking not found");
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      throw new Error("Not authorized");
    }

    if (booking.status === "CANCELLED") {
      throw new Error("Booking already cancelled");
    }

    const event = await Event.findById(booking.event).session(session);

    // Restore seats
    event.availableSeats += booking.seatsBooked;
    await event.save({ session });

    booking.status = "CANCELLED";
    await booking.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Booking cancelled successfully" });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(400).json({ message: error.message });
  }
};
