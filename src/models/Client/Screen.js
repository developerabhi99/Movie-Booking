const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Seat:
 *       type: object
 *       properties:
 *         row:
 *           type: string
 *           description: Row label of the seat (e.g., 'A', 'B', 'C')
 *         number:
 *           type: integer
 *           description: Seat number within the row
 *         type:
 *           type: string
 *           enum: [regular, vip, premium]
 *           description: Type of seat (default is 'regular')
 *         isAvailable:
 *           type: boolean
 *           description: Indicates if the seat is currently available
 *           default: true
 *
 *     SeatTypePricing:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           description: Type of seat (e.g., 'regular', 'vip', 'premium')
 *         price:
 *           type: number
 *           description: Price associated with this seat type
 *
 *     Screen:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the screen
 *         theater:
 *           type: string
 *           description: Reference ID of the theater that owns this screen
 *         name:
 *           type: string
 *           description: Screen name (e.g., "Screen 1", "IMAX Hall")
 *         layoutTemplate:
 *           type: string
 *           description: Reference to a reusable screen layout template
 *         totalSeats:
 *           type: integer
 *           description: Total number of seats in the screen
 *         seatTypes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SeatTypePricing'
 *           description: Pricing for each seat category
 *         seats:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Seat'
 *           description: List of all seats and their details
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the screen was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the screen was last updated
 *       required:
 *         - theater
 *         - name
 */

const seatSchema = new mongoose.Schema({
  row: String,
  number: Number,
  type: {
    type: String,
    enum: ["regular", "vip", "premium"],
    default: "regular",
  },
  isAvailable: { type: Boolean, default: true },
});

const screenSchema = new mongoose.Schema(
  {
    theater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theater",
      required: true,
    },
    name: { type: String, required: true }, // e.g. “Screen 1”
    layoutTemplate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ScreenLayoutTemplate",
    },
    totalSeats: Number,
    seatTypes: [
      {
        type: { type: String },
        price: Number,
      },
    ],
    seats: [seatSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Screen", screenSchema);
