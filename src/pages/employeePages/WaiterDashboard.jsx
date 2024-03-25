import { useContext } from "react";
import NavBar from "../../components/navBar/NavBar";
import { ThemeContext } from "../../components/state-management/ThemeContext";
import { Layout } from "antd";
const { Content } = Layout;

import WaiterSidebar from "../../components/sidebar/WaiterSidebar";
import Waiter from "../../components/dashboard/waiterDashboard/WaiterDashboard";

function WaiterDashboard() {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="flex">
      <Layout>
        <WaiterSidebar />
        <NavBar>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: theme === "dark" ? "#111827" : "white",
            }}
          >
            <Waiter />
          </Content>
        </NavBar>
      </Layout>
    </div>
  );
}

export default WaiterDashboard;
