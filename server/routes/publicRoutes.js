const router = require("express").Router();

const {
  menuView,
  createOrder,
  updateOrderStatus,
} = require("../controllers/publicController");

router.get("/menu-view/:id", menuView);
router.post("/create-order/:id/order", createOrder);
router.put("/update-order-status/:id", updateOrderStatus);

module.exports = router;
