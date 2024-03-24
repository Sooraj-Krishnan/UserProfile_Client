const router = require("express").Router();

const {
  menuView,
  createOrder,
  updateOrderStatus,
  getOrderDetails,
} = require("../controllers/publicController");

const { employeeVerify_Jwt } = require("../helpers/employeeVerifyJWT");

router.get("/menu-view/:id", menuView);
router.post("/create-order/:id/order", createOrder);
router.put("/update-order-status/:id", updateOrderStatus);
router.get("/get-order-details", employeeVerify_Jwt, getOrderDetails);

module.exports = router;
