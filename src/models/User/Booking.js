const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Show",
    required: true
  },
  theater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "theaters",
    required: true
  },
  screen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Screen",
    required: true
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true
  },
  seats: {
    type: [String],
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED"],
    default: "PENDING"
  },
  paymentId: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Booking", bookingSchema);
