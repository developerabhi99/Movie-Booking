const { Schema, model } = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Theater:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the theater
 *         owner:
 *           type: string
 *           description: Reference to the user (client) who owns the theater
 *         name:
 *           type: string
 *           description: Name of the theater
 *         location:
 *           type: string
 *           description: Detailed address or landmark of the theater
 *         city:
 *           type: string
 *           description: City where the theater is located
 *         state:
 *           type: string
 *           description: State where the theater is located
 *         pincode:
 *           type: string
 *           description: Postal code of the theater's location
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the theater record was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the theater record was last updated
 *       required:
 *         - owner
 *         - name
 *         - location
 *         - city
 */

const theaterSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { 
        type: String, 
        required: true 
    },
    location: { 
        type: String, 
        required: true 
    },
    city: { 
        type: String, 
        required: true 
    },
    state: String,
    pincode: String,
  },
  { timestamps: true }
);

const Theater = model("theaters", theaterSchema);

module.exports = Theater;
