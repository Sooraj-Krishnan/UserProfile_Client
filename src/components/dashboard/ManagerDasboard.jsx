import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const ManagerDasboard = () => {
  const navigate = useNavigate();

  const handleButtonClick = (path) => {
    navigate(path);
  };

  return (
    <div className="relative flex">
      <Button
        size="large"
        style={{
          backgroundColor: "#1f6ff0",
          color: "white",
          margin: "20px",
        }}
        onClick={() => handleButtonClick("/create-table")}
      >
        <PlusOutlined /> Create Table
      </Button>
      <Button
        size="large"
        style={{
          backgroundColor: "#1f6ff0",
          color: "white",
          margin: "20px",
        }}
        onClick={() => handleButtonClick("/create-waiter")}
      >
        <PlusOutlined /> Create Waiter
      </Button>
      <Button
        size="large"
        style={{
          backgroundColor: "#1f6ff0",
          color: "white",
          margin: "20px",
        }}
        onClick={() => handleButtonClick("/create-kitchen-staff")}
      >
        <PlusOutlined /> Create Kitchen Staff
      </Button>
    </div>
  );
};

export default ManagerDasboard;
