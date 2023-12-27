import { useState, useEffect } from "react";
import { Button, Typography, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { managerDashboard } from "../../api/ManagerRequest";
import "./ManagerDashboard.css";

const { Title } = Typography;

const ManagerDasboard = () => {
  const navigate = useNavigate();
  const [managerName, setManagerName] = useState("");

  const handleButtonClick = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const fetchManagerData = async () => {
      try {
        const { data } = await managerDashboard();
        setManagerName(data.data.name);
      } catch (error) {
        console.error(error);
      }
    };

    fetchManagerData();
  }, []);

  return (
    <div className="relative flex">
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
    </div>
  );
};

export default ManagerDasboard;
