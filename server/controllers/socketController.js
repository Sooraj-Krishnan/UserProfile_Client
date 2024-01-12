require("dotenv").config();
// const MenuCard = require("../models/menuCardModel");
const Table = require("../models/tableModel");
const Waiter = require("../models/waiterModel");

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
  findWaiterByTableId,
  updateWaiterSocketId,
};
