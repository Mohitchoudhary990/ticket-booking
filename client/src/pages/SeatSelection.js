import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/SeatSelection.css";

const SeatSelection = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [bookedSeats, setBookedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isBooking, setIsBooking] = useState(false);

    // Generate seat layout (6 rows x 12 seats)
    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    const seatsPerRow = 12;

    useEffect(() => {
        // Fetch event details
        API.get(`/events/${eventId}`)
            .then((res) => {
                setEvent(res.data);
                setBookedSeats(res.data.bookedSeats || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching event:", err);
                setLoading(false);
            });
    }, [eventId]);

    const handleSeatClick = (seatId) => {
        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter(s => s !== seatId));
        } else {
            setSelectedSeats([...selectedSeats, seatId]);
        }
    };

    const handleBooking = async () => {
        if (selectedSeats.length === 0) {
            alert("Please select at least one seat");
            return;
        }

        setIsBooking(true);
        try {
            const res = await API.post("/payment/create-order", {
                eventId: event._id,
                seatsBooked: selectedSeats.length,
                seatIds: selectedSeats
            });

            if (res.data.success) {
                alert(`✅ Booking successful!\\nSeats: ${selectedSeats.join(', ')}\\nBooking ID: ${res.data.booking._id}`);
                navigate("/bookings");
            }
        } catch (error) {
            console.error("Booking error:", error);
            alert("❌ " + (error.response?.data?.message || "Booking failed"));
        } finally {
            setIsBooking(false);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (!event) return <div className="error">Event not found</div>;

    const totalPrice = selectedSeats.length * event.price;

    return (
        <div className="seat-selection-page">
            {/* Header */}
            <div className="seat-header">
                <button className="back-btn" onClick={() => navigate("/events")}>
                    ← Back
                </button>
                <div className="event-info-header">
                    <h1>{event.title}</h1>
                    <p>STARLIGHT CINEMA • HALL 4 • {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="help-icon">?</div>
            </div>

            <div className="seat-content">
                {/* Seat Map */}
                <div className="seat-map-section">
                    <div className="screen-label">CINEMA SCREEN</div>
                    <div className="screen-line"></div>

                    <div className="seats-grid">
                        {rows.map((row) => (
                            <div key={row} className="seat-row">
                                <span className="row-label">{row}</span>
                                <div className="seats">
                                    {Array.from({ length: seatsPerRow }, (_, i) => {
                                        const seatNumber = i + 1;
                                        const seatId = `${row}-${seatNumber}`;
                                        const isSelected = selectedSeats.includes(seatId);
                                        const isReserved = bookedSeats.includes(seatId);

                                        return (
                                            <button
                                                key={seatId}
                                                className={`seat ${isSelected ? 'selected' : ''} ${isReserved ? 'reserved' : ''}`}
                                                onClick={() => !isReserved && handleSeatClick(seatId)}
                                                disabled={isReserved}
                                            >
                                                {isSelected && '✓'}
                                            </button>
                                        );
                                    })}
                                </div>
                                <span className="row-label">{row}</span>
                            </div>
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="legend">
                        <div className="legend-item">
                            <div className="legend-seat available"></div>
                            <span>Available</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-seat selected"></div>
                            <span>Selected</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-seat reserved"></div>
                            <span>Reserved</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-seat vip"></div>
                            <span>VIP</span>
                        </div>
                    </div>
                </div>

                {/* Booking Summary */}
                <div className="booking-summary">
                    <h2>{event.title}</h2>
                    <p className="event-details">
                        📅 {new Date(event.date).toLocaleDateString()}<br />
                        🕐 {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}<br />
                        STARLIGHT CINEMA • HALL 4
                    </p>

                    <div className="selected-seats-section">
                        <h3>SELECTED SEATS</h3>
                        {selectedSeats.length === 0 ? (
                            <p className="no-seats">No seats selected</p>
                        ) : (
                            selectedSeats.map((seat) => (
                                <div key={seat} className="selected-seat-item">
                                    <div className="seat-info">
                                        <span className="seat-icon">💺</span>
                                        <div>
                                            <div className="seat-name">Row {seat.split('-')[0]} - Seat {seat.split('-')[1]}</div>
                                            <div className="seat-type">STANDARD SEAT</div>
                                        </div>
                                    </div>
                                    <div className="seat-price">₹{event.price.toFixed(2)}</div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="total-section">
                        <div className="total-label">TOTAL PRICE</div>
                        <div className="total-info">
                            <div className="total-price">₹{totalPrice.toFixed(2)}</div>
                            <div className="total-seats">{selectedSeats.length} Ticket{selectedSeats.length !== 1 ? 's' : ''}</div>
                        </div>
                    </div>

                    <button
                        className="proceed-btn"
                        onClick={handleBooking}
                        disabled={selectedSeats.length === 0 || isBooking}
                    >
                        {isBooking ? 'PROCESSING...' : 'PROCEED TO PAYMENT →'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SeatSelection;

