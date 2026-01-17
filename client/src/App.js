import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import SeatSelection from "./pages/SeatSelection";
import MyBookings from "./pages/MyBookings";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import EventManagement from "./pages/EventManagement";
import BookingManagement from "./pages/BookingManagement";
import UserManagement from "./pages/UserManagement";

import "./styles/App.css";

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem("token"));

  // Check if we're on login or register page
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  // Listen for storage changes to update login state
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!sessionStorage.getItem("token"));
    };

    // Check on mount
    checkAuth();

    // Listen for custom event when login happens
    window.addEventListener("loginStateChange", checkAuth);

    return () => {
      window.removeEventListener("loginStateChange", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  // Check if we're on admin page
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="app-container">
      {isAuthPage || isAdminPage ? (
        // Minimal header for login/register/admin pages
        isAuthPage && (
          <header className="minimal-header">
            <h1>🎫 Ticket Booking System</h1>
          </header>
        )
      ) : (
        // Full header for authenticated pages
        <header>
          <div className="header-content">
            <h1>🎫 Ticket Booking System</h1>

            <nav className="nav-links">
              {!isLoggedIn ? (
                <>
                  <Link to="/login" className="nav-link">Login</Link>
                  <Link to="/register" className="nav-link">Register</Link>
                </>
              ) : (
                <>
                  <Link to="/events" className="nav-link">Events</Link>
                  <Link to="/bookings" className="nav-link">My Bookings</Link>
                  <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
                </>
              )}
            </nav>
          </div>
        </header>
      )}

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to={isLoggedIn ? "/events" : "/login"} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Routes */}
          <Route path="/events" element={isLoggedIn ? <Events /> : <Navigate to="/login" />} />
          <Route path="/events/:category" element={isLoggedIn ? <Events /> : <Navigate to="/login" />} />
          <Route path="/seat-selection/:eventId" element={isLoggedIn ? <SeatSelection /> : <Navigate to="/login" />} />
          <Route path="/bookings" element={isLoggedIn ? <MyBookings /> : <Navigate to="/login" />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/events" element={<EventManagement />} />
          <Route path="/admin/bookings" element={<BookingManagement />} />
          <Route path="/admin/users" element={<UserManagement />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
