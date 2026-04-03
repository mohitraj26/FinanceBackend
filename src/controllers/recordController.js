const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');
const recordService = require('../services/recordService');

const createRecord = asyncHandler(async (req, res) => {
  const record = await recordService.createRecord(req.body, req.user._id);
  return successResponse(res, record, 201);
});

const getRecords = asyncHandler(async (req, res) => {
  const result = await recordService.listRecords(req.query);
  return successResponse(res, result);
});

const getRecord = asyncHandler(async (req, res) => {
  const record = await recordService.getRecordById(req.params.id);
  return successResponse(res, record);
});

const updateRecord = asyncHandler(async (req, res) => {
  const record = await recordService.updateRecord(req.params.id, req.body);
  return successResponse(res, record);
});

const deleteRecord = asyncHandler(async (req, res) => {
  await recordService.deleteRecord(req.params.id);
  return successResponse(res, { message: 'Record deleted successfully' });
});

module.exports = {
  createRecord,
  getRecords,
  getRecord,
  updateRecord,
  deleteRecord
};
