const express = require("express");
const router = express.Router();
const {
  createReport,
  getAllReports,
  getUserReports,
  deleteReport,
  editReport,
  getReportById,
} = require("../controllers/report_controller");
const { protect, admin } = require("../middleware/auth_middleware");
const upload = require("../middleware/upload_middleware");

router.post("/", upload.single("image"), createReport);
router.get("/:id", getUserReports);
router.get("/", getAllReports);
router.get("/user/:id", getReportById);
router.put("/:id", upload.single("image"), editReport);
router.delete("/delete/:id", deleteReport);

module.exports = router;
