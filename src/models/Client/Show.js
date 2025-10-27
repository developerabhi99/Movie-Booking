const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Show:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the show
 *         movie:
 *           type: string
 *           description: Reference ID of the movie being shown
 *         theater:
 *           type: string
 *           description: Reference ID of the theater where the show is scheduled
 *         screen:
 *           type: string
 *           description: Reference ID of the screen where the movie will play
 *         showTime:
 *           type: string
 *           format: date-time
 *           description: Date and time of the show
 *         ticketPrice:
 *           type: number
 *           description: Base ticket price (seat type multipliers apply)
 *         bookedSeats:
 *           type: array
 *           items:
 *             type: string
 *           description: List of seat identifiers that are already booked
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the show record was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the show record was last updated
 *       required:
 *         - movie
 *         - theater
 *         - screen
 *         - showTime
 */

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    theater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "theaters",
      required: true,
    },
    screen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Screen",
      required: true,
    },
    showTime: { type: Date, required: true },
    ticketPrice: Number, // base price; seat type modifiers apply
    bookedSeats: [String],
    owner:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true
    }
  },
  { timestamps: true }
);

const Show = mongoose.model("Show", showSchema)

module.exports = Show;
