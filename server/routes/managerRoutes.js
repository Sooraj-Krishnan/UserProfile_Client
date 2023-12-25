const router = require("express").Router();
const { verifyJwt } = require("../helpers/verify_jwt");
const {
  createMenuCard,
  editMenuCard,
  viewAllMenuCards,
  createWaiter,
  editWaiter,
  viewWaiters,
} = require("../controllers/managerController");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/create-menu-card",
  verifyJwt,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "logoImage", maxCount: 1 },
  ]),
  createMenuCard
);

router.put("/edit-menu-card/:id", verifyJwt, upload.any(), editMenuCard);
router.get("/all-menu-cards", verifyJwt, viewAllMenuCards);

router.post("/create-waiter", verifyJwt, createWaiter);
router.put("/edit-waiter/:id", verifyJwt, editWaiter);
router.get("/view-waiters", verifyJwt, viewWaiters);
module.exports = router;
