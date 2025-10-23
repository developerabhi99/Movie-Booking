const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     SeatType:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [regular, vip, premium]
 *           description: Category of seat type
 *         price:
 *           type: number
 *           description: Price associated with this seat type
 *       required:
 *         - type
 *         - price
 *
 *     LayoutSeat:
 *       type: object
 *       properties:
 *         row:
 *           type: string
 *           description: Row label (e.g. 'A', 'B', 'C')
 *         number:
 *           type: integer
 *           description: Seat number within the row
 *         type:
 *           type: string
 *           enum: [regular, vip, premium]
 *           description: Type of seat (default 'regular')
 *
 *     ScreenLayoutTemplate:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the layout template
 *         name:
 *           type: string
 *           description: Name of the layout template (e.g., "Standard 120", "IMAX")
 *         seats:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/LayoutSeat'
 *           description: List of seat positions and types
 *         seatTypes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SeatType'
 *           description: Defines pricing for different seat types
 *         totalSeats:
 *           type: integer
 *           description: Total number of seats in this layout
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when this layout was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when this layout was last updated
 *       required:
 *         - name
 */

const seatTypeSchema = new mongoose.Schema({
  type: { type: String, enum: ["regular", "vip", "premium"], required: true },
  price: { type: Number, required: true },
});

const layoutSeatSchema = new mongoose.Schema({
  row: String,
  number: Number,
  type: {
    type: String,
    enum: ["regular", "vip", "premium"],
    default: "regular",
  },
});

const screenLayoutTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g. "Standard 120", "IMAX"
    seats: [layoutSeatSchema],
    seatTypes: [seatTypeSchema],
    totalSeats: Number,
  },
  { timestamps: true }
);

const ScreenLayoutTemplate = mongoose.model(
    "ScreenLayoutTemplate",
    screenLayoutTemplateSchema
  );

module.exports = ScreenLayoutTemplate;
