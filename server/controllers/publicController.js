require("dotenv").config();
const MenuCard = require("../models/menuCardModel");
const Table = require("../models/tableModel");
const Order = require("../models/orderModel");
// const Waiter = require("../models/waiterModel");

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
    const { orders } = req.body;

    const table = await Table.findById(tableID);
    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }
    const order = await Order.create({
      tableID,
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
    const order = await Order.findById(orderID);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    order.status = "confirmed";
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

module.exports = {
  menuView,
  createOrder,
  updateOrderStatus,
};
