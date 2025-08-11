import express from "express";
import { getFinancialReport } from "../Controllers/ReportController.js";
import { protect, adminOnly } from "../Middlewares/Auth.js";

const router = express.Router();

router.get("/financial", protect, adminOnly, getFinancialReport);

export default router;
