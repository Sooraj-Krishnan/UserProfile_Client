import { Layout } from "antd";
const { Content } = Layout;

import WaiterSidebar from "../../components/sidebar/WaiterSidebar";
import Waiter from "../../components/dashboard/waiterDashboard/WaiterDashboard";
function WaiterDashboard() {
  return (
    <div className="flex">
      <Layout>
        <WaiterSidebar />
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: "white",
          }}
        >
          <Waiter />
        </Content>
      </Layout>
    </div>
  );
}

export default WaiterDashboard;
