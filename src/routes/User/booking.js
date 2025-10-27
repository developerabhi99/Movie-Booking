const { Router } = require("express");
const { postBookingHandler } = require("../../controllers/User/booking");


const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Booking
 *     description: Booking management
 */

/**
 * @swagger
 * /client/bookings/add:
 *   post:
 *     summary: Create a new booking for a show
 *     tags: [Booking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               showId:
 *                 type: string
 *                 description: ID of the show being booked
 *               seats:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of seat numbers selected
 *             required:
 *               - showId
 *               - seats
 *     responses:
 *       201:
 *         description: Booking initiated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Booking initiated. Complete payment to confirm.
 *                 data:
 *                   type: object
 *                   properties:
 *                     booking:
 *                       $ref: '#/components/schemas/Booking'
 *                     order:
 *                       $ref: '#/components/schemas/Order'
 *                     payment:
 *                       type: object
 *                       description: Simulated payment response
 *       400:
 *         description: Invalid booking request
 */

router.post("/add", postBookingHandler);

module.exports = router;
