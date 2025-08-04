import MaintenanceRequest from "../Models/MaintenanceRequest";
import User from "../Models/User.js";
import sendEmail from "../Utils/Mailer.js";

export const createRequest = async (req, res) => {
  const { issue, priority } = req.body;

  const request = await MaintenanceRequest.create({
    resident: req.user._id,
    issue,
    priority,
  });

  res.status(201).json(request);
};

export const listRequests = async (req, res) => {
  const { role, _id } = req.user;
  let requests;

  if (role === "resident") {
    requests = await MaintenanceRequest.find({ resident: _id })
      .populate("resident", "name email")
      .populate("assignedTo", "name email");
  } else {
    requests = await MaintenanceRequest.find()
      .populate("resident", "name email")
      .populate("assignedTo", "name email");
  }
  res.json(requests);
};

export const updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status, assignedTo } = req.body;

  const request = await MaintenanceRequest.findById(id).populate(
    "resident",
    "email name"
  );
  if (!request) return res.status(404).json({ message: "Request not found" });

  if (status) request.status = status;
  if (assignedTo) request.assignedTo = assignedTo;

  await request.save();

  // Notify resident by email
  if (status) {
    await sendEmail(
      request.resident.email,
      `Maintenance Request Status Updated`,
      `Hello ${request.resident.name}, your maintenance request status is now: ${status}`
    );
  }

  res.json(request);
};
