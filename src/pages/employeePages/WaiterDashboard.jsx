import { Layout } from "antd";
const { Content } = Layout;
import KitchenStaffSidebar from "../../components/sidebar/KitchenStaffSidebar";
import Waiter from "../../components/dashboard/waiterDashboard/WaiterDashboard";
function WaiterDashboard() {
  return (
    <div className="flex">
      <Layout>
        <KitchenStaffSidebar />
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
