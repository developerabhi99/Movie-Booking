const { Router } = require('express');
const {
  postTheaterHandler,
  postScreenLayoutTemplateHandler,
  postScreenHandler,
  postMovieHandler,
  postShowHandler,
} = require('../../controllers/Client/client');

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Theater
 *     description: Theater management
 *   - name: Screen
 *     description: Screen management
 *   - name: Screen Layout Template
 *     description: Screen layout configuration
 *   - name: Movie
 *     description: Movie management
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
 *                 description: Number of screens in the theater
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

/**
 * @swagger
 * /screenLayoutTemplate/add:
 *   post:
 *     summary: Add a new screen layout template
 *     tags: [Screen Layout Template]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               layoutName:
 *                 type: string
 *                 description: Name of the layout
 *               totalRows:
 *                 type: integer
 *                 description: Number of rows in the layout
 *               totalColumns:
 *                 type: integer
 *                 description: Number of columns in the layout
 *               seatMap:
 *                 type: array
 *                 description: 2D array defining seat positions
 *                 items:
 *                   type: array
 *                   items:
 *                     type: string
 *             required:
 *               - layoutName
 *               - totalRows
 *               - totalColumns
 *     responses:
 *       201:
 *         description: Screen layout template added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ScreenLayoutTemplate'
 *       400:
 *         description: Invalid input
 */
router.post('/screenLayoutTemplate/add', postScreenLayoutTemplateHandler);

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
 *             type: object
 *             properties:
 *               theaterId:
 *                 type: string
 *                 description: ID of the theater this screen belongs to
 *               name:
 *                 type: string
 *                 description: Screen name or number
 *               layoutTemplateId:
 *                 type: string
 *                 description: ID of the screen layout template
 *             required:
 *               - theaterId
 *               - name
 *               - layoutTemplateId
 *     responses:
 *       201:
 *         description: Screen added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Screen'
 *       400:
 *         description: Invalid input
 */
router.post('/screen/add', postScreenHandler);

/**
 * @swagger
 * /movie/add:
 *   post:
 *     summary: Add a new movie
 *     tags: [Movie]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the movie
 *               description:
 *                 type: string
 *                 description: Short description or synopsis
 *               duration:
 *                 type: integer
 *                 description: Duration of the movie in minutes
 *               language:
 *                 type: string
 *                 description: Language of the movie
 *               genre:
 *                 type: string
 *                 description: Genre of the movie
 *               releaseDate:
 *                 type: string
 *                 format: date
 *                 description: Release date of the movie
 *             required:
 *               - title
 *               - duration
 *               - language
 *     responses:
 *       201:
 *         description: Movie added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Invalid input
 */
router.post('/movie/add', postMovieHandler);

router.post('/show/add', postShowHandler);

module.exports = router;
