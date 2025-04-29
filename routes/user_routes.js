const express = require("express");
const router = express.Router();
const { getUserProfile } = require("../controllers/user_controller");
const { protect } = require("../middleware/auth_middleware");

router.get("/profile", getUserProfile);

module.exports = router;
