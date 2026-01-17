import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getDashboardStats } from "../services/adminService";
import "../styles/Admin.css";

function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalEvents: 0,
        totalBookings: 0,
        totalUsers: 0,
        totalRevenue: 0,
        recentBookings: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await getDashboardStats();
            setStats(data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load dashboard stats");
            setLoading(false);
            if (err.response?.status === 401 || err.response?.status === 403) {
                navigate("/admin/login");
            }
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem("adminToken");
        navigate("/admin/login");
    };

    if (loading) {
        return <div className="admin-loading">Loading dashboard...</div>;
    }

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>📊 Admin Dashboard</h1>
                <button onClick={handleLogout} className="admin-logout-btn">Logout</button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="admin-stats-grid">
                <div className="stat-card stat-events">
                    <div className="stat-icon">🎫</div>
                    <div className="stat-info">
                        <h3>Total Events</h3>
                        <p className="stat-number">{stats.totalEvents}</p>
                    </div>
                </div>

                <div className="stat-card stat-bookings">
                    <div className="stat-icon">📅</div>
                    <div className="stat-info">
                        <h3>Total Bookings</h3>
                        <p className="stat-number">{stats.totalBookings}</p>
                    </div>
                </div>

                <div className="stat-card stat-users">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <h3>Total Users</h3>
                        <p className="stat-number">{stats.totalUsers}</p>
                    </div>
                </div>

                <div className="stat-card stat-revenue">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                        <h3>Total Revenue</h3>
                        <p className="stat-number">₹{stats.totalRevenue.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className="admin-navigation-grid">
                <Link to="/admin/events" className="admin-nav-card">
                    <div className="nav-card-icon">🎪</div>
                    <h3>Manage Events</h3>
                    <p>Create, edit, and delete events</p>
                </Link>

                <Link to="/admin/bookings" className="admin-nav-card">
                    <div className="nav-card-icon">📋</div>
                    <h3>Manage Bookings</h3>
                    <p>View and manage all bookings</p>
                </Link>

                <Link to="/admin/users" className="admin-nav-card">
                    <div className="nav-card-icon">👤</div>
                    <h3>View Users</h3>
                    <p>See all registered users</p>
                </Link>
            </div>

            <div className="recent-bookings-section">
                <h2>Recent Bookings</h2>
                {stats.recentBookings.length === 0 ? (
                    <p className="no-data">No recent bookings</p>
                ) : (
                    <div className="recent-bookings-list">
                        {stats.recentBookings.map((booking) => (
                            <div key={booking._id} className="recent-booking-item">
                                <div className="booking-info">
                                    <strong>{booking.user?.name || "Unknown User"}</strong>
                                    <span>{booking.event?.title || "Unknown Event"}</span>
                                </div>
                                <div className="booking-details">
                                    <span>{booking.seatsBooked} seats</span>
                                    <span className="booking-amount">₹{booking.totalAmount}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;
