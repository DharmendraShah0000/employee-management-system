const Employee = require('../models/Employee');

exports.getStats = async () => {
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const sixMonthsAgo = new Date(monthStart);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

  const [total, active, inactive, newThisMonth, byDepartment, hires, recent] = await Promise.all([
    Employee.countDocuments(),
    Employee.countDocuments({ status: 'active' }),
    Employee.countDocuments({ status: 'inactive' }),
    Employee.countDocuments({ joiningDate: { $gte: monthStart } }),
    Employee.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $lookup: { from: 'departments', localField: '_id', foreignField: '_id', as: 'dept' } },
      { $project: { _id: 0, name: { $ifNull: [{ $arrayElemAt: ['$dept.name', 0] }, 'Unassigned'] }, count: 1 } },
      { $sort: { count: -1 } },
    ]),
    Employee.aggregate([
      { $match: { joiningDate: { $gte: sixMonthsAgo } } },
      { $group: { _id: { y: { $year: '$joiningDate' }, m: { $month: '$joiningDate' } }, count: { $sum: 1 } } },
    ]),
    Employee.find().sort('-createdAt').limit(5).populate('department', 'name'),
  ]);

  // Fill in months with zero hires so the chart always shows 6 points
  const hiresPerMonth = [];
  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date(monthStart);
    d.setMonth(d.getMonth() - i);
    const found = hires.find((h) => h._id.y === d.getFullYear() && h._id.m === d.getMonth() + 1);
    hiresPerMonth.push({
      month: d.toLocaleString('en-US', { month: 'short', year: '2-digit' }),
      count: found ? found.count : 0,
    });
  }

  return { totals: { total, active, inactive, newThisMonth }, byDepartment, hiresPerMonth, recent };
};
