import { List, Typography } from "antd";
import { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";

const { Title } = Typography;

function Waiter() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const waiterId = localStorage.getItem("waiter-id");
    const socket = socketIOClient(import.meta.env.VITE_REACT_APP_SERVER_URL);
    socket.emit("login", waiterId);
    //Listen for 'order' events
    socket.on("orders", (orderDetails) => {
      console.log("connected to server", socket.id);
      // Update the orders state with the new order details
      setOrders((prevOrders) => [
        ...prevOrders,
        ...(Array.isArray(orderDetails) ? orderDetails : [orderDetails]),
      ]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <div>
      <Title level={1}>Welcome Back, !</Title>
      <List
        itemLayout="horizontal"
        dataSource={orders}
        renderItem={(order) => (
          <List.Item>
            <List.Item.Meta
              title={`Table ${order.tableID}`}
              description={`Order: ${order.cartItems
                .map((item) => item.itemName)
                .join(", ")}`}
            />
          </List.Item>
        )}
      />
    </div>
  );
}

export default Waiter;
