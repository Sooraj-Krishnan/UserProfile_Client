import { useQuery } from "@tanstack/react-query";
import { Typography, Card, Spin } from "antd";
import { useEffect, useState, useRef } from "react";
import Countdown from "react-countdown";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import socketIOClient from "socket.io-client";

import { updateOrderStatus, getOrderDetails } from "../../../api/PublicRequest";

import "./WaiterDashboard.css";
import ms from "ms";

const { Title } = Typography;

function Waiter() {
  const [orders, setOrders] = useState([]);
  const [orderReady, setOrderReady] = useState([]);
  const [loader, setLoader] = useState(true);
  const socketRef = useRef();

  const fetchOrderDetails = async () => {
    const { data } = await getOrderDetails();
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
  // useEffect(() => {
  //   if (orderDetails) {
  //     setOrders(
  //       orderDetails.orders.map((order) => ({ ...order, confirmed: false }))
  //     );
  //   }
  // }, [orderDetails]);

  useEffect(() => {
    if (orderDetails) {
      setOrders(
        orderDetails.orders.map((order) => ({
          ...order,
          confirmed: order.status !== "Order Received",
        }))
      );
    }
  }, [orderDetails]);

  useEffect(() => {
    setLoader(isLoading);
  }, [isLoading]);

  useEffect(() => {
    const waiterId = localStorage.getItem("waiter-id");
    socketRef.current = socketIOClient(
      import.meta.env.VITE_REACT_APP_SERVER_URL
    );
    socketRef.current.emit("login", waiterId);
    //Listen for 'order' events
    socketRef.current.on("orders", (orderDetails) => {
      console.log("Order Details", orderDetails);
      localStorage.setItem("orderDetails", JSON.stringify(orderDetails));
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
      return (
        <button className="timeButton">
          <p style={{ color: "red" }}>Time's up!</p>
        </button>
      );
    } else {
      // Render a countdown
      return (
        <button className="timeButton">
          <div className="timeRemainingText">
            Order Preparing:
            <div className="timeRemainingContainer">
              <span className="timeRemainingDigits">
                {minutes}:{seconds < 10 ? "0" : ""}
                {seconds}
              </span>
            </div>
          </div>
        </button>
      );
    }
  };
  return (
    <div>
      <Spin spinning={loader} size="large" tip="Loading Orders...">
        <Title level={1}>Waiter Dashboard</Title>
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
                  <span className="column-header">Price</span>
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
                  <span className="column-item price">
                    {parseInt(item.price.split(" ")[0]) * item.quantity}{" "}
                    {item.price.split(" ")[1]}
                  </span>
                </div>
              ))}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p>Total Amount :</p>
              <p>{order.totalAmount}</p>
            </div>

            {/* <p style={{ color: "green" }}>{order.status}</p> */}
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
                    await updateOrderStatus(
                      order.orderId,
                      "Confirmed by waiter"
                    ); // Call the function with the order ID

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
              style={{
                fontSize: "1.1rem",
                borderRadius: "2rem",
                padding: "0.5rem 11rem",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {order.confirmed ? "CONFIRMED" : "CONFIRM"}
            </button>
          </Card>
        ))}
        <ToastContainer />
      </Spin>
    </div>
  );
}

export default Waiter;
