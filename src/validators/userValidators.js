const { body, param } = require('express-validator');
const { ROLES, USER_STATUS } = require('../utils/constants');

const userIdValidator = [
  param('id').isMongoId().withMessage('Invalid user id')
];

const updateUserValidator = [
  ...userIdValidator,
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('role')
    .optional()
    .isIn(Object.values(ROLES))
    .withMessage('Invalid role')
];

const updateStatusValidator = [
  ...userIdValidator,
  body('status')
    .isIn(Object.values(USER_STATUS))
    .withMessage('Status must be active or inactive')
];

module.exports = {
  userIdValidator,
  updateUserValidator,
  updateStatusValidator
};
