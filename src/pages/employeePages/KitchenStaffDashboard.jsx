import { useContext } from "react";

import { ThemeContext } from "../../components/state-management/ThemeContext";
import NavBar from "../../components/navBar/NavBar";

import { Layout } from "antd";
const { Content } = Layout;
import KitchenStaffSidebar from "../../components/sidebar/KitchenStaffSidebar";
import KitchenStaff from "../../components/dashboard/kitchenStaff/KitchenStaff";

function KitchenStaffContent() {
  const { theme } = useContext(ThemeContext);

  return (
    <Content
      style={{
        margin: "24px 16px",
        padding: 24,
        minHeight: 280,
        background: theme === "dark" ? "#111827" : "white",
      }}
    >
      <KitchenStaff />
    </Content>
  );
}

function KitchenStaffDashboard() {
  return (
    <div className="flex">
      <Layout>
        <KitchenStaffSidebar />
        <NavBar>
          <KitchenStaffContent />
        </NavBar>
      </Layout>
    </div>
  );
}

export default KitchenStaffDashboard;
