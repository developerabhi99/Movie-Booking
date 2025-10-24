const { Router } = require('express');
const router = Router();
const {
  postScreenHandler,
  getScreensHandler,
  getScreenByIdHandler,
  updateScreenHandler,
  deleteScreenHandler
} = require('../../controllers/Client/screenController');

/**
 * @swagger
 * tags:
 *   - name: Screen
 *     description: Screen management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Screen:
 *       type: object
 *       properties:
 *         theater:
 *           type: string
 *           description: Theater ID to which the screen belongs
 *         name:
 *           type: string
 *           description: Screen name or number
 *         layoutTemplate:
 *           type: string
 *           description: ID of the layout template used
 *         totalSeats:
 *           type: number
 *           description: Total number of seats in this screen
 *         seatTypes:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: Type of seat (e.g., Regular, VIP)
 *               price:
 *                 type: number
 *                 description: Price for this seat type
 *         seats:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               row:
 *                 type: string
 *               number:
 *                 type: number
 *               type:
 *                 type: string
 *               isAvailable:
 *                 type: boolean
 */

/**
 * @swagger
 * /screen/add:
 *   post:
 *     summary: Add a new screen to a theater
 *     tags: [Screen]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Screen'
 *     responses:
 *       201:
 *         description: Screen added successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /screen:
 *   get:
 *     summary: Get all screens
 *     tags: [Screen]
 *     responses:
 *       200:
 *         description: List of all screens
 */

/**
 * @swagger
 * /screen/{id}:
 *   get:
 *     summary: Get a screen by ID
 *     tags: [Screen]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Screen ID
 *     responses:
 *       200:
 *         description: Screen details
 *       404:
 *         description: Screen not found
 */

/**
 * @swagger
 * /screen/{id}:
 *   patch:
 *     summary: Update a screen by ID
 *     tags: [Screen]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Screen ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Screen'
 *     responses:
 *       200:
 *         description: Screen updated successfully
 *       404:
 *         description: Screen not found
 */

/**
 * @swagger
 * /screen/{id}:
 *   delete:
 *     summary: Delete a screen by ID
 *     tags: [Screen]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Screen ID
 *     responses:
 *       200:
 *         description: Screen deleted successfully
 *       404:
 *         description: Screen not found
 */

router.post('/add', postScreenHandler);
router.get('/', getScreensHandler);
router.get('/:id', getScreenByIdHandler);
router.patch('/:id', updateScreenHandler);
router.delete('/:id', deleteScreenHandler);

module.exports = router;
