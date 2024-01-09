const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  tableID: {
    type: String,
    required: true,
  },
  orders: [
    {
      itemName: {
        type: String,
        required: true,
      },
      price: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  status: {
    type: String,
    default: "unconfirmed",
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
});
mongoose.set("strictQuery", false);
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
