import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import { Typography, Button, Input, Card, Spin } from "antd";
import Countdown from "react-countdown";
import {
  updateOrderStatus,
  getOrderDetailsToKitchen,
} from "../../../api/PublicRequest";
import "./kitchenStaff.css";
import ms from "ms";
const { Title } = Typography;

function KitchenStaff() {
  const [orders, setOrders] = useState([]);
  const [doneOrders, setDoneOrders] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [socket, setSocket] = useState(null);
  const [loader, setLoader] = useState(true);

  const fetchOrderDetails = async () => {
    const { data } = await getOrderDetailsToKitchen();
    console.log("data", data);
    return data;
  };
  const {
    data: orderDetails,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["orderDetails"],
    queryFn: fetchOrderDetails,
    staleTime: ms("1d"),
  });
  if (error) {
    console.log(error);
  }
  useEffect(() => {
    if (orderDetails) {
      setOrders(
        orderDetails.orders.map((order) => ({ ...order, confirmed: false }))
      );
    }
  }, [orderDetails]);
  useEffect(() => {
    setLoader(isLoading);
  }, [isLoading]);

  useEffect(() => {
    const socketIO = socketIOClient(import.meta.env.VITE_REACT_APP_SERVER_URL);
    setSocket(socketIO);
    // Listen for 'confirmOrder' events
    socketIO.on("confirmOrder", (order) => {
      console.log("Received confirmOrder event:", order);
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
        await updateOrderStatus(
          order.orderId,
          "Order Preparation Started",
          inputValue
        );
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
      <Spin spinning={loader} size="large" tip="Loading Orders...">
        <Title level={1}>Kitchen Dashboard</Title>
        {orders.map((order, index) => (
          <Card
            key={index}
            title={
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span className="column-header">Table {order.tableID}</span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span className="column-header">Items</span>
                  <span className="column-header">Quantity</span>
                </div>
              </div>
            }
            bordered={false}
            style={{ width: 400, marginBottom: "20px" }}
          >
            {order.cartItems &&
              Array.isArray(order.cartItems) &&
              order.cartItems.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                >
                  <span className="column-item">{item.itemName}</span>
                  <span className="column-item quantity">{item.quantity}</span>
                </div>
              ))}
            {order.specialInstructions && (
              <>
                <p>Cooking Instructions:</p>
                <Input.TextArea
                  value={order.specialInstructions}
                  autoSize
                  readOnly
                />
              </>
            )}
            <p>
              Completed in (minutes):{" "}
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </p>
            <Button
              onClick={() => handleOrderReceived(order)}
              className={`items-confirm-button ${
                doneOrders.includes(order.orderId) ? "done" : ""
              }`}
              disabled={doneOrders.includes(order.orderId)}
              style={{
                fontSize: "1.1rem",
                borderRadius: "2rem",
                padding: "1.3rem 11rem",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
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
          </Card>
        ))}
      </Spin>
    </div>
  );
}

export default KitchenStaff;
