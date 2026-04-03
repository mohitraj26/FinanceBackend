const express = require('express');
const authController = require('../controllers/authController');
const { validateMiddleware } = require('../middleware/validateMiddleware');
const { loginValidator, registerValidator } = require('../validators/authValidators');

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: "Register a new user (default role: Viewer)"
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Mohit Raj
 *               email:
 *                 type: string
 *                 format: email
 *                 example: mohit@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/register', registerValidator, validateMiddleware, authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: mohit@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/login', loginValidator, validateMiddleware, authController.login);

module.exports = router;
