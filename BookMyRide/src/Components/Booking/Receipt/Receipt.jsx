import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Receipt.css";

const Receipt = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get paymentId and booking from state
  const { booking, paymentId } = location.state || {};

  if (!paymentId) {
    return (
      <div className="receipt-container">
        <h2>No Payment Data</h2>
        <button onClick={() => navigate("/user")}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="receipt-container">
      <h2>Booking Receipt</h2>

      <div className="receipt-details">
        <p>
          <strong>Transaction ID:</strong> {paymentId.id}
        </p>
        <p>
          <strong>Status:</strong> Completed
        </p>
        <p>
          <strong>Amount Paid:</strong> ₹{(booking.amount / 100).toFixed(2)}
        </p>
        <p>
          <strong>Booked Seats:</strong> {booking ? booking.seats.join(", ") : "N/A"}
        </p>
        <p>
          <strong>Payment Method:</strong> Card
        </p>
      </div>

      <button onClick={() => navigate("/user")}>Back to Home</button>
    </div>
  );
};

export default Receipt;
