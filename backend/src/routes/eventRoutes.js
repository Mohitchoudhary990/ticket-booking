const express = require("express");
const router = express.Router();

const {
  createEvent,
  getAllEvents,
  getEventById
} = require("../controllers/eventController");

router.post("/", createEvent);
router.get("/", getAllEvents);
router.get("/:id", getEventById);

module.exports = router;
