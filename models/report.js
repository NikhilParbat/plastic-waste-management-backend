const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      trim: true,
    },
    area: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    wasteType: {
      type: String,
      enum: ["Dry", "Wet", "Plastic"],
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
