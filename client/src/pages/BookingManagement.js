import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBookings, cancelBooking } from "../services/adminService";
import "../styles/Admin.css";

function BookingManagement() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const data = await getAllBookings();
            setBookings(data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load bookings");
            setLoading(false);
            if (err.response?.status === 401 || err.response?.status === 403) {
                navigate("/login");
            }
        }
    };

    const handleCancelBooking = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) {
            return;
        }

        try {
            await cancelBooking(id);
            fetchBookings();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to cancel booking");
        }
    };

    const filteredBookings = bookings.filter(booking => {
        const searchLower = searchTerm.toLowerCase();
        return (
            booking.user?.name?.toLowerCase().includes(searchLower) ||
            booking.user?.email?.toLowerCase().includes(searchLower) ||
            booking.event?.title?.toLowerCase().includes(searchLower)
        );
    });

    if (loading) {
        return <div className="admin-loading">Loading bookings...</div>;
    }

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>📋 Booking Management</h1>
                <button onClick={() => navigate("/admin/dashboard")} className="admin-back-btn">
                    ← Back to Dashboard
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="admin-search-bar">
                <input
                    type="text"
                    placeholder="Search by user name, email, or event title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="admin-table-container">
                <h2>All Bookings ({filteredBookings.length})</h2>
                {filteredBookings.length === 0 ? (
                    <p className="no-data">No bookings found</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Event</th>
                                <th>Event Date</th>
                                <th>Seats</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Booked On</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map((booking) => (
                                <tr key={booking._id}>
                                    <td>{booking.user?.name || "N/A"}</td>
                                    <td>{booking.user?.email || "N/A"}</td>
                                    <td>{booking.event?.title || "N/A"}</td>
                                    <td>{booking.event?.date ? new Date(booking.event.date).toLocaleDateString() : "N/A"}</td>
                                    <td>{booking.seatsBooked}</td>
                                    <td>₹{booking.totalAmount}</td>
                                    <td>
                                        <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                                    <td className="table-actions">
                                        {booking.status === "CONFIRMED" && (
                                            <button
                                                onClick={() => handleCancelBooking(booking._id)}
                                                className="cancel-btn"
                                            >
                                                ❌ Cancel
                                            </button>
                                        )}
                                        {booking.status === "CANCELLED" && (
                                            <span className="cancelled-text">Cancelled</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default BookingManagement;
