const Report = require("../models/report");

// @desc    Create new report
// @route   POST /api/reports/
// @access  Private
const createReport = async (req, res) => {
  const { location, image, wasteType, description } = req.body;

  const report = new Report({
    user: req.user._id,
    location,
    image,
    wasteType,
    description,
  });

  const createdReport = await report.save();
  res.status(201).json(createdReport);
};

// @desc    Get reports of logged in user
// @route   GET /api/reports/me
// @access  Private
const getUserReports = async (req, res) => {
  const reports = await Report.find({ user: req.user._id });
  res.json(reports);
};

// @desc    Get all reports (Admin only)
// @route   GET /api/reports/
// @access  Private/Admin
const getAllReports = async (req, res) => {
  const reports = await Report.find({}).populate("user", "name email");
  res.json(reports);
};

module.exports = { createReport, getUserReports, getAllReports };
