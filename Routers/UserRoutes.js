import express from "express";
import { getProfile, updateProfile } from "../Controllers/UserController.js";
import { protect } from "../Middlewares/Auth.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;
