const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the movie
 *         title:
 *           type: string
 *           description: Name of the movie
 *         description:
 *           type: string
 *           description: Short synopsis or summary of the movie
 *         genre:
 *           type: array
 *           items:
 *             type: string
 *           description: List of genres (e.g., Action, Drama, Comedy)
 *         duration:
 *           type: integer
 *           description: Duration of the movie in minutes
 *         language:
 *           type: string
 *           description: Primary language of the movie
 *         releaseDate:
 *           type: string
 *           format: date
 *           description: Official release date of the movie
 *         rating:
 *           type: number
 *           description: Average rating (0–10 scale)
 *         posterUrl:
 *           type: string
 *           description: URL of the movie poster image
 *         trailerUrl:
 *           type: string
 *           description: URL of the official movie trailer
 *         cast:
 *           type: array
 *           items:
 *             type: string
 *           description: List of main cast members
 *         director:
 *           type: string
 *           description: Director of the movie
 *         addedBy:
 *           type: string
 *           description: Reference ID of the client/theater owner who added the movie
 *         isActive:
 *           type: boolean
 *           description: Whether the movie is active for show scheduling
 *           default: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the movie record was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the movie record was last updated
 *       required:
 *         - title
 *         - duration
 *         - language
 *         - releaseDate
 */

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    genre: [String],
    duration: { type: Number, required: true }, // in minutes
    language: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    rating: { type: Number, min: 0, max: 10 },
    posterUrl: String,
    trailerUrl: String,
    cast: [String],
    director: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // theater owner who adds the movie
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);
