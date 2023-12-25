require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const { connectDb } = require("./config/connection");

app.use(express.static("public"));

app.use(
  cors({
    origin: [process.env.FRONT_END_PORT, process.env.FRONT_END_PORT1],
    credentials: true, //access-control-allow-credentials:true
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const managerRoutes = require("./routes/managerRoutes");

app.use("/api", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", managerRoutes);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const error = {
    success: false,
    status: err.status || 500,
    message: err.message || "Something went wrong",
  };
  res.status(error.status).json(error);
});

const PORT = process.env.PORT || 5173;
app.listen(PORT, async () => {
  console.log(`Server is running at port ${PORT}`);
  await connectDb();
});
