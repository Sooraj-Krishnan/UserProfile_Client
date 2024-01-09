const router = require("express").Router();

const { menuView, createOrder } = require("../controllers/publicController");

router.get("/menu-view/:id", menuView);
router.post("/create-order/:id/order", createOrder);

module.exports = router;
