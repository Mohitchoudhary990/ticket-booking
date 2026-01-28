import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers, updateUserRole } from "../services/adminService";
import "../styles/Admin.css";

function UserManagement() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [confirmDialog, setConfirmDialog] = useState({ show: false, user: null, newRole: false });

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
                navigate("/login");
            }
        }
    };

    const handleRoleToggle = (user) => {
        const currentUserId = sessionStorage.getItem("userId");
        const newAdminStatus = !user.isAdmin;

        // Prevent self-demotion
        if (user._id === currentUserId && !newAdminStatus) {
            setError("❌ You cannot remove your own admin privileges");
            setTimeout(() => setError(""), 3000);
            return;
        }

        setConfirmDialog({
            show: true,
            user: user,
            newRole: newAdminStatus
        });
    };

    const confirmRoleChange = async () => {
        const { user, newRole } = confirmDialog;
        setConfirmDialog({ show: false, user: null, newRole: false });
        setError("");
        setSuccess("");

        try {
            const response = await updateUserRole(user._id, newRole);
            setSuccess(`✅ ${response.message}`);

            // Update local state
            setUsers(users.map(u =>
                u._id === user._id ? { ...u, isAdmin: newRole } : u
            ));

            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Failed to update user role";
            setError(`❌ ${errorMsg}`);
            setTimeout(() => setError(""), 3000);
        }
    };

    const cancelRoleChange = () => {
        setConfirmDialog({ show: false, user: null, newRole: false });
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
            {success && <div className="success-message">{success}</div>}

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
                                <th>Role</th>
                                <th>Registered On</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`role-badge ${user.isAdmin ? 'admin' : 'user'}`}>
                                            {user.isAdmin ? '👑 Admin' : '👤 User'}
                                        </span>
                                    </td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            onClick={() => handleRoleToggle(user)}
                                            className={`role-toggle-btn ${user.isAdmin ? 'demote' : 'promote'}`}
                                        >
                                            {user.isAdmin ? '↓ Demote to User' : '↑ Promote to Admin'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Confirmation Dialog */}
            {confirmDialog.show && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>⚠️ Confirm Role Change</h3>
                        <p>
                            Are you sure you want to {confirmDialog.newRole ? 'promote' : 'demote'}{' '}
                            <strong>{confirmDialog.user?.name}</strong> to{' '}
                            {confirmDialog.newRole ? 'Admin' : 'User'}?
                        </p>
                        <div className="modal-actions">
                            <button onClick={confirmRoleChange} className="confirm-btn">
                                Yes, Change Role
                            </button>
                            <button onClick={cancelRoleChange} className="cancel-btn">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserManagement;
