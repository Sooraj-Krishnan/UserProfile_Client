import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import {
  Button,
  Typography,
  Row,
  Col,
  List,
  Card,
  Spin,
  Statistic,
  Alert,
  Space,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { FcManager } from "react-icons/fc";
import { PiCardsFill } from "react-icons/pi";
import { GiRoundTable } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import Countdown from "react-countdown";
import { managerDashboard } from "../../../api/ManagerRequest";
import socketIOClient from "socket.io-client";
import "./ManagerDashboard.css";

const { Title } = Typography;

const ManagerDashboard = () => {
  const navigate = useNavigate();
  // const [managerName, setManagerName] = useState("");
  const [orders, setOrders] = useState([]);
  const [, setSocket] = useState(null);
  const [loader, setLoader] = useState(true);

  const handleButtonClick = (path) => {
    navigate(path);
  };

  const fetchManagerData = async () => {
    const { data } = await managerDashboard();
    return data;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["managerData"],
    queryFn: fetchManagerData,
    staleTime: ms("1d"),
  });

  const managerName = data?.manager?.name;
  const waiterCount = data?.waiterCount;
  const tableCount = data?.tableCount;
  const cardLimit = data?.cardLimit;
  const remainingCards = cardLimit - tableCount;
  if (error) {
    console.log(error.message);
    if (error.respose && error.response.status === 403) {
      // ErrorLogout(error);
    }
  }
  useEffect(() => {
    setLoader(isLoading);
  }, [isLoading]);

  useEffect(() => {
    const socketIO = socketIOClient(import.meta.env.VITE_REACT_APP_SERVER_URL);
    setSocket(socketIO);

    // Listen for 'managerOrders' events
    socketIO.on("managerOrders", (order) => {
      // Update the orders state with the new order
      setOrders((prevOrders) => {
        const existingOrderIndex = prevOrders.findIndex(
          (o) => o.orderId === order.orderId
        );
        if (existingOrderIndex !== -1) {
          // Update the status of the existing order
          const updatedOrders = [...prevOrders];
          updatedOrders[existingOrderIndex] = {
            ...order,
            status: "ORDER RECEIVED",
          };
          return updatedOrders;
        } else {
          // Add the new order
          return [...prevOrders, { ...order, status: "ORDER RECEIVED" }];
        }
      });
    });

    // Listen for 'confirmOrder' events
    socketIO.on("confirmOrder", (order) => {
      // Update the orders state with the new order
      setOrders((prevOrders) => {
        const existingOrderIndex = prevOrders.findIndex(
          (o) => o.orderId === order.orderId
        );
        if (existingOrderIndex !== -1) {
          // Update the status of the existing order
          const updatedOrders = [...prevOrders];
          updatedOrders[existingOrderIndex] = {
            ...order,
            status: "ORDER CONFIRMED",
          };
          return updatedOrders;
        } else {
          // Add the new order
          return [...prevOrders, { ...order, status: "ORDER CONFIRMED" }];
        }
      });
    });

    // Listen for 'mealPreparationStarted' events
    socketIO.on("mealPreparationStarted", (order) => {
      // Update the orders state with the new order
      setOrders((prevOrders) => {
        const existingOrderIndex = prevOrders.findIndex(
          (o) => o.orderId === order.orderId
        );
        if (existingOrderIndex !== -1) {
          // Update the status of the existing order
          const updatedOrders = [...prevOrders];
          updatedOrders[existingOrderIndex] = {
            ...order,
            status: "MEAL PREPARATION STARTED",
            time: order.time,
          };
          return updatedOrders;
        } else {
          // Add the new order
          return [
            ...prevOrders,
            { ...order, status: "MEAL PREPARATION STARTED" },
          ];
        }
      });
    });

    // Listen for 'orderReady' events
    socketIO.on("orderReady", (order) => {
      // Update the orders state with the new order
      setOrders((prevOrders) => {
        const existingOrderIndex = prevOrders.findIndex(
          (o) => o.orderId === order.orderId
        );
        if (existingOrderIndex !== -1) {
          // Update the status of the existing order
          const updatedOrders = [...prevOrders];
          updatedOrders[existingOrderIndex] = {
            ...order,
            status: "ORDER READY",
          };
          return updatedOrders;
        } else {
          // Add the new order
          return [...prevOrders, { ...order, status: "ORDER READY" }];
        }
      });
    });
    return () => {
      socketIO.disconnect();
    };
  }, []);

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
      <Spin spinning={loader}>
        {remainingCards <= 2 && (
          <Space
            direction="vertical"
            style={{
              width: "100%",
            }}
          >
            <Alert
              message="Card Limit is going to be reached, contact metasoft.ae to buy more cards"
              type="warning"
              closable
            />
          </Space>
        )}
        <Row style={{ width: "100%" }}>
          <Col span={12}>
            <Title level={1}>{`Hello, ${managerName}`}</Title>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            <Button
              size="large"
              className="add-button"
              style={{ backgroundColor: "#1f6ff0", color: "white" }}
              onClick={() => handleButtonClick("/all-menu-cards")}
            >
              <span className="add-button-icon">
                <PlusOutlined />
              </span>{" "}
              View Menu Card
            </Button>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={6}>
            <Card bordered={true}>
              <Statistic
                title="Total Waiters"
                value={waiterCount}
                valueStyle={{ color: "#5bc1f0", fontSize: "35px" }}
                prefix={
                  <FcManager
                    style={{
                      fontSize: "35px",
                      marginRight: "8px",
                      verticalAlign: "middle",
                    }}
                  />
                }
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={true}>
              <Statistic
                title="Total Tables"
                value={tableCount}
                valueStyle={{ color: "#595212", fontSize: "35px" }}
                prefix={
                  <GiRoundTable
                    style={{
                      fontSize: "35px",
                      marginRight: "8px",
                      verticalAlign: "middle",
                    }}
                  />
                }
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={true}>
              <Statistic
                title="Card Limit"
                value={cardLimit}
                valueStyle={{ color: "#3f8600", fontSize: "35px" }}
                prefix={
                  <PiCardsFill
                    style={{
                      fontSize: "35px",
                      marginRight: "8px",
                      verticalAlign: "middle",
                    }}
                  />
                }
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={true}>
              <Statistic
                title="Remaining Cards"
                value={remainingCards}
                valueStyle={{ color: "#fa0f02", fontSize: "35px" }}
                prefix={
                  <PiCardsFill
                    style={{
                      fontSize: "35px",
                      marginRight: "8px",
                      verticalAlign: "middle",
                    }}
                  />
                }
              />
            </Card>
          </Col>
        </Row>
        <Row style={{ width: "100%" }}>
          <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={orders}
            renderItem={(order) => (
              <List.Item>
                <Card
                  title={`Order ${order.orderId}`}
                  style={{
                    width: 300,
                  }}
                >
                  <p>Table: {order.tableID}</p>

                  {order.cartItems &&
                    Array.isArray(order.cartItems) &&
                    order.cartItems.map((item, index) => (
                      <div key={index}>
                        <p>{item.itemName}</p>
                        <p>
                          Price:{" "}
                          {parseInt(item.price.split(" ")[0]) * item.quantity}{" "}
                          {item.price.split(" ")[1]}
                        </p>
                      </div>
                    ))}
                  <p>Total Amount: {order.totalAmount}</p>
                  <Title level={4}>Status: {order.status}</Title>
                  {order.status === "MEAL PREPARATION STARTED" && (
                    <Countdown
                      date={Date.now() + order.time * 60 * 1000}
                      renderer={renderer}
                    />
                  )}
                </Card>
              </List.Item>
            )}
          />
        </Row>
      </Spin>
    </div>
  );
};

export default ManagerDashboard;
