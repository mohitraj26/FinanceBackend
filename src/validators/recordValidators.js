const { body, param, query } = require('express-validator');

const createRecordValidator = [
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('date').isISO8601().withMessage('Date must be a valid ISO date'),
  body('notes').optional().isString().withMessage('Notes must be a string')
];

const recordIdValidator = [
  param('id').isMongoId().withMessage('Invalid record id')
];

const updateRecordValidator = [
  ...recordIdValidator,
  body('amount').optional().isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('type').optional().isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
  body('date').optional().isISO8601().withMessage('Date must be a valid ISO date'),
  body('notes').optional().isString().withMessage('Notes must be a string')
];

const listRecordsValidator = [
  query('type').optional().isIn(['income', 'expense']).withMessage('Invalid type filter'),
  query('category').optional().isString().withMessage('Category must be text'),
  query('startDate').optional().isISO8601().withMessage('Invalid startDate'),
  query('endDate').optional().isISO8601().withMessage('Invalid endDate'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be >= 1'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().isString().withMessage('Search must be a string')
];

module.exports = {
  createRecordValidator,
  recordIdValidator,
  updateRecordValidator,
  listRecordsValidator
};
