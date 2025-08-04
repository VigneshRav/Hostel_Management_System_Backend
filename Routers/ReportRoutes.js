import express from "express";
import reportController from "../Controllers/ReportController";
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get(
  "/financial",
  protect,
  adminOnly,
  reportController.getFinancialReport
);

module.exports = router;
