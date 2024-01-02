const router = require("express").Router();

const { menuView } = require("../controllers/publicController");

router.get("/menu-view/:id", menuView);

module.exports = router;
