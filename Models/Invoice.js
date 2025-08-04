import mongoose from "mongoose";

const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  resident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: { type: Number, required: true },
  description: String,
  dueDate: Date,
  status: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" },
  createdAt: { type: Date, default: Date.now },
});

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;
