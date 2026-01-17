import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/Events.css";

const Events = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = () => {
    setLoading(true);
    API.get("/events")
      .then((res) => {
        console.log("Events fetched:", res.data);

        // Filter by category if specified
        let filteredEvents = res.data;
        if (category) {
          filteredEvents = res.data.filter(event =>
            event.category?.toLowerCase() === category.toLowerCase()
          );
        }

        setEvents(filteredEvents);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, [category]);

  if (loading) return <div className="loading">⏳ Loading events...</div>;
  if (error) return <div className="error">❌ Error: {error}</div>;

  return (
    <div className="events-page">
      {/* Main Content */}
      <main className="events-main">
        <div className="events-intro">
          <p className="intro-label">MOVIES NOW SHOWING</p>
          <h1 className="intro-title">All Events</h1>
          <p className="intro-description">
            Discover the latest blockbusters and secure your seats instantly with our premium booking system.
          </p>
        </div>

        <div className="events-grid">
          {events.length === 0 ? (
            <div className="no-events">📭 No events available</div>
          ) : (
            events.map((event) => (
              <div key={event._id} className="event-card">
                <div className="event-poster">
                  <div className="poster-placeholder">
                    {event.title.substring(0, 1)}
                  </div>
                  <div className="event-badge">IMAX</div>
                </div>
                <div className="event-info">
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-genre">{event.description?.substring(0, 30) || 'SCI-FI THRILLER'}</p>
                  <div className="event-meta">
                    <div className="meta-item">
                      <span className="meta-icon">📅</span>
                      <span className="meta-text">{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-icon">💺</span>
                      <span className="meta-text">{event.availableSeats} SEATS</span>
                    </div>
                  </div>
                  <div className="event-footer">
                    <div className="event-price">₹{event.price}</div>
                    <button
                      className="book-btn"
                      onClick={() => navigate(`/seat-selection/${event._id}`)}
                      disabled={event.availableSeats === 0}
                    >
                      {event.availableSeats === 0 ? 'SOLD OUT' : 'BOOK NOW'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="events-footer">
        <div className="footer-logo">
          <span className="logo-icon">🎫</span>
          <span className="logo-text">TICKET<span className="logo-highlight">SYSTEM</span></span>
        </div>
        <div className="footer-links">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#help">Help Center</a>
          <a href="#contact">Contact Support</a>
        </div>
        <div className="footer-copyright">
          © 2025 TICKET SYSTEM GLOBAL
        </div>
      </footer>
    </div>
  );
};

export default Events;
