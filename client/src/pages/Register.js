import React, { useState } from "react";
import API from "../services/api";
import "../styles/Auth.css";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
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
      await API.post("/auth/register", form);
      setMessage("✅ Registration successful! Please login.");
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Registration failed";
      setError("❌ " + errorMsg);
    }
  };

  return (
    <div className="auth-card">
      <h2>📝 Register</h2>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            name="name"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

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
            placeholder="Create a strong password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn">Register</button>
      </form>

      <p style={{ textAlign: "center", marginTop: "20px", color: "#666" }}>
        Already have an account? <a href="/login" style={{ color: "#667eea", fontWeight: "600" }}>Login here</a>
      </p>
    </div>
  );
};

export default Register;
