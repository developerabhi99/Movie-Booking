const { Router } = require('express');
const router = Router();
const {
  postScreenLayoutTemplateHandler,
  getScreenLayoutTemplatesHandler,
  getScreenLayoutTemplateByIdHandler,
  updateScreenLayoutTemplateHandler,
  deleteScreenLayoutTemplateHandler
} = require('../../controllers/Client/screenLayoutTemplateController');

/**
 * @swagger
 * tags:
 *   - name: Screen Layout Template
 *     description: Screen layout configuration
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ScreenLayoutTemplate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the screen layout template
 *         seats:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               row:
 *                 type: string
 *                 description: Row identifier
 *               number:
 *                 type: number
 *                 description: Seat number
 *               type:
 *                 type: string
 *                 description: Seat type
 *               isAvailable:
 *                 type: boolean
 *                 description: Availability of the seat
 *         seatTypes:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: Type of seat
 *               price:
 *                 type: number
 *                 description: Price of this seat type
 *         seatLength:
 *           type: number
 *           description: Total number of seats
 */

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
 *             $ref: '#/components/schemas/ScreenLayoutTemplate'
 *     responses:
 *       201:
 *         description: Screen layout template added successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /screenLayoutTemplate:
 *   get:
 *     summary: Get all screen layout templates
 *     tags: [Screen Layout Template]
 *     responses:
 *       200:
 *         description: List of all screen layout templates
 */

/**
 * @swagger
 * /screenLayoutTemplate/{id}:
 *   get:
 *     summary: Get screen layout template by ID
 *     tags: [Screen Layout Template]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Template ID
 *     responses:
 *       200:
 *         description: Screen layout template details
 *       404:
 *         description: Template not found
 */

/**
 * @swagger
 * /screenLayoutTemplate/{id}:
 *   patch:
 *     summary: Update a screen layout template
 *     tags: [Screen Layout Template]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Template ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ScreenLayoutTemplate'
 *     responses:
 *       200:
 *         description: Screen layout template updated successfully
 *       404:
 *         description: Template not found
 */

/**
 * @swagger
 * /screenLayoutTemplate/{id}:
 *   delete:
 *     summary: Delete a screen layout template
 *     tags: [Screen Layout Template]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Template ID
 *     responses:
 *       200:
 *         description: Screen layout template deleted successfully
 *       404:
 *         description: Template not found
 */

router.post('/add', postScreenLayoutTemplateHandler);
router.get('/', getScreenLayoutTemplatesHandler);
router.get('/:id', getScreenLayoutTemplateByIdHandler);
router.patch('/:id', updateScreenLayoutTemplateHandler);
router.delete('/:id', deleteScreenLayoutTemplateHandler);

module.exports = router;
