const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/Booking");
const Event = require("../models/Event");
const User = require("../models/User");
const mongoose = require("mongoose");

// Debug: Check if credentials are set
console.log("🔑 Razorpay Credentials Check:");
console.log("   KEY_ID exists:", !!process.env.RAZORPAY_KEY_ID);
console.log("   KEY_SECRET exists:", !!process.env.RAZORPAY_KEY_SECRET);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

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

    // ✅ DIRECT BOOKING (Razorpay commented out for now)
    console.log("📝 Processing direct booking (no payment)");

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Reduce available seats and add to bookedSeats
      event.availableSeats -= seatsBooked;
      event.bookedSeats.push(...seatIds);
      await event.save({ session });

      // Create booking
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

      await session.commitTransaction();
      session.endSession();

      console.log("✅ Booking created successfully:", booking[0]._id);
      res.status(201).json({
        success: true,
        message: "🎉 Ticket booked successfully!",
        booking: booking[0]
      });
    } catch (dbError) {
      await session.abortTransaction();
      session.endSession();
      throw dbError;
    }

    /* ❌ RAZORPAY CODE COMMENTED OUT FOR NOW
    const amount = event.price * seatsBooked * 100; // paise

    console.log("📝 Creating Razorpay order:", { amount, currency: "INR" });

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    });

    console.log("✅ Order created successfully:", order.id);
    res.status(200).json(order);
    */

  } catch (error) {
    console.error("❌ Booking Error:");
    console.error("   Message:", error.message);
    console.error("   Code:", error.code);

    res.status(500).json({
      message: error.message || "Failed to create booking",
      details: error.code || "Unknown error"
    });
  }
};


exports.verifyPayment = async (req, res) => {
  // ❌ RAZORPAY VERIFICATION COMMENTED OUT FOR NOW
  // This will be used later when Razorpay is integrated

  res.status(200).json({
    message: "Payment verification skipped (direct booking mode)"
  });

  /* 
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      eventId,
      seatsBooked
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Missing payment details" });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // ✅ Payment verified → create booking
    const event = await Event.findById(eventId).session(session);
    if (!event) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.availableSeats < seatsBooked) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Not enough seats available" });
    }

    // Reduce seats
    event.availableSeats -= seatsBooked;
    await event.save({ session });

    // Create booking
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

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Payment verified and booking confirmed",
      booking: booking[0]
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Payment verification error:", error);
    res.status(500).json({ message: error.message });
  }
  */
};
