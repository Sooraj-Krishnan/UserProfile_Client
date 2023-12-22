import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/create-manager");
  };

  return (
    <div className="relative">
      <Button
        type="primary"
        style={{
          backgroundColor: "blue",
          color: "white",
          position: "absolute",
          top: 20,
          left: 250,
        }}
        onClick={handleButtonClick}
      >
        <PlusOutlined /> Create Manager
      </Button>
    </div>
  );
};

export default AdminDashboard;
