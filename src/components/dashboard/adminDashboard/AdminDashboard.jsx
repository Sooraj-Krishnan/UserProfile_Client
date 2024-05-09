import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import {
  Button,
  Typography,
  Row,
  Col,
  Card,
  Spin,
  Statistic,
  Tooltip,
  Alert,
  Space,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { PiCardsFill } from "react-icons/pi";
import { FcBusinessman } from "react-icons/fc";
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
  const managerCount = data?.managerCount;
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
        {/* {remainingCards <= 2 && (
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
        )} */}

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
        <Row gutter={16}>
          <Col span={6}>
            <Card bordered={true}>
              <Statistic
                title="Total Managers"
                value={managerCount}
                valueStyle={{ color: "#5bc1f0", fontSize: "35px" }}
                prefix={
                  <FcBusinessman
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
      </Spin>
    </div>
  );
};

export default AdminDashboard;
