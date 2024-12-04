import React, { useState } from "react";
import authService from "../services/authService";
import "./PasswordReset.css";

function PasswordReset() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await authService.requestPasswordReset(email);
      setMessage("Password reset link sent to your email");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send reset link");
    }
  };

  return (
    <div className="password-reset-container">
      <div className="password-reset-box">
        <h1>Reset Password</h1>
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="reset-button">
            Send Reset Link
          </button>
        </form>
        <div className="back-to-login">
          <a href="/login">Back to Login</a>
        </div>
      </div>
    </div>
  );
}

export default PasswordReset;
