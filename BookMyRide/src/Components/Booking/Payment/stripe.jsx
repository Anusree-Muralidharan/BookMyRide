import { loadStripe } from "@stripe/stripe-js";

export const stripePromise = loadStripe(
  "pk_test_51SeF47FoPOBPPsItBjV8jDqQj1Rk1D52cJv0BE8FY5OZAFn42PXAXtRXYr0Zsf6k5x0u1uTtmCm1SJNC2bd6lIBT00BL1mW1Bu" // Stripe TEST public key
);
