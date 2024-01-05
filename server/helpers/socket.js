const http = require("http");
const { Server } = require("socket.io");
const { findWaiterByTableId } = require("../controllers/publicController");
module.exports = function (app) {
  const server = http.createServer(app);
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("a user connected");

    // Listen for 'order' events
    socket.on("order", ({ cartItems, tableId }) => {
      // Find the waiter assigned to the table ID
      const waiter = findWaiterByTableId(tableId);

      // Emit an 'order' event to the waiter with the order details
      socket.to(waiter.id).emit("order", { cartItems, tableId });
    });
  });

  return server;
};
