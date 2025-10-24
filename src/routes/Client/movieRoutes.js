const { Router } = require('express');
const router = Router();
const {
  postMovieHandler,
  getMoviesHandler,
  getMovieByIdHandler,
  updateMovieHandler,
  deleteMovieHandler
} = require('../../controllers/Client/movieController');

/**
 * @swagger
 * tags:
 *   - name: Movie
 *     description: Movie management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the movie
 *         description:
 *           type: string
 *           description: Movie description
 *         duration:
 *           type: number
 *           description: Duration in minutes
 *         language:
 *           type: string
 *           description: Movie language
 *         genre:
 *           type: array
 *           items:
 *             type: string
 *           description: Genre(s) of the movie
 *         releaseDate:
 *           type: string
 *           format: date
 *           description: Release date of the movie
 *         rating:
 *           type: number
 *           description: Rating from 0 to 10
 *         posterUrl:
 *           type: string
 *           description: Poster image URL
 *         trailerUrl:
 *           type: string
 *           description: Trailer video URL
 *         cast:
 *           type: array
 *           items:
 *             type: string
 *           description: Cast members
 *         director:
 *           type: string
 *           description: Director of the movie
 *         addedBy:
 *           type: string
 *           description: User ID who added the movie
 *         isActive:
 *           type: boolean
 *           description: Movie active status
 */

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
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       201:
 *         description: Movie added successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /movie:
 *   get:
 *     summary: Get all movies
 *     tags: [Movie]
 *     responses:
 *       200:
 *         description: List of all movies
 */

/**
 * @swagger
 * /movie/{id}:
 *   get:
 *     summary: Get movie by ID
 *     tags: [Movie]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: Movie details
 *       404:
 *         description: Movie not found
 */

/**
 * @swagger
 * /movie/{id}:
 *   patch:
 *     summary: Update movie details
 *     tags: [Movie]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *       404:
 *         description: Movie not found
 */

/**
 * @swagger
 * /movie/{id}:
 *   delete:
 *     summary: Delete a movie
 *     tags: [Movie]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *       404:
 *         description: Movie not found
 */

router.post('/add', postMovieHandler);
router.get('/', getMoviesHandler);
router.get('/:id', getMovieByIdHandler);
router.patch('/:id', updateMovieHandler);
router.delete('/:id', deleteMovieHandler);

module.exports = router;
