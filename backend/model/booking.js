const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  busId: { type: mongoose.Schema.Types.ObjectId, ref: "buses", required: true },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: "routes", required: true },
  seats: [{ type: String, required: true }],
  fare: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Confirmed"], default: "Pending" },
  bookingDate: { type: Date, default: Date.now },
});

const bookingModel = mongoose.model("bookings", bookingSchema);
module.exports = bookingModel;
