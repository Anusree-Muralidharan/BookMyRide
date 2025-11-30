import React, { useState } from "react";
import axios from "axios";
import bg from "../../assets/background-BookMyRide.png";
import "./UserLogin.css";
import { useNavigate } from "react-router-dom";

const Userlogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/user/login", {
        email,
        password,
      });

      if (res.data.success) {
        localStorage.setItem("userToken", res.data.token);
        navigate("/user-page"); // redirect to user dashboard
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="user-login-page">

      {/* BACKGROUND IMAGE */}
      <img
        src={bg}
        alt="background-login"
        className="user-background-login"
      />

      {/* LOGIN CARD */}
      <div className="user-login-container">
        <div className="user-login-box">

          <h2>User Login</h2>

          {/* Email Input */}
          <input
            type="email"
            placeholder="Enter Email"
            className="user-login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password Input */}
          <input
            type="password"
            placeholder="Enter Password"
            className="user-login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Error Message */}
          {error && <p className="user-error-message">{error}</p>}

          {/* Login Button */}
          <button className="user-login-button" onClick={handleSubmit}>
            Login
          </button>

          {/* Register link */}
          <p className="user-register-link">
            Don't have an account? <a href="/register">Register</a>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Userlogin;