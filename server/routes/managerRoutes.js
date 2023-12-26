const router = require("express").Router();
const { verifyJwt } = require("../helpers/verify_jwt");
const {
  createMenuCard,
  editMenuCard,
  viewAllMenuCards,
  createTable,
  editTable,
  viewAllTables,
  createWaiter,
  viewAllWaiters,
  editWaiter,
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
router.post("/create-table/:id", verifyJwt, createTable);
router.put("/edit-table/:id", verifyJwt, editTable);
router.get("/all-tables", verifyJwt, viewAllTables);
router.post("/create-waiter/:id", verifyJwt, createWaiter);
router.get("/all-waiters", verifyJwt, viewAllWaiters);
router.put("/edit-waiter/:id", verifyJwt, editWaiter);
module.exports = router;
