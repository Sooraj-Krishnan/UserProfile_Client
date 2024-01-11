import { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import { Typography, Button } from "antd";
import "./kitchenStaff.css";

const { Title } = Typography;

function KitchenStaff() {
  const [orders, setOrders] = useState([]);
  const [doneOrders, setDoneOrders] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketIO = socketIOClient(import.meta.env.VITE_REACT_APP_SERVER_URL);
    setSocket(socketIO);
    // Listen for 'confirmOrder' events
    socketIO.on("confirmOrder", (order) => {
      // Update the orders state with the new order
      setOrders((prevOrders) => [
        ...prevOrders,
        { ...order, status: "ORDER RECEIVED" },
      ]);
    });
    return () => {
      socketIO.disconnect();
    };
  }, []);

  const handleOrderReceived = (order) => {
    // Find the complete order data from the orders state
    const orderData = orders.find((o) => o.tableID === order.tableID);

    if (order.status === "ORDER RECEIVED") {
      // Emit 'mealPreparationStarted' event to the order detail
      // socket.emit("mealPreparationStarted", orderData);
      socket.emit("mealPreparationStarted", {
        ...orderData,
        orderId: order.orderId,
      });
      // Update the order status to 'DONE'
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.tableID === order.tableID ? { ...o, status: "DONE" } : o
        )
      );
    } else if (order.status === "DONE") {
      // Emit 'orderReady' event to the order detail
      //  socket.emit("orderReady", orderData);
      socket.emit("orderReady", { ...orderData, orderId: order.orderId });
      // Update the order status to 'ORDER READY'
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.tableID === order.tableID ? { ...o, status: "ORDER READY" } : o
        )
      );
      setDoneOrders((prevDoneOrders) => [...prevDoneOrders, order.tableID]);
    }
  };

  return (
    <div>
      <Title level={1}>Kitchen Dashboard</Title>
      {orders.map((order, index) => (
        <div key={index}>
          <p>Table {order.tableID}</p> {/* Display the tableID */}
          {order.cartItems &&
            Array.isArray(order.cartItems) &&
            order.cartItems.map((item, index) => (
              <div key={index}>
                <p>{item.itemName}</p>
                <p>
                  Price: {parseInt(item.price.split(" ")[0]) * item.quantity}{" "}
                  {item.price.split(" ")[1]}
                </p>
              </div>
            ))}
          <p>
            Total Amount :{" "}
            {order.cartItems &&
              Array.isArray(order.cartItems) &&
              order.cartItems.reduce(
                (total, item) =>
                  total + parseInt(item.price.split(" ")[0]) * item.quantity,
                0
              )}
          </p>
          <Button
            onClick={() => handleOrderReceived(order)}
            className={doneOrders.includes(order.tableID) ? "done" : ""}
            disabled={doneOrders.includes(order.tableID)}
          >
            {order.status}
          </Button>
        </div>
      ))}
    </div>
  );
}

export default KitchenStaff;
