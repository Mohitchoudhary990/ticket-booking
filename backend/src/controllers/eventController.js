const Event = require("../models/Event");

// CREATE EVENT
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, price, totalSeats } = req.body;

    // 1️⃣ Validate input
    if (!title || !description || !date || !price || !totalSeats) {
      return res.status(400).json({ message:"All fields are required" });
    }

    // 2️⃣ Create event
    const event = await Event.create({
      title,
      description,
      date,
      price,
      totalSeats,
      availableSeats: totalSeats // IMPORTANT
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL EVENTS
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE EVENT BY ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
