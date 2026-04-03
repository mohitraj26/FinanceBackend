const { isValidObjectId } = require('mongoose');

const notFoundMiddleware = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found'
  });
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)[0].message;
  }

  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate value entered';
  }

  if (err.name === 'CastError' && err.kind === 'ObjectId' && !isValidObjectId(err.value)) {
    statusCode = 400;
    message = 'Invalid resource id';
  }

  res.status(statusCode).json({
    success: false,
    message
  });
};

module.exports = {
  notFoundMiddleware,
  errorHandler
};
