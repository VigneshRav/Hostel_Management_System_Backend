import express from "express";
import authController from "../Controllers/AuthController";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
