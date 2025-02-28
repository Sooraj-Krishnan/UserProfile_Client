import {
  //  MenuFoldOutlined,
  // MenuUnfoldOutlined,
  PieChartOutlined,
  LogoutOutlined,
  // ExclamationCircleFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { FcBusinessman } from "react-icons/fc";
import { Menu, Layout } from "antd";
import { useState } from "react";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
import { logout } from "../../api/AdminRequest";

import { Modal } from "antd";

//import ZEEQR_White from "../../assets/images/ZEEQR_White.svg";
import Voosh from "../../assets/images/VooshLogo.webp";

const { confirm } = Modal;
const { Sider } = Layout;
// const { SubMenu } = Menu;

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();

  const items = [
    { label: "Dashboard", key: "/admin-dashboard", icon: <PieChartOutlined /> },
    // { label: "Managers", key: "/view-managers", icon: <FcBusinessman /> },
    { label: "View Users", key: "/view-users", icon: <FcBusinessman /> },
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
              const refToken = await localStorage.getItem("admin-refToken");
              const { data } = await logout(refToken);
              if (data.success) {
                localStorage.clear();
                navigate("/login");
              }
            } catch (error) {
              console.log(error.response.data);
              localStorage.clear();
              navigate("/login");
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
    >
      <div className="logo">
        <img src={Voosh} alt="ZEEQR" />
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

export default Sidebar;
