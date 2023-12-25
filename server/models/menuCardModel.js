const mongoose = require("mongoose");
const Manager = require("./managerModel");
const Admin = require("./adminModel");

const MenuCardSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },

  coverImage: {
    type: String,
    required: [true, "Cover Image is required"],
  },
  logoImage: {
    type: String,
    required: [true, "Logo Image is required"],
  },

  status: {
    type: String,
    default: "active",
  },
  managerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Manager,
    required: [true, "Manager ID is required"],
  },
  adminID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Admin,
    required: [true, "Admin ID is required"],
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
const MenuCard = mongoose.model("MenuCard", MenuCardSchema);
module.exports = MenuCard;
