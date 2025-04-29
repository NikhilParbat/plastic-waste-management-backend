const express = require("express");
const router = express.Router();
const {
  createReport,
  getAllReports,
  getUserReports,
} = require("../controllers/report_controller");
const { protect, admin } = require("../middleware/auth_ middleware");

router.post("/", protect, createReport);
router.get("/me", protect, getUserReports);
router.get("/", protect, admin, getAllReports); // Admin only

module.exports = router;
