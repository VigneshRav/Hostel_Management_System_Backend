import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./Database/dbConfig.js";
import AuthRoutes from "./Routers/AuthRoutes.js";
import RoomRoutes from "./Routers/RoomRoutes.js";
import UserRoutes from "./Routers/UserRoutes.js";
import BillingRoutes from "./Routers/BillingRoutes.js";
import MaintenanceRoutes from "./Routers/MaintenanceRoutes.js";
import ReportRoutes from "./Routers/ReportRoutes.js";
import ErrorHandler from "./Middlewares/ErrorHandler.js";

//Configuration of dotenv to access the port
dotenv.config();

//Initialization of express.js
const app = express();

//Default middlewares
app.use(express.json());
app.use(cors());

//Custom Middleware
app.use(ErrorHandler);

//Database connection
connectDB();

//Default route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to our backend" });
});

//Custom Routes
app.use("/api/users", UserRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/billing", BillingRoutes);
app.use("/api/reports", ReportRoutes);
app.use("/api/rooms", RoomRoutes);
app.use("/api/maintenance", MaintenanceRoutes);

//Initialization of port
const port = process.env.PORT || 4000;

//Starting server using express.js
app.listen(port, () => {
  console.log(`Server started and running on the port ${port}`);
});
