const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');
const userService = require('../services/userService');

const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.listUsers();
  return successResponse(res, users);
});

const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  return successResponse(res, user);
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  return successResponse(res, user);
});

const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id);
  return successResponse(res, { message: 'User deleted successfully' });
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await userService.updateUserStatus(req.params.id, req.body.status);
  return successResponse(res, user);
});

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserStatus
};
