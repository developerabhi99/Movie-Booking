const { Router } = require('express');
const router = Router();
const {
  postTheaterHandler,
  getTheatersHandler,
  getTheaterByIdHandler,
  updateTheaterHandler,
  deleteTheaterHandler
} = require('../../controllers/Client/theaterController');

/**
 * @swagger
 * tags:
 *   - name: Theater
 *     description: Theater management
 */

/**
 * @swagger
 * /theater/add:
 *   post:
 *     summary: Add a new theater
 *     tags: [Theater]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Theater'
 *     responses:
 *       201:
 *         description: Theater added successfully
 *       400:
 *         description: Invalid input
 */
router.post('/add', postTheaterHandler);

/**
 * @swagger
 * /theater:
 *   get:
 *     summary: Get all theaters
 *     tags: [Theater]
 *     responses:
 *       200:
 *         description: List of theaters
 */
router.get('/', getTheatersHandler);

/**
 * @swagger
 * /theater/{id}:
 *   get:
 *     summary: Get theater by ID
 *     tags: [Theater]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Theater details
 *       404:
 *         description: Theater not found
 */
router.get('/:id', getTheaterByIdHandler);

/**
 * @swagger
 * /theater/{id}:
 *   patch:
 *     summary: Update theater details
 *     tags: [Theater]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Theater'
 *     responses:
 *       200:
 *         description: Theater updated successfully
 */
router.patch('/:id', updateTheaterHandler);

/**
 * @swagger
 * /theater/{id}:
 *   delete:
 *     summary: Delete a theater
 *     tags: [Theater]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Theater deleted successfully
 */
router.delete('/:id', deleteTheaterHandler);

module.exports = router;
