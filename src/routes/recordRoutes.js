const express = require('express');
const recordController = require('../controllers/recordController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');
const { validateMiddleware } = require('../middleware/validateMiddleware');
const { ROLES } = require('../utils/constants');
const {
  createRecordValidator,
  recordIdValidator,
  updateRecordValidator,
  listRecordsValidator
} = require('../validators/recordValidators');

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * /api/records:
 *   post:
 *     summary: Create a financial record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - type
 *               - category
 *               - date
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 2500
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: income
 *               category:
 *                 type: string
 *                 example: salary
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2026-04-03
 *               notes:
 *                 type: string
 *                 example: Monthly salary
 *     responses:
 *       201:
 *         description: Created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  '/',
  roleMiddleware(ROLES.ADMIN),
  createRecordValidator,
  validateMiddleware,
  recordController.createRecord
);

/**
 * @swagger
 * /api/records:
 *   get:
 *     summary: Get all records with filters
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  '/',
  roleMiddleware(ROLES.ADMIN, ROLES.ANALYST),
  listRecordsValidator,
  validateMiddleware,
  recordController.getRecords
);

/**
 * @swagger
 * /api/records/{id}:
 *   get:
 *     summary: Get a record by id
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Invalid record id
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Record not found
 */
router.get(
  '/:id',
  roleMiddleware(ROLES.ADMIN, ROLES.ANALYST),
  recordIdValidator,
  validateMiddleware,
  recordController.getRecord
);

/**
 * @swagger
 * /api/records/{id}:
 *   patch:
 *     summary: Update a record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 3000
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: expense
 *               category:
 *                 type: string
 *                 example: food
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2026-04-03
 *               notes:
 *                 type: string
 *                 example: Updated note
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Record not found
 */
router.patch(
  '/:id',
  roleMiddleware(ROLES.ADMIN),
  updateRecordValidator,
  validateMiddleware,
  recordController.updateRecord
);

/**
 * @swagger
 * /api/records/{id}:
 *   delete:
 *     summary: Delete a record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Invalid record id
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Record not found
 */
router.delete(
  '/:id',
  roleMiddleware(ROLES.ADMIN),
  recordIdValidator,
  validateMiddleware,
  recordController.deleteRecord
);

module.exports = router;
