import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  Alert
} from "@mui/material";
import './Login.css'; // Importing the CSS file
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }
    setError("");
    console.log("Login successful:", { email, password });
    // TODO: navigate to admin/home page
    const payload = {
    email,
    password
  };
    axios.post('http://localhost:3005/login',payload)
    .then(response => {
      console.log(response)
      alert('Login Completed Successfully!');
      navigate('/users');
    })
    .catch(err => {
      // If there is a response from the server
      if (err.response) {
        console.error('Error response:', err.response.data);
        alert('Error: ' + err.response.data.message || 'Something went wrong');
      } else {
        // If no response (likely network error)
        console.error('Network Error:', err.message);
        alert('Network Error: ' + err.message);
      }
    });
  };

  return (
    <Box className="login-container">
      <Paper className="login-paper" elevation={8}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            size="large"
            className="login-button"
          >
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
