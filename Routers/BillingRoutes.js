import express from "express";
import {
  getInvoices,
  createInvoice,
  payInvoice,
} from "../Controllers/BillingController.js";
import { protect, adminOnly } from "../Middlewares/Auth.js";

const router = express.Router();

router.get("/", protect, getInvoices);
router.post("/create", protect, adminOnly, createInvoice);
router.post("/pay", protect, payInvoice);

export default router;
