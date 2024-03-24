import {
  //  MenuFoldOutlined,
  // MenuUnfoldOutlined,
  PieChartOutlined,
  LogoutOutlined,
  // ExclamationCircleFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import { Menu, Layout } from "antd";
import { useState } from "react";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
import { logout } from "../../api/AdminRequest";

import { Modal } from "antd";
import { useMediaQuery } from "react-responsive";

import ZEEQR_White from "../../assets/images/ZEEQR_White.svg";

const { confirm } = Modal;
const { Sider } = Layout;
// const { SubMenu } = Menu;

function WaiterSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const isLargeScreen = useMediaQuery({ query: "(min-width: 992px)" });
  const navigate = useNavigate();

  const items = [
    {
      label: "Dashboard",
      key: "/manager-dashboard",
      icon: <PieChartOutlined />,
    },
    { label: "SignOut", key: "/signout", icon: <LogoutOutlined /> },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === "/signout") {
      confirm({
        title: "Do you Want to Signout",
        icon: <ExclamationCircleOutlined />,
        onOk() {
          const signout = async () => {
            try {
              const refToken = await localStorage.getItem("waiter-refToken");
              const { data } = await logout(refToken);
              if (data.success) {
                localStorage.clear();
                navigate("/employee-login");
              }
            } catch (error) {
              console.log(error.response.data);
              localStorage.clear();
              navigate("/employee-login");
            }
          };
          signout();
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    } else {
      navigate(key);
    }
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      style={{ height: "100vh" }}
      breakpoint="lg"
      collapsedWidth="0"
      trigger={isLargeScreen ? null : undefined}
    >
      <div className="logo">
        <img src={ZEEQR_White} alt="ZEEQR" />
      </div>
      <Menu
        theme="dark"
        defaultSelectedKeys={[window.location.pathname]}
        mode="inline"
        onClick={handleMenuClick}
      >
        {items.map((item) => (
          <Menu.Item key={item.key} icon={item.icon}>
            {item.label}
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
  );
}

export default WaiterSidebar;
