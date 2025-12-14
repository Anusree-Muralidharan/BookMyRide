import React from "react";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { stripePromise } from "./stripe";
import "./Payment.css";
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ bookingDetails }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    // DUMMY PAYMENT (Stripe test mode)
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Payment Successful!");

      navigate("/receipt", {
        state: {
          booking: bookingDetails,
          paymentId: paymentMethod.id,
        },
      });
    }
  };

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <h2>Card Payment</h2>

      <CardElement className="card-input" />

      <button type="submit" disabled={!stripe}>
        Pay ₹{bookingDetails.amount}
      </button>
    </form>
  );
};

const Payment = () => {
  // Example booking data (pass from seat booking page)
  const bookingDetails = {
    bus: "Volvo AC",
    seats: ["5", "6"],
    amount: 1200,
  };

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm bookingDetails={bookingDetails} />
    </Elements>
  );
};

export default Payment;
