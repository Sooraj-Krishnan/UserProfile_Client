import { Layout } from "antd";
const { Content } = Layout;
import ManagerSidebar from "../../components/sidebar/ManagerSidebar";
import ManagerDasboard from "../../components/dashboard/ManagerDasboard";

function ManagerDashboardPage() {
  return (
    <div className="flex">
      <Layout>
        <ManagerSidebar />
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: "white",
          }}
        >
          <ManagerDasboard />
        </Content>
      </Layout>
    </div>
  );
}

export default ManagerDashboardPage;
