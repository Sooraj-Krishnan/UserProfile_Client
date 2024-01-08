import { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import { Typography } from "antd";

const { Title } = Typography;

function KitchenStaff() {
  const [orders, setOrders] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = socketIOClient(import.meta.env.VITE_REACT_APP_SERVER_URL);
    // Listen for 'confirmOrder' events
    socket.on("confirmOrder", (order) => {
      // Update the orders state with the new order
      setOrders((prevOrders) => [...prevOrders, order]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);
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
        </div>
      ))}
    </div>
  );
}

export default KitchenStaff;
