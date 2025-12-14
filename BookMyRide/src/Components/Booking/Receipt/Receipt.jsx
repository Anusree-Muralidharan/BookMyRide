import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Receipt.css";

const Receipt = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get paymentIntent and bookedSeats from state
  const { paymentIntent, bookedSeats } = location.state || {};

  if (!paymentIntent) {
    return (
      <div className="receipt-container">
        <h2>No Payment Data</h2>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="receipt-container">
      <h2>Booking Receipt</h2>

      <div className="receipt-details">
        <p>
          <strong>Transaction ID:</strong> {paymentIntent.id}
        </p>
        <p>
          <strong>Status:</strong> {paymentIntent.status}
        </p>
        <p>
          <strong>Amount Paid:</strong> ₹{(paymentIntent.amount / 100).toFixed(2)}
        </p>
        <p>
          <strong>Booked Seats:</strong> {bookedSeats ? bookedSeats.join(", ") : "N/A"}
        </p>
        <p>
          <strong>Payment Method:</strong> Card
        </p>
      </div>

      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
};

export default Receipt;
