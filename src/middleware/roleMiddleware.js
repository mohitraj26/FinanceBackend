const ApiError = require('../utils/ApiError');

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, 'Forbidden');
    }

    next();
  };
};

module.exports = {
  roleMiddleware
};
