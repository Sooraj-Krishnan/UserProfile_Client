import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./ManagerDashboard.css";

const ManagerDasboard = () => {
  const navigate = useNavigate();

  const handleButtonClick = (path) => {
    navigate(path);
  };

  return (
    <div className="relative flex">
      <Button
        size="large"
        className="add-button"
        style={{ backgroundColor: "#1f6ff0", color: "white" }}
        onClick={() => handleButtonClick("/create-table")}
      >
        <span className="add-button-icon">
          <PlusOutlined />
        </span>{" "}
        Create Table
      </Button>
      <Button
        size="large"
        className="add-button"
        style={{ backgroundColor: "#1f6ff0", color: "white" }}
        onClick={() => handleButtonClick("/create-waiter")}
      >
        <span className="add-button-icon">
          <PlusOutlined />
        </span>{" "}
        Create Waiter
      </Button>
      <Button
        size="large"
        className="add-button"
        style={{ backgroundColor: "#1f6ff0", color: "white" }}
        onClick={() => handleButtonClick("/create-kitchen-staff")}
      >
        <span className="add-button-icon">
          <PlusOutlined />
        </span>{" "}
        Create Kitchen Staff
      </Button>
    </div>
  );
};

export default ManagerDasboard;
