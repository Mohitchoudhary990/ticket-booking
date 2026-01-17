import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { createEvent, updateEvent, deleteEvent } from "../services/adminService";
import "../styles/Admin.css";

function EventManagement() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        price: "",
        totalSeats: ""
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/events");
            setEvents(response.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load events");
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            if (editingEvent) {
                await updateEvent(editingEvent._id, formData);
            } else {
                await createEvent(formData);
            }

            setShowForm(false);
            setEditingEvent(null);
            setFormData({ title: "", description: "", date: "", price: "", totalSeats: "" });
            fetchEvents();
        } catch (err) {
            setError(err.response?.data?.message || "Operation failed");
        }
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            description: event.description,
            date: new Date(event.date).toISOString().split('T')[0],
            price: event.price,
            totalSeats: event.totalSeats
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this event?")) {
            return;
        }

        try {
            await deleteEvent(id);
            fetchEvents();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete event");
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingEvent(null);
        setFormData({ title: "", description: "", date: "", price: "", totalSeats: "" });
    };

    if (loading) {
        return <div className="admin-loading">Loading events...</div>;
    }

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>🎪 Event Management</h1>
                <div>
                    <button onClick={() => navigate("/admin/dashboard")} className="admin-back-btn">
                        ← Back to Dashboard
                    </button>
                    {!showForm && (
                        <button onClick={() => setShowForm(true)} className="admin-primary-btn">
                            + Create New Event
                        </button>
                    )}
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {showForm && (
                <div className="admin-form-card">
                    <h2>{editingEvent ? "Edit Event" : "Create New Event"}</h2>
                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="title">Event Title *</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter event title"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="date">Event Date *</label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description *</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows="4"
                                placeholder="Enter event description"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="price">Price (₹) *</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    placeholder="0"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="totalSeats">Total Seats *</label>
                                <input
                                    type="number"
                                    id="totalSeats"
                                    name="totalSeats"
                                    value={formData.totalSeats}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" onClick={handleCancel} className="admin-secondary-btn">
                                Cancel
                            </button>
                            <button type="submit" className="admin-primary-btn">
                                {editingEvent ? "Update Event" : "Create Event"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="admin-table-container">
                <h2>All Events ({events.length})</h2>
                {events.length === 0 ? (
                    <p className="no-data">No events found. Create your first event!</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Date</th>
                                <th>Price</th>
                                <th>Seats</th>
                                <th>Available</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => (
                                <tr key={event._id}>
                                    <td>{event.title}</td>
                                    <td>{new Date(event.date).toLocaleDateString()}</td>
                                    <td>₹{event.price}</td>
                                    <td>{event.totalSeats}</td>
                                    <td>{event.availableSeats}</td>
                                    <td className="table-actions">
                                        <button onClick={() => handleEdit(event)} className="edit-btn">
                                            ✏️ Edit
                                        </button>
                                        <button onClick={() => handleDelete(event._id)} className="delete-btn">
                                            🗑️ Delete
                                        </button>
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

export default EventManagement;
