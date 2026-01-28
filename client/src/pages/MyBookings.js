import React, { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/MyBookings.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = () => {
    setLoading(true);
    setError(null);
    API.get("/bookings/my")
      .then((res) => {
        console.log("Bookings fetched:", res.data);
        setBookings(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching bookings:", err);
        const errorMsg = err.response?.data?.message || err.message;
        setError(errorMsg);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return <div className="loading-text">⏳ Loading your bookings...</div>;
  if (error) return <div className="error-text">❌ Error: {error}</div>;

  if (bookings.length === 0) {
    return (
      <div className="bookings-container">
        <h2>📋 My Bookings</h2>
        <div className="no-bookings">
          🎫 You haven't booked any tickets yet. Start exploring events!
        </div>
      </div>
    );
  }

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        const res = await API.post(`/bookings/${bookingId}/cancel`);

        // Refresh bookings list to get updated data
        fetchBookings();

        alert("✅ " + res.data.message + "\n\nSeats have been restored. The events page will show the updated seat count!");

      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || "Failed to cancel booking";
        alert("❌ " + errorMsg);
        console.error("Cancel booking error:", err);
      }
    }
  };

  return (
    <div className="bookings-container">
      <h2>📋 My Bookings</h2>
      <div className="bookings-list">
        {bookings.map((booking) => (
          <div key={booking._id} className="booking-item">
            <h3>{booking.event?.title || "Event"}</h3>

            <div className="booking-detail">
              <span className="booking-label">📅 Date</span>
              <span className="booking-value">
                {booking.event?.date
                  ? new Date(booking.event.date).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })
                  : 'N/A'}
              </span>
            </div>

            <div className="booking-detail">
              <span className="booking-label">🎫 Seats Booked</span>
              <span className="booking-value">{booking.seatsBooked}</span>
            </div>

            <div className="booking-detail">
              <span className="booking-label">💰 Total Amount</span>
              <span className="booking-value">₹{(booking.totalAmount || 0).toLocaleString()}</span>
            </div>

            <div className="booking-detail">
              <span className="booking-label">⏰ Booked On</span>
              <span className="booking-value">
                {new Date(booking.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>

            <div className={`booking-status ${booking.status === 'CONFIRMED' ? 'status-confirmed' : 'status-cancelled'}`}>
              {booking.status === 'CONFIRMED' ? '✅ Confirmed' : '❌ Cancelled'}
            </div>

            {booking.status === 'CONFIRMED' && (
              <button
                className="cancel-btn"
                onClick={() => handleCancelBooking(booking._id)}
              >
                Cancel Booking
              </button>
            )}


          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
