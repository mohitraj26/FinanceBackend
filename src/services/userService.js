const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const listUsers = async () => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  return users;
};

const getUserById = async (id) => {
  const user = await User.findById(id).select('-password');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user;
};

const updateUser = async (id, payload) => {
  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (payload.name !== undefined) user.name = payload.name;
  if (payload.email !== undefined) user.email = payload.email.toLowerCase();
  if (payload.role !== undefined) user.role = payload.role;

  await user.save();
  return User.findById(user._id).select('-password');
};

const deleteUser = async (id) => {
  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  await User.deleteOne({ _id: id });
};

const updateUserStatus = async (id, status) => {
  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.status = status;
  await user.save();

  return User.findById(user._id).select('-password');
};

module.exports = {
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserStatus
};
