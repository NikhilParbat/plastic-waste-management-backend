const Report = require("../models/report");

// @desc    Create new report
// @route   POST /api/reports/
// @access  Private
const createReport = async (req, res) => {
  try {
    const { location, city, area, wasteType, description, user } = req.body;
    const image = req.file?.filename;

    // Debug log (optional, remove in production)
    console.log(location, city, area, wasteType, description, user, image);

    // Basic validation
    if (!location || !image || !wasteType || !description || !user) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled." });
    }

    // Create new report document
    const report = new Report({
      user,
      location,
      city,
      area,
      image,
      wasteType,
      description,
      // `status` is set to "Pending" by default
    });

    const createdReport = await report.save();
    res.status(201).json(createdReport);
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// @desc    Get reports of logged in user
// @route   GET /api/reports/me
// @access  Private
const getUserReports = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      res.status(400).json({ message: "user not found" });
    }
    const reports = await Report.find({ user: userId });
    if (!reports) {
      res.status(404).json({
        message: "Reports Not Found",
      });
    }
    res.status(200).json({ reports: reports });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all reports (Admin only)
// @route   GET /api/reports/
// @access  Private/Admin
const getAllReports = async (req, res) => {
  try {
    // Fetch all reports created by any user
    const reports = await Report.find({}).populate("user", "name email");

    // If no reports found, send a 404 response
    if (!reports || reports.length === 0) {
      return res.status(404).json({ message: "No reports found" });
    }

    // Send the reports back as the response
    res.json(reports);
  } catch (error) {
    // Handle any error by sending a 500 error with the error message
    res.status(500).json({ error: error.message });
  }
};
// @desc    Delete a report by ID
// @route   DELETE /api/reports/:id
// @access  Private
const deleteReport = async (req, res) => {
  try {
    const reportId = req.params.id;
    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    await report.remove();
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Edit a report by ID
// @route   PUT /api/reports/:id
// @access  Private
const editReport = async (req, res) => {
  try {
    const reportId = req.params.id;
    const { location, wasteType, description, status } = req.body; // Include 'status'
    const image = req.file?.filename;

    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Update fields if they are provided
    report.location = location || report.location;
    report.wasteType = wasteType || report.wasteType;
    report.description = description || report.description;

    // Update image only if a new one was uploaded
    if (image) {
      report.image = image;
    }

    // Update the status if it is provided (for admin updates)
    if (status) {
      report.status = status;
    }

    // Save the updated report
    const updatedReport = await report.save();
    res.status(200).json(updatedReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get a single report by ID
// @route   GET /api/reports/:id
// @access  Private
const getReportById = async (req, res) => {
  try {
    const reportId = req.params.id;

    // Fetch the report by ID
    const report = await Report.findById(reportId);

    // If report not found, return a 404 response
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Return the found report
    res.status(200).json(report);
  } catch (error) {
    // Handle any errors
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createReport,
  getUserReports,
  getAllReports,
  deleteReport,
  editReport,
  getReportById, // Added the new controller here
};
