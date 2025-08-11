import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "staff", "resident"],
    default: "resident",
  },
  token: {
    type: String,
  },
  contactNumber: {
    type: String,
  },
  emergencyContact: {
    name: String,
    phone: String,
  },
  roomNumber: {
    type: String,
  },
  checkInDate: {
    type: Date,
  },
  checkOutDate: {
    type: Date,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
