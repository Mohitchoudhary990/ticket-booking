import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/Auth.css";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const res = await API.post("/auth/login", form);

      // Save token
      sessionStorage.setItem("token", res.data.token);

      // Save user info
      if (res.data.user) {
        sessionStorage.setItem("userRole", res.data.user.role || "user");
        sessionStorage.setItem("userName", res.data.user.name);
      }

      setMessage("✅ Login successful!");
      setForm({ email: "", password: "" });

      // Notify app
      window.dispatchEvent(new Event("loginStateChange"));

      // Redirect after delay
      setTimeout(() => {
        const userRole = res.data.user?.role || "user";

        if (userRole === "admin") {
          sessionStorage.setItem("adminToken", res.data.token);
          navigate("/admin/dashboard");
        } else {
          navigate("/events");
        }
      }, 800);

    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Login failed";

      setError("❌ " + errorMsg);
    }
  };

  return (
    <div className="auth-card">
      <h2>🔐 Login</h2>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>

          <input
            name="email"
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>

          <input
            name="password"
            type="password"
            placeholder="Your password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Login
        </button>
      </form>

      <p
        style={{
          textAlign: "center",
          marginTop: "20px",
          color: "#666",
        }}
      >
        Don't have an account?{" "}
        <a
          href="/register"
          style={{ color: "#667eea", fontWeight: "600" }}
        >
          Register here
        </a>
      </p>
    </div>
  );
};

export default Login;
