const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the booking
 *         user:
 *           type: string
 *           description: Reference ID of the user who made the booking
 *         show:
 *           type: string
 *           description: Reference ID of the show for which the booking is made
 *         seats:
 *           type: array
 *           items:
 *             type: string
 *           description: List of booked seat identifiers (e.g., ['A1', 'A2'])
 *         totalAmount:
 *           type: number
 *           description: Total amount charged for the booking
 *         paymentStatus:
 *           type: string
 *           enum: [pending, completed, failed]
 *           description: Current payment status of the booking
 *           default: pending
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the booking was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the booking was last updated
 *       required:
 *         - user
 *         - show
 *         - seats
 */

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    show: { type: mongoose.Schema.Types.ObjectId, ref: "Show", required: true },
    seats: [String],
    totalAmount: Number,
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
