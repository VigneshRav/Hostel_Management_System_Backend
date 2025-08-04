import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, unique: true, required: true },
  type: {
    type: String,
    enum: ["Single", "Double", "Suite"],
    default: "Single",
  },
  status: {
    type: String,
    enum: ["Available", "Occupied", "Maintenance"],
    default: "Available",
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
});

const Room = mongoose.model("Room", roomSchema);
export default Room;
