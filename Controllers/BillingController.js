import dotenv from "dotenv";
import Stripe from "stripe";
import User from "../Models/User.js";
import Invoice from "../Models/Invoice.js";
import sendEmail from "../Utils/Mailer.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Invoice
export const createInvoice = async (req, res) => {
  try {
    const { residentId, amount, description, dueDate } = req.body;

    if (!residentId || !amount || !description || !dueDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const resident = await User.findById(residentId);
    if (!resident) {
      return res.status(404).json({ message: "Resident not found" });
    }

    const invoice = await Invoice.create({
      resident: residentId,
      amount,
      description,
      dueDate,
    });

    res.status(201).json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// List Invoices
export const getInvoices = async (req, res) => {
  try {
    const { role, _id } = req.user;

    let invoices;
    if (role === "resident") {
      invoices = await Invoice.find({ resident: _id }).populate(
        "resident",
        "name email"
      );
    } else {
      invoices = await Invoice.find().populate("resident", "name email");
    }

    res.json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Pay Invoice
export const payInvoice = async (req, res) => {
  try {
    const { invoiceId, token } = req.body;

    if (!invoiceId || !token) {
      return res
        .status(400)
        .json({ message: "Invoice ID and payment token are required" });
    }

    const invoice = await Invoice.findById(invoiceId).populate(
      "resident",
      "email name"
    );
    if (!invoice || invoice.status === "Paid") {
      return res
        .status(400)
        .json({ message: "Invoice not found or already paid" });
    }

    let charge;
    try {
      charge = await stripe.charges.create({
        amount: Math.round(invoice.amount * 100), // amount in cents
        currency: "usd",
        source: token,
        description: invoice.description,
      });
    } catch (stripeError) {
      console.error(stripeError);
      return res
        .status(402)
        .json({ message: "Payment failed", error: stripeError.message });
    }

    invoice.status = "Paid";
    await invoice.save();

    await sendEmail(
      invoice.resident.email,
      "Payment Successful",
      `Hi ${invoice.resident.name}, your payment of $${invoice.amount} was successful.`
    );

    res.json({ message: "Payment successful", charge });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
