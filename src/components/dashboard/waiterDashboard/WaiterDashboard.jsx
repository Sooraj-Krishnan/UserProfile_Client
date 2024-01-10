import { Typography } from "antd";
import { useEffect, useState, useRef } from "react";
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
      console.log("connected to server", socketRef.current.id);
      // Update the orders state with the new order details
      setOrders((prevOrders) => [
        ...prevOrders,
        ...(Array.isArray(orderDetails) ? orderDetails : [orderDetails]),
      ]);
    });
    // Listen for 'mealPreparationStarted' events
    socketRef.current.on("mealPreparationStarted", (order) => {
      // Update the order status to 'Meals preparation started'
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.tableID === order.tableID
            ? { ...o, status: "Meals preparation started" }
            : o
        )
      );
    });
    // Listen for 'orderReady' events
    socketRef.current.on("orderReady", (order) => {
      // Update the orderReady state with the tableID of the ready order
      setOrderReady((prevOrderReady) => [...prevOrderReady, order.tableID]);
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, []);
  return (
    <div>
      <Title level={1}>Hello</Title>
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
          <button
            className="items-confirm-button"
            onClick={async () => {
              if (socketRef.current) {
                socketRef.current.emit("confirm", order);
                try {
                  await updateOrderStatus(order.orderId); // Call the function with the order ID
                  // After the status is updated in the database, update it in the state as well
                  setOrders((prevOrders) =>
                    prevOrders.map((o) => (o._id === order._id ? { ...o } : o))
                  );
                  toast.success("Order confirmed");
                } catch (error) {
                  console.error(error); // Log any errors
                }
              }
            }}
          >
            CONFIRM
          </button>
          <p>{order.status}</p>
          {orderReady.includes(order.tableID) && <p>ORDER READY</p>}
        </div>
      ))}
      <ToastContainer />
    </div>
  );
}

export default Waiter;
