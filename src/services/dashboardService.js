const Record = require('../models/Record');

const getDashboardSummary = async () => {
  const [totalsAgg, categoryAgg, recentTransactions, monthlyAgg] = await Promise.all([
    Record.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ]),
    Record.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: { category: '$category', type: '$type' },
          total: { $sum: '$amount' }
        }
      }
    ]),
    Record.find({ isDeleted: false })
      .sort({ date: -1, createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'name email role'),
    Record.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      }
    ])
  ]);

  const incomeRow = totalsAgg.find((item) => item._id === 'income');
  const expenseRow = totalsAgg.find((item) => item._id === 'expense');

  const totalIncome = incomeRow ? incomeRow.total : 0;
  const totalExpenses = expenseRow ? expenseRow.total : 0;
  const netBalance = totalIncome - totalExpenses;

  const categoryMap = {};
  categoryAgg.forEach((row) => {
    const category = row._id.category;
    if (!categoryMap[category]) {
      categoryMap[category] = {
        category,
        totalIncome: 0,
        totalExpenses: 0,
        net: 0
      };
    }

    if (row._id.type === 'income') {
      categoryMap[category].totalIncome = row.total;
    }

    if (row._id.type === 'expense') {
      categoryMap[category].totalExpenses = row.total;
    }

    categoryMap[category].net = categoryMap[category].totalIncome - categoryMap[category].totalExpenses;
  });

  const trendMap = {};
  monthlyAgg.forEach((row) => {
    const key = `${row._id.year}-${String(row._id.month).padStart(2, '0')}`;

    if (!trendMap[key]) {
      trendMap[key] = {
        month: key,
        income: 0,
        expenses: 0,
        net: 0
      };
    }

    if (row._id.type === 'income') {
      trendMap[key].income = row.total;
    } else {
      trendMap[key].expenses = row.total;
    }

    trendMap[key].net = trendMap[key].income - trendMap[key].expenses;
  });

  return {
    totalIncome,
    totalExpenses,
    netBalance,
    categoryWiseTotals: Object.values(categoryMap),
    recentTransactions,
    monthlyTrends: Object.values(trendMap)
  };
};

module.exports = {
  getDashboardSummary
};
