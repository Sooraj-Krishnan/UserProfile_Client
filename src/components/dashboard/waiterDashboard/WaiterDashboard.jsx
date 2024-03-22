import { Typography } from "antd";
import { useEffect, useState, useRef } from "react";
import Countdown from "react-countdown";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import socketIOClient from "socket.io-client";
import { updateOrderStatus } from "../../../api/PublicRequest";
import "./WaiterDashboard.css";

const { Title } = Typography;

function Waiter() {
  const [orders, setOrders] = useState([]);
  const [orderReady, setOrderReady] = useState([]);
  const socketRef = useRef();
  useEffect(() => {
    const waiterId = localStorage.getItem("waiter-id");
    socketRef.current = socketIOClient(
      import.meta.env.VITE_REACT_APP_SERVER_URL
    );
    socketRef.current.emit("login", waiterId);
    //Listen for 'order' events
    socketRef.current.on("orders", (orderDetails) => {
      console.log("Order Details", orderDetails);
      console.log("connected to server", socketRef.current.id);

      setOrders((prevOrders) => [
        ...prevOrders,
        ...(Array.isArray(orderDetails)
          ? orderDetails.map((order) => ({ ...order, confirmed: false }))
          : [{ ...orderDetails, confirmed: false }]),
      ]);
      // Clear the tableID from the orderReady state
      setOrderReady((prevOrderReady) =>
        prevOrderReady.filter((tableID) => tableID !== orderDetails.tableID)
      );
    });
    // Listen for 'mealPreparationStarted' events
    socketRef.current.on("mealPreparationStarted", (order) => {
      // Update the order status to 'Meals preparation started'
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.tableID === order.tableID
            ? { ...o, status: "Meals preparation started", time: order.time }
            : o
        )
      );
    });
    // Listen for 'orderReady' events
    socketRef.current.on("orderReady", (order) => {
      // Update the orderReady state with the tableID of the ready order
      setOrderReady((prevOrderReady) => [...prevOrderReady, order.tableID]);

      // Set isReady to true for the ready order
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.tableID === order.tableID ? { ...o, isReady: true } : o
        )
      );
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const renderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <p style={{ color: "red" }}>Time's up!</p>;
    } else {
      // Render a countdown
      return (
        <p>
          Time remaining:{" "}
          <span style={{ color: "red" }}>
            {minutes}:{seconds < 10 ? "0" : ""}
            {seconds}
          </span>
        </p>
      );
    }
  };
  return (
    <div>
      <Title level={1}>Waiter Dashboard</Title>
      {orders.map((order, index) => (
        <div key={index}>
          <p>Table {order.tableID}</p> {/* Display the tableID */}
          {order.cartItems &&
            Array.isArray(order.cartItems) &&
            order.cartItems.map((item, index) => (
              <div key={index}>
                <p>{item.itemName}</p>
                <p>Quantity: {item.quantity}</p>
                <p>
                  Price: {parseInt(item.price.split(" ")[0]) * item.quantity}{" "}
                  {item.price.split(" ")[1]}
                </p>
              </div>
            ))}
          <p>Total Amount: {order.totalAmount}</p>
          <p style={{ color: "green" }}>{order.status}</p>
          {order.status === "Meals preparation started" && !order.isReady && (
            <Countdown
              date={Date.now() + order.time * 60 * 1000}
              renderer={renderer}
            />
          )}
          {orderReady.includes(order.tableID) && <p>ORDER READY</p>}
          <button
            className={`items-confirm-button ${
              order.confirmed ? "confirmed" : ""
            }`}
            onClick={async () => {
              if (socketRef.current) {
                socketRef.current.emit("confirm", order);
                try {
                  await updateOrderStatus(order.orderId, "Confirmed by waiter"); // Call the function with the order ID

                  setOrders((prevOrders) =>
                    prevOrders.map((o) =>
                      o.orderId === order.orderId
                        ? { ...o, confirmed: true }
                        : o
                    )
                  );
                  toast.success("Order confirmed");
                } catch (error) {
                  console.error(error); // Log any errors
                }
              }
            }}
            disabled={order.confirmed}
          >
            {order.confirmed ? "CONFIRMED" : "CONFIRM"}
          </button>
        </div>
      ))}
      <ToastContainer />
    </div>
  );
}

export default Waiter;
