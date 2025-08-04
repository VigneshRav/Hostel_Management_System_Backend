import express from "express";
import userController from "../Controllers/UserController";
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

router.get("/profile", protect, userController.getProfile);
router.put("/profile", protect, userController.updateProfile);

module.exports = router;
