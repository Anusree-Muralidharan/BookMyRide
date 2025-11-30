const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: String,
  busName: String,
  date: String,
  from: String,
  to: String,
  seats: [Number],
});

module.exports = mongoose.model("Booking", bookingSchema);
