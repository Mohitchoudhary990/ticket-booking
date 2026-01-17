import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../services/adminService";
import "../styles/Admin.css";

function UserManagement() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getAllUsers();
            setUsers(data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load users");
            setLoading(false);
            if (err.response?.status === 401 || err.response?.status === 403) {
                navigate("/admin/login");
            }
        }
    };

    const filteredUsers = users.filter(user => {
        const searchLower = searchTerm.toLowerCase();
        return (
            user.name?.toLowerCase().includes(searchLower) ||
            user.email?.toLowerCase().includes(searchLower)
        );
    });

    if (loading) {
        return <div className="admin-loading">Loading users...</div>;
    }

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>👤 User Management</h1>
                <button onClick={() => navigate("/admin/dashboard")} className="admin-back-btn">
                    ← Back to Dashboard
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="admin-search-bar">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="admin-table-container">
                <h2>All Users ({filteredUsers.length})</h2>
                {filteredUsers.length === 0 ? (
                    <p className="no-data">No users found</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Registered On</th>
                                <th>Last Updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td>{new Date(user.updatedAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default UserManagement;
