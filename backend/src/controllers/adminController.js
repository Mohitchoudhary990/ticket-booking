const Event = require("../models/Event");
const Booking = require("../models/Booking");
const User = require("../models/User");

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
    try {
        const totalEvents = await Event.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const totalUsers = await User.countDocuments({ isAdmin: false });

        // Calculate total revenue
        const bookings = await Booking.find({ status: "CONFIRMED" });
        const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);

        // Get recent bookings
        const recentBookings = await Booking.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("user", "name email")
            .populate("event", "title date");

        res.json({
            totalEvents,
            totalBookings,
            totalUsers,
            totalRevenue,
            recentBookings
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching dashboard stats", error: error.message });
    }
};

// Create new event
exports.createEvent = async (req, res) => {
    try {
        const { title, description, date, price, totalSeats } = req.body;

        const event = new Event({
            title,
            description,
            date,
            price,
            totalSeats,
            availableSeats: totalSeats
        });

        await event.save();
        res.status(201).json({ message: "Event created successfully", event });
    } catch (error) {
        res.status(500).json({ message: "Error creating event", error: error.message });
    }
};

// Update event
exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, date, price, totalSeats } = req.body;

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Update fields
        event.title = title || event.title;
        event.description = description || event.description;
        event.date = date || event.date;
        event.price = price || event.price;

        // If totalSeats is updated, adjust availableSeats proportionally
        if (totalSeats && totalSeats !== event.totalSeats) {
            const bookedSeats = event.totalSeats - event.availableSeats;
            event.totalSeats = totalSeats;
            event.availableSeats = Math.max(0, totalSeats - bookedSeats);
        }

        await event.save();
        res.json({ message: "Event updated successfully", event });
    } catch (error) {
        res.status(500).json({ message: "Error updating event", error: error.message });
    }
};

// Delete event
exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if event has bookings
        const bookingCount = await Booking.countDocuments({ event: id });
        if (bookingCount > 0) {
            return res.status(400).json({
                message: "Cannot delete event with existing bookings. Cancel all bookings first."
            });
        }

        const event = await Event.findByIdAndDelete(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting event", error: error.message });
    }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("user", "name email")
            .populate("event", "title date price")
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bookings", error: error.message });
    }
};

// Cancel booking (admin)
exports.cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.status === "CANCELLED") {
            return res.status(400).json({ message: "Booking is already cancelled" });
        }

        // Update booking status
        booking.status = "CANCELLED";
        await booking.save();

        // Restore seats to event
        const event = await Event.findById(booking.event);
        if (event) {
            event.availableSeats += booking.seatsBooked;
            await event.save();
        }

        res.json({ message: "Booking cancelled successfully", booking });
    } catch (error) {
        res.status(500).json({ message: "Error cancelling booking", error: error.message });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ isAdmin: false })
            .select("-password")
            .sort({ createdAt: -1 });

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};
