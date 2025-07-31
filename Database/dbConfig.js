import mongoose from "mongoose";
import dotenv from "dotenv";

//Configuration of dotenv to access the Mongodb URL
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
