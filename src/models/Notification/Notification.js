const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: [
        // User events
        "USER_SIGNUP",
        "USER_UPDATED",
        "USER_DELETED",

        // Theater events
        "THEATER_ADDED",
        "THEATER_UPDATED",
        "THEATER_DELETED",

        // Screen events
        "SCREEN_ADDED",
        "SCREEN_UPDATED",
        "SCREEN_DELETED",

        // Movie events
        "MOVIE_ADDED",
        "MOVIE_UPDATED",
        "MOVIE_DELETED",

        // Show events
        "SHOW_ADDED",
        "SHOW_UPDATED",
        "SHOW_DELETED",

        // Booking events
        "BOOKING_CONFIRMED",
        "BOOKING_CANCELLED",

        // Payment events
        "PAYMENT_SUCCESS",
        "PAYMENT_FAILED"
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    meta: { type: Object }, // additional contextual info like IDs, timestamps, etc.
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
