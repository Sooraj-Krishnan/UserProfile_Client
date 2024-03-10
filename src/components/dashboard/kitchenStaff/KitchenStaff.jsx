import { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import { Typography, Button, Input } from "antd";
import Countdown from "react-countdown";
import { updateOrderStatus } from "../../../api/PublicRequest";
import "./kitchenStaff.css";

const { Title } = Typography;

function KitchenStaff() {
  const [orders, setOrders] = useState([]);
  const [doneOrders, setDoneOrders] = useState([]);
  const [inputValue, setInputValue] = useState("");
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

  const handleOrderReceived = async (order) => {
    // Find the complete order data from the orders state
    const orderData = orders.find((o) => o.orderId === order.orderId);

    if (order.status === "ORDER RECEIVED") {
      // Emit 'mealPreparationStarted' event to the order detail
      socket.emit("mealPreparationStarted", {
        ...orderData,
        orderId: order.orderId,
        time: inputValue,
      });
      // Update the order status to 'DONE'
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.orderId === order.orderId ? { ...o, status: "DONE" } : o
        )
      );
      try {
        await updateOrderStatus(order.orderId, "Meals preparation started");
      } catch (error) {
        console.error(error);
      }
    } else if (order.status === "DONE") {
      // Emit 'orderReady' event to the order detail
      socket.emit("orderReady", { ...orderData, orderId: order.orderId });
      // Update the order status to 'ORDER READY'
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.orderId === order.orderId ? { ...o, status: "ORDER READY" } : o
        )
      );

      // Update the order status in the backend
      try {
        await updateOrderStatus(order.orderId, "ORDER READY");
      } catch (error) {
        console.error(error);
      }

      setDoneOrders((prevDoneOrders) => [...prevDoneOrders, order.orderId]);
    }
  };
  const renderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <p>Time's up!</p>;
    } else {
      // Render a countdown
      return (
        <p>
          Time remaining: {minutes}:{seconds < 10 ? "0" : ""}
          {seconds}
        </p>
      );
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
          {order.specialInstructions ? (
            <p>Cooking Instructions: {order.specialInstructions}</p>
          ) : null}
          <p>Total Amount: {order.totalAmount}</p>
          <p>
            Completed in:{" "}
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </p>
          <Button
            onClick={() => handleOrderReceived(order)}
            className={doneOrders.includes(order.orderId) ? "done" : ""}
            disabled={doneOrders.includes(order.orderId)}
            style={{
              backgroundColor: doneOrders.includes(order.orderId)
                ? "#038009"
                : "blue",
              color: "white",
            }}
          >
            {order.status}
            {order.status === "ORDER RECEIVED" && order.time && (
              <Countdown
                date={Date.now() + order.time * 60 * 1000}
                renderer={renderer}
              />
            )}
          </Button>
        </div>
      ))}
    </div>
  );
}

export default KitchenStaff;
