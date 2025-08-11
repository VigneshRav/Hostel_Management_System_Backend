import express from "express";
import {
  getAllRooms,
  createRoom,
  assignRoom,
} from "../Controllers/RoomController.js";

import { protect, adminOnly } from "../Middlewares/Auth.js";

const router = express.Router();

router.get("/", protect, getAllRooms);
router.post("/", protect, adminOnly, createRoom);
router.put("/:id/assign", protect, adminOnly, assignRoom);

export default router;
