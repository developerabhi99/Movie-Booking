const { Router } = require('express');
const { postTheaterHandler,postScreenLayoutTemplateHandler, postScreenHandler } = require('../../controllers/Client/client');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Theater
 *   description: Theater management
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
 *             type: object
 *             properties:
 *               owner:
 *                 type: string
 *                 description: Owner ID of the theater
 *               name:
 *                 type: string
 *                 description: Name of the theater
 *               location:
 *                 type: string
 *                 description: Location of the theater
 *               totalSeats:
 *                 type: integer
 *                 description: Total seats in the theater
 *               screens:
 *                 type: integer
 *                 description: Number of screens
 *             required:
 *               - owner
 *               - name
 *               - location
 *               - totalSeats
 *               - screens
 *     responses:
 *       201:
 *         description: Theater added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Theater'
 *       400:
 *         description: Invalid input
 */
router.post('/theater/add', postTheaterHandler);
router.post('/screenLayoutTemplate/add', postScreenLayoutTemplateHandler);
router.post('/screen/add', postScreenHandler);
router.post('/movie/add', postMovieHandler);


module.exports = router;
