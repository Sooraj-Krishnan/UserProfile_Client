require("dotenv").config();
const mongoose = require("mongoose");
const MenuCard = require("../models/menuCardModel");
const Table = require("../models/tableModel");
const Order = require("../models/orderModel");
const Waiter = require("../models/waiterModel");
const KitchenStaff = require("../models/kitchenStaffModel");

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

const createOrder = async (req, res, next) => {
  try {
    const tableID = req.params.id;
    console.log("Table ID", tableID);
    const { orders } = req.body;

    const table = await Table.findById(tableID);
    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    // Find the waiter who is assigned to the table
    const waiter = await Waiter.findOne({ assignedTables: table.tableID });

    if (!waiter) {
      return res.status(404).json({
        success: false,
        message: "Waiter not found",
      });
    }

    // Find the kitchen staff who is assigned to the menu card
    const kitchenStaff = await KitchenStaff.findOne({
      menuCardID: table.menuCardID,
    });
    if (!kitchenStaff) {
      return res.status(404).json({
        success: false,
        message: "Kitchen staff not found",
      });
    }

    const managerID = table.managerID;
    const waiterID = waiter._id;
    const kitchenStaffID = kitchenStaff._id;

    const order = await Order.create({
      tableID,
      managerID,
      waiterID,
      kitchenStaffID,
      orders,
    });
    res.status(200).json({
      success: true,
      orderID: order._id,
      order,
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

const updateOrderStatus = async (req, res, next) => {
  try {
    const orderID = req.params.id;
    console.log("Order ID", orderID);
    const status = req.body.status;
    console.log("Status", status);

    const order = await Order.findById(orderID);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    // order.status = "confirmed";
    order.status = status || order.status;
    await order.save();

    res.status(200).json({
      success: true,
      order,
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

const getOrderDetails = async (req, res, next) => {
  try {
    const userID = mongoose.Types.ObjectId(req.user_id);
    console.log("User ID", userID);

    const order = await Order.findOne({
      $or: [
        { managerID: userID },
        { waiterID: userID },
        { kitchenStaffID: userID },
      ],
    }).populate("managerID waiterID kitchenStaffID tableID");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
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

module.exports = {
  menuView,
  createOrder,
  updateOrderStatus,
  getOrderDetails,
};
