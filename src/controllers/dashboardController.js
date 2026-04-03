const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');
const dashboardService = require('../services/dashboardService');

const getSummary = asyncHandler(async (req, res) => {
  const summary = await dashboardService.getDashboardSummary();
  return successResponse(res, summary);
});

module.exports = {
  getSummary
};
