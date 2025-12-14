import React from "react";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { stripePromise } from "./stripe";
import "./Payment.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

// Checkout Form Component
const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();
  const bookingDetails = location.state; // get booking details from BookSeat

  if (!bookingDetails) {
    return <p>No booking details found!</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    try {
      // Create payment method (dummy/test mode)
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });

      if (error) {
        alert(error.message);
        return;
      }

      // Payment successful
      alert("Payment Successful!");

      // Save booking to backend
      const res = await axios.post("http://localhost:3005/book-seat", {
        userId: bookingDetails.userId,
        busId: bookingDetails.busId,
        busName: bookingDetails.busName,
        routeId: bookingDetails.routeId,
        seats: bookingDetails.seats,
        fare: bookingDetails.amount,
        paymentId: paymentMethod.id, // optional: store Stripe payment ID
      });

      alert("Booking saved successfully!");

      // Redirect to receipt/confirmation page
      navigate("/receipt", {
        state: {
          booking: res.data,
          paymentId: paymentMethod.id,
        },
      });
    } catch (err) {
      console.error(err);
      alert("Booking/payment failed. Try again.");
    }
  };

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <h2>Card Payment</h2>

      <div className="booking-summary">
        <p>
          <strong>Bus:</strong> {bookingDetails.busName || "Bus Name"} <br />
          <strong>Seats:</strong> {bookingDetails.seats.join(", ")} <br />
          <strong>Total Amount:</strong> ₹{bookingDetails.amount}
        </p>
      </div>

      <CardElement className="card-input" />

      <button type="submit" disabled={!stripe}>
        Pay ₹{bookingDetails.amount}
      </button>
    </form>
  );
};

// Main Payment Page
const Payment = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Payment;
