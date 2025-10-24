const { Router } = require('express');
const router = Router();
const {
  postShowHandler,
  getShowsHandler,
  getShowByIdHandler,
  updateShowHandler,
  deleteShowHandler
} = require('../../controllers/Client/showController');

/**
 * @swagger
 * tags:
 *   - name: Show
 *     description: Show management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Show:
 *       type: object
 *       properties:
 *         owner:
 *           type: string
 *           description: Owner ID of the show
 *         movie:
 *           type: string
 *           description: Movie ID
 *         theater:
 *           type: string
 *           description: Theater ID
 *         screen:
 *           type: string
 *           description: Screen ID
 *         showTime:
 *           type: string
 *           format: date-time
 *           description: Show start time
 *         ticketPrice:
 *           type: number
 *           description: Ticket price for the show
 *         bookedSeats:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of booked seat identifiers
 */

/**
 * @swagger
 * /show/add:
 *   post:
 *     summary: Add a new show
 *     tags: [Show]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Show'
 *     responses:
 *       201:
 *         description: Show added successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /show:
 *   get:
 *     summary: Get all shows
 *     tags: [Show]
 *     responses:
 *       200:
 *         description: List of all shows
 */

/**
 * @swagger
 * /show/{id}:
 *   get:
 *     summary: Get a show by ID
 *     tags: [Show]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Show ID
 *     responses:
 *       200:
 *         description: Show details
 *       404:
 *         description: Show not found
 */

/**
 * @swagger
 * /show/{id}:
 *   patch:
 *     summary: Update a show by ID
 *     tags: [Show]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Show ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Show'
 *     responses:
 *       200:
 *         description: Show updated successfully
 *       404:
 *         description: Show not found
 */

/**
 * @swagger
 * /show/{id}:
 *   delete:
 *     summary: Delete a show by ID
 *     tags: [Show]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Show ID
 *     responses:
 *       200:
 *         description: Show deleted successfully
 *       404:
 *         description: Show not found
 */

router.post('/add', postShowHandler);
router.get('/', getShowsHandler);
router.get('/:id', getShowByIdHandler);
router.patch('/:id', updateShowHandler);
router.delete('/:id', deleteShowHandler);

module.exports = router;
