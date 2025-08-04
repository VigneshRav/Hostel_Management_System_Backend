import express from "express";
import roomController from "../Controllers/RoomController";

const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", protect, roomController.getAllRooms);
router.post("/", protect, adminOnly, roomController.createRoom);
router.put("/:id/assign", protect, adminOnly, roomController.assignRoom);

module.exports = router;
