import React, { useState } from "react";
import API from "../services/api";
import "../styles/EventCard.css";

const EventCard = ({ event, onBookingSuccess }) => {
  const [seats, setSeats] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBooking = async () => {
    // Validate seats before booking
    if (seats < 1) {
      alert("❌ Please select at least 1 seat");
      return;
    }

    if (seats > event.availableSeats) {
      alert(`❌ Only ${event.availableSeats} seats available`);
      setSeats(event.availableSeats);
      return;
    }

    setIsBooking(true);
    setBookingSuccess(false);
    try {
      // Direct booking without Razorpay
      const res = await API.post("/payment/create-order", {
        eventId: event._id,
        seatsBooked: seats
      });

      if (res.data.success) {
        // Show success state
        setBookingSuccess(true);
        setSeats(1);

        // Immediately refresh events to show updated seat count
        if (onBookingSuccess) {
          onBookingSuccess();
        }

        // Hide success message after 3 seconds
        setTimeout(() => setBookingSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Booking error:", error);
      const errorMsg = error.response?.data?.message || error.message || "Booking failed";
      alert("❌ " + errorMsg);

      // Refresh events if it's a seat availability error
      if (errorMsg.includes("seats") || errorMsg.includes("available")) {
        if (onBookingSuccess) {
          onBookingSuccess();
        }
      }
    } finally {
      setIsBooking(false);
    }
  };

  const handleSeatsChange = (e) => {
    const value = Number(e.target.value);

    // Prevent invalid values
    if (value < 1) {
      setSeats(1);
    } else if (value > event.availableSeats) {
      setSeats(event.availableSeats);
    } else {
      setSeats(value);
    }
  };

  const seatsLeft = event.availableSeats;
  const isLowSeats = seatsLeft < 5;
  const eventDate = new Date(event.date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="event-card">
      <h3>{event.title}</h3>
      <p>{event.description}</p>

      <div className="event-price">₹{event.price.toLocaleString()}</div>

      <div className="event-date">📅 {eventDate}</div>

      <div className="event-seats">
        <span className={`seats-info ${isLowSeats ? 'low' : ''}`}>
          🎫 {seatsLeft} {seatsLeft === 1 ? 'seat' : 'seats'} left
        </span>
      </div>

      {bookingSuccess && (
        <div className="booking-success-message">
          ✅ Booking successful! Check "My Bookings" to view details.
        </div>
      )}

      <div className="booking-section">
        <input
          type="number"
          min="1"
          max={event.availableSeats}
          value={seats}
          onChange={handleSeatsChange}
          className="seat-input"
          disabled={isBooking || event.availableSeats === 0}
        />
        <button
          onClick={handleBooking}
          disabled={event.availableSeats === 0 || isBooking || seats < 1}
          className="book-btn"
        >
          {isBooking ? 'Booking...' : (event.availableSeats === 0 ? 'Sold Out' : 'Book Now')}
        </button>
      </div>
    </div>
  );
};

export default EventCard;
