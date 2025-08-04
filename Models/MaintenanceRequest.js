import mongoose from "mongoose";

const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema({
  resident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  issue: { type: String, required: true },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending",
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // staff member
  createdAt: { type: Date, default: Date.now },
});

const Maintenance = mongoose.model("MaintenanceRequest", maintenanceSchema);
export default Maintenance;
