const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location: { type: String, required: true },
    image: { type: String, required: true },
    wasteType: {
      type: String,
      enum: ["Dry", "Wet", "Plastic"],
      required: true,
    },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
