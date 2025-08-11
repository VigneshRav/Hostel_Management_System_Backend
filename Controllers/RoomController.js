import Room from "../Models/Room.js";
import User from "../Models/User.js";

export const createRoom = async (req, res) => {
  const { roomNumber, type } = req.body;
  const existingRoom = await Room.findOne({ roomNumber });
  if (existingRoom)
    return res.status(400).json({ message: "Room number already exists" });
  const room = await Room.create({ roomNumber, type });
  res.status(201).json(room);
};

export const getAllRooms = async (req, res) => {
  const rooms = await Room.find().populate("assignedTo", "name email");
  res.json(rooms);
};

export const updateRoom = async (req, res) => {
  const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!room) return res.status(404).json({ message: "Room not found" });
  res.json(room);
};

export const deleteRoom = async (req, res) => {
  const room = await Room.findByIdAndDelete(req.params.id);
  if (!room) return res.status(404).json({ message: "Room not found" });
  res.json({ message: "Room deleted" });
};

// Assign room to resident
export const assignRoom = async (req, res) => {
  const { roomId, residentId } = req.body;

  const room = await Room.findById(roomId);
  if (!room) return res.status(404).json({ message: "Room not found" });
  if (room.status === "Occupied")
    return res.status(400).json({ message: "Room already occupied" });

  const resident = await User.findById(residentId);
  if (!resident) return res.status(404).json({ message: "Resident not found" });

  room.assignedTo = resident._id;
  room.status = "Occupied";
  await room.save();

  resident.roomNumber = room.roomNumber;
  resident.checkInDate = new Date();
  resident.checkOutDate = null;
  await resident.save();

  res.json({ message: "Room assigned", room, resident });
};

// Check out resident from room
export const checkoutRoom = async (req, res) => {
  const { roomId } = req.body;

  const room = await Room.findById(roomId);
  if (!room) return res.status(404).json({ message: "Room not found" });
  if (room.status !== "Occupied")
    return res.status(400).json({ message: "Room is not occupied" });

  const resident = await User.findById(room.assignedTo);
  if (resident) {
    resident.roomNumber = null;
    resident.checkOutDate = new Date();
    await resident.save();
  }

  room.assignedTo = null;
  room.status = "Available";
  await room.save();

  res.json({ message: "Room checked out", room });
};
