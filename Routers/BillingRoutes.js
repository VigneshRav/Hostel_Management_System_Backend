import express from "express";
import billingController from "../Controllers/BillingController";

const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", protect, billingController.getInvoices);
router.post("/create", protect, adminOnly, billingController.createInvoice);
router.post("/pay", protect, billingController.payInvoice);

module.exports = router;
