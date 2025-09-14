import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Alert
} from "@mui/material"; 
import './Register.css';
import axios from 'axios'
import { useNavigate } from "react-router-dom";
export default function Registration() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password || !mobile) {
      setError("Please fill in all the fields.");
      return;
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email.");
      return;
    }

    // Validate mobile number
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setError("");
    console.log("Registration successful:", { name, email, password, mobile });

    const payload = {
    name,
    email,
    password,
    mobile
  };
    axios.post('http://localhost:3005/new',payload)
    .then(response => {
      alert('Registration Completed Successfully!');
      navigate('/login');
    })
    .catch(err => {
      if (err.response) {
        console.error('Error response:', err.response.data);
        alert('Error: ' + err.response.data.message || 'Something went wrong');
      } else {
        console.error('Network Error:', err.message);
        alert('Network Error: ' + err.message);
      }
    });
  };

  return (
    <Box className="registration-container">
      <Paper className="registration-paper" elevation={8}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            type="text"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="small"
            className="registration-field"
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="small"
            className="registration-field"
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size="small"
            className="registration-field"
          />
          <TextField
            label="Mobile Number"
            type="text"
            fullWidth
            margin="normal"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            size="small"
            className="registration-field"
          />

          {error && (
            <Alert severity="error" className="error-message">
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="medium"
            className="registration-button"
          >
            Register
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
