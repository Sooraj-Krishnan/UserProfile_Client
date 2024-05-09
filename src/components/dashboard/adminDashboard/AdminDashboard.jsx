import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import { Button, Typography, Row, Col, Spin, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";
//import { PiCardsFill } from "react-icons/pi";
//import { FcBusinessman } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { adminDashboard } from "../../../api/AdminRequest";
const { Title } = Typography;
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const handleButtonClick = () => {
    navigate("/create-manager");
  };

  const fetchAdminData = async () => {
    const { data } = await adminDashboard();
    return data;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["adminData"],
    queryFn: fetchAdminData,
    staleTime: ms("1d"),
  });

  const adminName = data?.admin?.name;
  // const managerCount = data?.managerCount;
  const cardLimit = data?.cardLimit;
  const totalUsedCards = data?.totalUsedCards;
  const remainingCards = cardLimit - totalUsedCards;
  if (error) {
    console.log(error.message);
    if (error.respose && error.response.status === 403) {
      // ErrorLogout(error);
    }
  }
  useEffect(() => {
    setLoader(isLoading);
  }, [isLoading]);

  return (
    <div>
      <Spin spinning={loader} size="large">
        <Row style={{ width: "100%" }}>
          <Col span={12}>
            <Title level={1}>{`Hello, ${adminName}`}</Title>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            <Tooltip title={remainingCards === 0 ? "Card limit over" : ""}>
              <Button
                size="large"
                style={{
                  backgroundColor: "#1f6ff0",
                  color: "white",
                  position: "absolute",
                  top: 20,
                  left: 250,
                }}
                onClick={handleButtonClick}
                disabled={remainingCards === 0}
              >
                <span className="add-button-icon">
                  <PlusOutlined />
                </span>{" "}
                Create Manager
              </Button>
            </Tooltip>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default AdminDashboard;
