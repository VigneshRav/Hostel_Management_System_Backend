import User from "../Models/User";
import Room from "../Models/Room";
import Invoice from "../Models/Invoice";

export const getFinancialReport = async (req, res) => {
  try {
    // Fetch all invoices, rooms, and resident users
    const invoices = await Invoice.find();
    const rooms = await Room.find();
    const residents = await User.find({ role: "resident" });

    // Calculate total revenue from paid invoices
    const totalRevenue = invoices
      .filter((inv) => inv.status === "Paid")
      .reduce((sum, inv) => sum + inv.amount, 0);

    // Calculate outstanding (unpaid) invoices
    const outstandingAmount = invoices
      .filter((inv) => inv.status === "Unpaid")
      .reduce((sum, inv) => sum + inv.amount, 0);

    // Calculate occupancy rate
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter(
      (room) => room.status === "Occupied"
    ).length;
    const occupancyRate =
      totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(2) : "0.00";

    // Response
    res.json({
      totalRevenue,
      outstandingAmount,
      occupancyRate: `${occupancyRate}%`,
      totalResidents: residents.length,
    });
  } catch (err) {
    console.error("Error generating report:", err);
    res
      .status(500)
      .json({
        message: "Failed to generate financial report",
        error: err.message,
      });
  }
};
