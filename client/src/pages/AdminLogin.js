import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Admin.css";

function AdminLogin() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", formData);

            // Check if user is admin
            const token = response.data.token;

            // Decode token to check admin status (simple check)
            // In production, you should verify this on the backend
            const payload = JSON.parse(atob(token.split('.')[1]));

            // Make a test request to admin endpoint to verify admin access
            try {
                await axios.get("http://localhost:5000/api/admin/stats", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // If successful, user is admin
                sessionStorage.setItem("adminToken", token);
                navigate("/admin/dashboard");
            } catch (adminError) {
                setError("Access denied. Admin privileges required.");
                setLoading(false);
                return;
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">
                <div className="admin-login-header">
                    <h1>🔐 Admin Portal</h1>
                    <p>Ticket Booking System Administration</p>
                </div>

                <form onSubmit={handleSubmit} className="admin-login-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="admin@example.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    <button type="submit" className="admin-login-btn" disabled={loading}>
                        {loading ? "Authenticating..." : "Login to Admin Panel"}
                    </button>
                </form>

                <div className="admin-login-footer">
                    <p>Authorized personnel only</p>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;
