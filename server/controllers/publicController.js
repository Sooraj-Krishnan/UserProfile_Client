require("dotenv").config();
const MenuCard = require("../models/menuCardModel");
const Table = require("../models/tableModel");
const Waiter = require("../models/waiterModel");

const menuView = async (req, res, next) => {
  try {
    const tableID = req.params.id;

    const table = await Table.findById(tableID);
    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }
    const menuCardID = table.menuCardID;
    const menuCard = await MenuCard.findById(menuCardID);

    if (!menuCard) {
      return res.status(404).json({
        success: false,
        message: "Menu card not found",
      });
    }

    res.status(200).json({
      success: true,
      data: menuCard,
    });
  } catch (error) {
    console.error("Detailed Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
    next(error);
  }
};

const findWaiterByTableId = async (tableId) => {
  console.log("Table ID", tableId);
  try {
    // Find the table document by _id
    const table = await Table.findById(tableId);
    if (!table) {
      throw new Error("Table not found");
    }

    // Get the tableID from the found table document
    const tableID = table.tableID;

    // Find the waiter who is assigned to this table by tableID
    const waiter = await Waiter.findOne({ assignedTables: { $in: [tableID] } });
    if (!waiter) {
      throw new Error("Waiter not found");
    }

    console.log("Waiter found", waiter);
    return waiter;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateWaiterSocketId = async (userId, socketId) => {
  try {
    const updatedWaiter = await Waiter.findOneAndUpdate(
      { _id: userId },
      { socketId: socketId },
      { new: true }
    );
    console.log("Updated waiter:", updatedWaiter);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  menuView,
  findWaiterByTableId,
  updateWaiterSocketId,
};
