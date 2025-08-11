import express from "express";
import {
  createRequest,
  getRequests,
  updateRequest,
} from "../Controllers/MaintenanceController.js";
import { protect, adminOnly } from "../Middlewares/Auth.js";

const router = express.Router();

router.post("/", protect, createRequest);
router.get("/", protect, getRequests);
router.put("/:id", protect, adminOnly, updateRequest);

export default router;
