const Record = require('../models/Record');
const ApiError = require('../utils/ApiError');

const createRecord = async (payload, userId) => {
  const record = await Record.create({
    ...payload,
    createdBy: userId
  });

  return record;
};

const buildFilters = (query) => {
  const filters = { isDeleted: false };

  if (query.type) {
    filters.type = query.type;
  }

  if (query.category) {
    filters.category = { $regex: query.category, $options: 'i' };
  }

  if (query.startDate || query.endDate) {
    filters.date = {};

    if (query.startDate) {
      filters.date.$gte = new Date(query.startDate);
    }

    if (query.endDate) {
      filters.date.$lte = new Date(query.endDate);
    }
  }

  if (query.search) {
    filters.$or = [
      { category: { $regex: query.search, $options: 'i' } },
      { notes: { $regex: query.search, $options: 'i' } }
    ];
  }

  return filters;
};

const listRecords = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filters = buildFilters(query);

  const [records, total] = await Promise.all([
    Record.find(filters)
      .populate('createdBy', 'name email role')
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Record.countDocuments(filters)
  ]);

  return {
    records,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

const getRecordById = async (id) => {
  const record = await Record.findOne({ _id: id, isDeleted: false }).populate('createdBy', 'name email role');

  if (!record) {
    throw new ApiError(404, 'Record not found');
  }

  return record;
};

const updateRecord = async (id, payload) => {
  const record = await Record.findOne({ _id: id, isDeleted: false });

  if (!record) {
    throw new ApiError(404, 'Record not found');
  }

  Object.assign(record, payload);
  await record.save();

  return record;
};

const deleteRecord = async (id) => {
  const record = await Record.findOne({ _id: id, isDeleted: false });

  if (!record) {
    throw new ApiError(404, 'Record not found');
  }

  record.isDeleted = true;
  await record.save();
};

module.exports = {
  createRecord,
  listRecords,
  getRecordById,
  updateRecord,
  deleteRecord
};
