import express from "express";
const router = express.Router();
import maintenanceController from "../Controllers/MaintenanceController";
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, maintenanceController.createRequest);
router.get("/", protect, maintenanceController.getRequests);
router.put("/:id", protect, adminOnly, maintenanceController.updateRequest);

module.exports = router;
