import { Typography } from "antd";
import { useEffect, useState, useRef } from "react";
import socketIOClient from "socket.io-client";
import "./WaiterDashboard.css";

const { Title } = Typography;

function Waiter() {
  const [orders, setOrders] = useState([]);
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
            onClick={() => {
              if (socketRef.current) {
                socketRef.current.emit("confirm", order);
              }
            }}
          >
            CONFIRM
          </button>
        </div>
      ))}
    </div>
  );
}

export default Waiter;
